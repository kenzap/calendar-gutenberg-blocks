<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function kenzap_calendar_list_init() {
    $locale = is_admin() && function_exists( 'get_user_locale' ) ? get_user_locale() : get_locale();
    $locale = apply_filters( 'plugin_locale', $locale, 'kenzap-calendar' );

    unload_textdomain( 'kenzap-calendar' );
    load_textdomain( 'kenzap-calendar', __DIR__ . '/languages/kenzap-calendar-' . $locale . '.mo' );
    load_plugin_textdomain( 'kenzap-calendar', false, __DIR__ . '/languages' );
}
add_action( 'init', 'kenzap_calendar_list_init' );

//Load body class
function kenzap_calendar_list_body_class( $classes ) {

	if ( is_array($classes) ){ $classes[] = 'kenzap'; }else{ $classes.=' kenzap'; }
	return $classes;
}
add_filter( 'body_class', 'kenzap_calendar_list_body_class' );
add_filter( 'admin_body_class', 'kenzap_calendar_list_body_class' );

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 *
 * @since 1.0.0
 */
function kenzap_calendar_list_block_assets() {
	// Styles.
	wp_enqueue_style(
		'kenzap_calendar_list_style-css',
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ),
		array()
	);
}

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'kenzap_calendar_list_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function kenzap_calendar_list_editor_assets() {
	// Scripts.
	wp_enqueue_script(
		'kenzap-calendar', // Handle.
		plugins_url( 'dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
        array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-components', 'wp-editor', 'wp-date' ), // Dependencies, defined above.
        // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	// Styles.
	wp_enqueue_style(
		'kenzap-calendar', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: filemtime — Gets file modification time.
    );
    
    // This is only available in WP5.
	if ( function_exists( 'wp_set_script_translations' ) ) {
		wp_set_script_translations( 'kenzap-calendar', 'kenzap-calendar', KENZAP_CALENDAR . '/languages/' );
	}

	$pathToPlugin = plugins_url( 'dist/', dirname( __FILE__ ) );
    wp_add_inline_script( 'wp-blocks', 'var kenzap_calendar_gutenberg_path = "' .$pathToPlugin.'"', 'before');
} // End function kenzap_feature_list_cgb_editor_assets().

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'kenzap_calendar_list_editor_assets' );

function kenzap_calendar_add_specific_features( $post_object ) {
    if(!function_exists('has_blocks') || !function_exists('parse_blocks'))
        return;

    if ( has_blocks( $post_object ) ) {
        $pathToPlugin = plugins_url( 'dist/', dirname( __FILE__ ) );
        $blocks = parse_blocks( $post_object ->post_content );
        foreach ($blocks as $block) {
            if ($block['blockName'] == 'kenzap/calendar-1') {

                /* Ajax urls */
                $ajaxurl = '';
                if( in_array('sitepress-multilingual-cms/sitepress.php', get_option('active_plugins')) ){
                    $ajaxurl .= admin_url( 'admin-ajax.php?lang=' . ICL_LANGUAGE_CODE );
                } else{
                    $ajaxurl .= admin_url( 'admin-ajax.php');
                }
    
                wp_enqueue_script( 'kenzap/calendar-1-script', plugins_url( 'calendar-1/script.js', __FILE__ ), array('jquery') );

                wp_localize_script( 'kenzap/calendar-1-script', 'kenzapCalendar', array(
                    'expand'   => esc_html__( 'expand child menu', 'kenzap-calendar' ),
                    'prev'  => esc_html__('Prev', 'kenzap-calendar'),
                    'next'  => esc_html__('Next', 'kenzap-calendar'),
                    'ajaxurl'  => $ajaxurl,
                    'noposts'  => esc_html__('No records found', 'kenzap-calendar'),
                    'loadmore' => esc_html__('Load more', 'kenzap-calendar')
                ) );
            }
        }
    }
}
add_action( 'the_post', 'kenzap_calendar_add_specific_features' );

//register blocks
require_once 'calendar-1/init.php';

//register ajax calls
require_once 'calendar-1/block-ajax-init.php';