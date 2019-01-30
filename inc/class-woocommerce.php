<?php 

//add woocommerce support
add_theme_support('woocommerce');

//Store the custom field
function kenzap_calendar_add_cart_item_custom_data( $cart_item_meta, $product_id ) {

    //save date and time for visual representation
    $time = $_COOKIE['kenzap_booking_time'];
    $date = $_COOKIE['kenzap_booking_date'];
    $cart_item_meta['kenzap_cal_date_time'] = date_i18n( get_option( 'date_format' ) . ' ' . get_option('time_format'), strtotime( ($date." ".$time ) ) );

    return $cart_item_meta; 
}
add_filter( 'woocommerce_add_cart_item_data', 'kenzap_calendar_add_cart_item_custom_data', 10, 2 );

// Display custom data on cart and checkout page.
function kenzap_calendar_get_item_data ( $cart_data, $cart_item ) {

    $time = $_COOKIE['kenzap_booking_time'];
    $date = $_COOKIE['kenzap_booking_date'];
    $cart_item['kenzap_cal_date_time'] = date_i18n( get_option( 'date_format' ) . ' ' . get_option('time_format'), strtotime( ($date." ".$time ) ) );

    $cart_data[] = array(
        'name'    => esc_html__( "Date", "kenzap-calendar"),
        'display' => esc_html($cart_item['kenzap_cal_date_time'])
    );
    return $cart_data;
}
add_filter( 'woocommerce_get_item_data', 'kenzap_calendar_get_item_data' , 25, 2 );

//Get it from the session and add it to the cart variable
function kenzap_booking_get_cart_items_from_session( $item, $values, $key ) {

    if ( array_key_exists( 'kenzap_cal_date_time', $values ) )
    $item[ 'kenzap_cal_date_time' ] = $values['kenzap_cal_date_time'];

    if(isset($_POST['cart']))
        if ( array_key_exists( 'kenzap_cal_date_time', $_POST['cart'][$item['key']] ) )
            $item[ 'kenzap_cal_date_time' ] = sanitize_text_field( $_POST['cart'][$item['key']]['kenzap_cal_date_time'] );

    return $item;
}
add_filter( 'woocommerce_get_cart_item_from_session', 'kenzap_booking_get_cart_items_from_session', 1, 3 );

//pass custom cart field to checkout
function kenzap_booking_add_order_item_meta($item_id, $cart_item, $order_id) {
    
    if ( !empty( $cart_item->legacy_values['kenzap_cal_date_time'] ) ) {
        wc_add_order_item_meta($item_id, esc_html__( 'Date', 'kenzap-calendar' ), $cart_item->legacy_values['kenzap_cal_date_time']);
        wc_add_order_item_meta($item_id, 'ID', $_COOKIE['kenzap_calendar_id']."/".$_COOKIE['kenzap_booking_time_id']);
    }
}
add_action('woocommerce_new_order_item','kenzap_booking_add_order_item_meta', 10, 3);

// override order confirmation title
function kenzap_booking_order_title( $old_title ){
 
    $time = $_COOKIE['kenzap_booking_time'];

    //overrride only if order linked to calendar
    if(strlen($time)>0)
 	return esc_html__('Booking Confirmed','kenzap-calendar');
}
add_filter( 'woocommerce_endpoint_order-received_title', 'kenzap_booking_order_title' );

// override order confirmation text
function kenzap_booking_order_text( $old_title ){
 
    $time = $_COOKIE['kenzap_booking_time'];
    $date = $_COOKIE['kenzap_booking_date'];
    $df = date_i18n( get_option( 'date_format' ) . ' ' . get_option('time_format'), strtotime( ($date." ".$time ) ) );

    //override only if order linked to calendar
    if(strlen($time)>0)
    return '<b>'.esc_html__('Booking date:','kenzap-calendar').'</b> <span class="kp-conf-text">'.$df.'</span>';
}
add_filter( 'woocommerce_thankyou_order_received_text', 'kenzap_booking_order_text' );

// thank you page hook
function kenzap_booking_thankyou( $order_id ) {

    $blockBooking = false; 
    $month_id = $_COOKIE['kenzap_booking_month_id'];
    $day = $_COOKIE['kenzap_booking_day'];
    $time_id = $_COOKIE['kenzap_booking_time_id'];
    $time_max = $_COOKIE['kenzap_booking_time_max'];

    // for specific dates testing
    // $day = 29;
    // $time_id = 3;

    // Array ( [26] => Array ( [1] => 0 [1_max] => 1 ) )  
    // 26 = day of month, 1 = id of a time slot, 1_max = time slot's max bookings for this day
    $temp = get_option($month_id, '');
    $date_id_obj = json_decode( $temp, true );
    $time_id_max = $time_id."_max";
    $time_id_order = $time_id."_order";

    // no records found for selected day, create one and set defaults
    if ( !isset($date_id_obj[$day] ) ){
        $date_id_obj[$day] = array($time_id => 0, $time_id_max => $time_max, $time_id_order => []);  //, $time_id_order[] = $order_id 
    }

    // no records found for selected day/time slot id, create one and set defaults
    if ( !isset($date_id_obj[$day][$time_id] ) ){
        $date_id_obj[$day][$time_id] = 0;
        $date_id_obj[$day][$time_id_max] = $time_max;
        $date_id_obj[$day][$time_id_order] = [];// [] = $order_id;
    }

    // check if under this order booking slot was updated before
    if ( $date_id_obj[$day][$time_id] < intval($time_max) && !in_array($order_id,$date_id_obj[$day][$time_id_order])){
        $date_id_obj[$day][$time_id]+=1;
        $date_id_obj[$day][$time_id_order][] = $order_id;
    }else{
        $blockBooking = true;
    }

    //cache booking slot availability
    update_option($month_id, json_encode($date_id_obj)); 
}
add_action('woocommerce_thankyou', 'kenzap_booking_thankyou', 10, 1);

// set woocommerce order status change listener to withdraw booking reservations
function kenzap_calendar_woocommerce_order_status_changed( $id, $status_from, $status_to, $instance ) { 

    // clear booking amount
    $change = 0;
    $to = array('cancelled', 'failed', 'refunded');

    // decrease booking
    if ( in_array($status_to, $to) && !in_array($status_from, $to) ){
        $change = -1;
    }
    
    // increase booking
    if ( !in_array($status_to, $to) && in_array($status_from, $to) ){
        $change = 1;
    }
    
    // only save in case booking amounts should be updated
    if ( $change != 0 ){

        $line_items = $instance->get_items( 'line_item' );
        foreach ( $line_items as $item_id => $item ) {

            $cid = wc_get_order_item_meta($item_id, "ID", true); 
            $cid_arr = explode("/", $cid);
            $date = wc_get_order_item_meta($item_id, __( "Date", "kenzap-calendar"), true); 

            $day = date_i18n( 'd', strtotime( $date ) );
            $month_id = $cid_arr[0]."_".date_i18n( 'Y_m', strtotime( $date ) );
            $temp = get_option($month_id, '{}');

            if(isset($cid_arr[1])){
                $time_id = $cid_arr[1];
                $date_id_obj = json_decode( $temp, true );

                if(isset($date_id_obj[$day][$time_id])){
                    $date_id_obj[$day][$time_id] += $change;
                }
                print_r($date_id_obj[$day][$time_id]);
                
                update_option($month_id, json_encode($date_id_obj)); 
            }
        }
    }
};
add_action( 'woocommerce_order_status_changed', 'kenzap_calendar_woocommerce_order_status_changed', 10, 4 ); 