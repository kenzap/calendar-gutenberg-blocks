<?php
/**
 * Plugin Name: Kenzap Calendar
 * Plugin URI: https://github.com/kenzap/kenzap-calendar-gutenberg-blocks
 * Description: Display calendar section for appointments, reservations or bookings. Specify custom time slots. Link checkout process with WooCommerce.
 * Author: Kenzap
 * Author URI: https://kenzap.com/
 * Version: 1.0.1
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: kenzap-calendar
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define("KENZAP_CALENDAR", __DIR__);

//Check plugin requirements
if ( version_compare(PHP_VERSION, '5.6', '<') || !function_exists('register_block_type') ) {
    if (! function_exists('kenzap_calendar_disable_plugin')) {
        /**
         * Disable plugin
         *
         * @return void
         */
        function kenzap_calendar_disable_plugin(){

            if (current_user_can('activate_plugins') && is_plugin_active(plugin_basename(__FILE__))) {
                deactivate_plugins(__FILE__);
                unset($_GET['activate']);
            }
        }
    }

    if (! function_exists('kenzap_calendar_show_error')) {
        /**
         * Show error
         *
         * @return void
         */
        function kenzap_calendar_show_error(){

            echo '<div class="error"><p><strong>Kenzap Calendar</strong> needs at least PHP 5.6 version and WordPress 5.0, please update before installing the plugin.</p></div>';
        }
	}
	
    //Add actions
    add_action('admin_init', 'kenzap_calendar_disable_plugin');
    add_action('admin_notices', 'kenzap_calendar_show_error');

    //Do not load anything more
    return;
}

//load WooCommerce class
require_once __DIR__ . '/inc/class-woocommerce.php';

//load admin scripts
if ( is_admin() ) {

	//load dependencies
	require_once __DIR__ . '/inc/class-tgm-plugin-activation.php';
	require_once __DIR__ . '/inc/class-plugins.php';
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';