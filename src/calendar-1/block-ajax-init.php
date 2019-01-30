<?php
/**
 * Custom template tags for this theme.
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package myticket
 */

// get bookings per selected month 
add_action('wp_ajax_nopriv_kenzap_calendar_get_dates', 'kenzap_calendar_get_dates');
add_action('wp_ajax_kenzap_calendar_get_dates', 'kenzap_calendar_get_dates');
if ( ! function_exists( 'kenzap_calendar_get_dates' ) ) {
    function kenzap_calendar_get_dates() {

        $id                       = (isset($_POST['id'])) ? sanitize_text_field($_POST['id']) : '';

        echo get_option($id, '{}');
        
        wp_reset_postdata();
        wp_die();
    }
}

// get woocommerce product by id
add_action('wp_ajax_nopriv_kenzap_calendar_get_product', 'kenzap_calendar_get_product');
add_action('wp_ajax_kenzap_calendar_get_product', 'kenzap_calendar_get_product');
if ( ! function_exists( 'kenzap_calendar_get_product' ) ) {
    function kenzap_calendar_get_product() {

        $id                       = (isset($_POST['id'])) ? sanitize_text_field($_POST['id']) : '';


        $_product = wc_get_product( $id );
        $output = [];
        $output['title'] = $_product->get_title();
        $output['desc'] = $_product->get_short_description();
        $output['price'] = get_woocommerce_currency_symbol().$_product->get_price();

        echo json_encode($output);
        
        wp_reset_postdata();
        wp_die();
    }
}