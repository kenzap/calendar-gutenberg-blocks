<?php 

function kenzap_calendar_1() {

	require KENZAP_CALENDAR.'/src/commonComponents/container/container-var.php';

	$attributes = array(
		'align' => array(
			'type'    => 'string',
			'default' => '',
		),
		'serverSide'  => array(
			'type'    => 'boolean',
			'default' => false,
		),
		'cid' 	  	  => array(
			'type'	  => 'string',
			'default' => '1'
		),
		'product_id'  => array(
			'type'	  => 'string',
			'default' => '',
		),
		'start_date'  => array(
			'type' 	  => 'string',
			'default' => ''
		),
		'end_date' 	  => array(
			'type'	  => 'string',
			'default' => ''
		),
		'left_title' 	  => array(
			'type'	  => 'string',
			'default' => ''
		),
		'right_title' 	  => array(
			'type'	  => 'string',
			'default' => ''
		),
		'dof' 	  	  => array(
			'type'	  => 'number',
			'default' => '0'
		),
		'cbr' 	  	  => array(
			'type'	  => 'number',
			'default' => '5'
		),
		'ebr' 	  	  => array(
			'type'	  => 'number',
			'default' => '5'
		),
		'monday'      => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'tuesday'     => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'wednesday'   => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'thursday'    => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'friday'      => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'saturday'    => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'sunday'      => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'holidays'    	  => array(
			'type'    => 'number',
			'default' => 0,
		),
		'holidaysAr' => array(
			'type' 	  => 'array',
			'default' => [],
			'items'   => [
				'type' => 'object',
			],
		),
		'holidaysArBackup' => array(
			'type' 	  => 'array',
			'default' => [],
			'items'   => [
				'type' => 'object',
			],
		),
		'slots'    	  => array(
			'type'    => 'number',
			'default' => 0,
		),
		'timeSlotsAr' => array(
			'type' 	  => 'array',
			'default' => [],
			'items'   => [
				'type' => 'object',
			],
		),
		'timeSlotsArBackup' => array(
			'type' 	  => 'array',
			'default' => [],
			'items'   => [
				'type' => 'object',
			],
		),
		'dump_value' => array(
			'type' => 'string',	
			'default' => ''
		),
		'mainColor' => array(
			'type' => 'string',	
			'default' => '#ff6600'
		),
		'textColor' => array(
			'type' => 'string',	
			'default' => '#333333'
		),
		'textColor2' => array(
			'type' => 'string',	
			'default' => '#888888'
		),
	);

	// Register block PHP
	register_block_type( 'kenzap/calendar-1', array(
		'attributes'      => array_merge($contAttributes, $attributes),
		'render_callback' => 'kenzap_calendar_render_1',
	) );

    //backend rendering function
    function kenzap_calendar_render_1( $attributes ) {

        return require_once 'block.php';
	}
}
add_action( 'init', 'kenzap_calendar_1' );

?>