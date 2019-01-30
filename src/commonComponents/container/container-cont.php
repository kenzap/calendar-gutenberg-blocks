<?php
//kenzap container
$kenzapSize = 'kenzap-lg';
if ( $attributes['containerMaxWidth'] < 992 ) { $kenzapSize = 'kenzap-md'; }
if ( $attributes['containerMaxWidth'] < 768 ) { $kenzapSize = 'kenzap-sm'; }
if ( $attributes['containerMaxWidth'] < 480 ) { $kenzapSize = 'kenzap-xs'; }

//kenzap background
$backgroundRepeat = 'no-repeat';
$backgroundSize = 'auto';
$backgroundImage = $attributes['backgroundImage']; 
$backgroundColor = $attributes['backgroundColor']; 

switch ( $attributes['backgroundStyle'] ) {
	case 'default':
		$backgroundRepeat = 'no-repeat';
		$backgroundSize = 'auto';
		break;
	
	case 'contain':
		$backgroundRepeat = 'no-repeat';
		$backgroundSize = 'contain';
		break;

	case 'cover':
		$backgroundRepeat = 'no-repeat';
		$backgroundSize = 'cover';
		break;

	case 'repeat':
		$backgroundRepeat = 'repeat';
		$backgroundSize = 'auto';
}

//generate styles
$kenzapStyles = "padding-top:".esc_attr($attributes['containerPadding'])."px;padding-bottom:".esc_attr($attributes['containerPadding'])."px;background-color:".esc_attr($backgroundColor).";".(( strlen($attributes['backgroundImage']) > 5 ) ? 'background-image:url('.esc_url($attributes['backgroundImage']).');background-size:'.esc_attr($backgroundSize).';background-repeat:'.esc_attr($backgroundRepeat).';':'');
?>