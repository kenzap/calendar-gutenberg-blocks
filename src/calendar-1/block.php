<?php 
ob_start();

require_once KENZAP_CALENDAR.'/src/commonComponents/container/container-cont.php';

if ( $attributes['serverSide'] ){

	?><img src="<?php echo plugins_url( 'assets/block_preview.jpg', __FILE__ ); ?>" alt="<?php echo esc_attr__('block preview', 'kenzap-calendar'); ?>" />
	<div style="font-size:11px;">
		<?php if ( class_exists( 'WooCommerce' ) ){ ?>
			<div><?php echo esc_html__('Note: Adjust listing settings from the right pane; Click Update to preview changes on your website frontend.', 'kenzap-calendar'); ?></div>
		<?php }else{ ?>
			<div><?php echo esc_html__('Important! Please make sure that WooCommerce plugin is installed and activated.', 'kenzap-calendar'); ?></div>
		<?php } ?>
	</div><?php 
	
}else{ ?>

	<?php if( !class_exists( 'WooCommerce' ) ) { echo esc_html__('Please activate WooCommerce plugin','kenzap-calendar');}else{ ?>

	<div class="kenzap-booking-form-1 <?php echo esc_attr($kenzapSize); ?> <?php if (isset($attributes['className'])) echo esc_attr($attributes['className']); ?>" data-product="<?php echo esc_attr($attributes['product_id']); ?>" data-cid="<?php echo esc_attr($attributes['cid']); ?>" style="--cbr:<?php echo esc_attr($attributes['cbr']); ?>px;--ebr:<?php echo esc_attr($attributes['ebr']); ?>px;--mc:<?php echo esc_attr($attributes['mainColor']); ?>;--tc:<?php echo esc_attr($attributes['textColor']); ?>;--ctc:<?php echo esc_attr($attributes['textColor2']); ?>;<?php echo ($kenzapStyles);//escaped in src/commonComponents/container/container-cont.php ?>">

		<div class="kenzap-container" style="max-width:<?php echo esc_attr($attributes['containerMaxWidth']);?>px">

			<?php $_product = wc_get_product( $attributes['product_id'] ); ?>
			<div class="kenzap-row">
				<div class="kenzap-col-8">
					<div class="booking-calendar">
						<?php if(strlen($attributes['left_title'])>0){ echo '<h2>'.esc_html($attributes['left_title']).'</h2>'; } ?>
						<div class="owl-carousel">
							
							<?php 
							$ndt = strtotime($attributes['start_date']);
							$sd = $nd = date_i18n( 'Y-m', $ndt ); 
							$ed = date_i18n( 'Y-m', strtotime("+1 month", strtotime($attributes['end_date']) ));

							//generate days of weeks
							$headings = [];
							$timestamp = strtotime('next Sunday');
							$days = array();
							for ($i = 0; $i < 7; $i++) {
								$days[] = strftime('%A', $timestamp);
								$timestamp = strtotime('+1 day', $timestamp);
								$headings[] = '<li>'.date_i18n('D', $timestamp).'</li>';
							}

							//offset days of weeks based on user settings 
							for ( $i=1; $i < intval($attributes['dof'])+1; $i++ ){

								$dof = array_shift($headings);
								array_push($headings, $dof);
							}

							//inactive days of weeks
							$inactive_dof = array($attributes['sunday'], $attributes['monday'], $attributes['tuesday'], $attributes['wednesday'], $attributes['thursday'], $attributes['friday'], $attributes['saturday']);

							$i = 0;
							while($nd!=$ed && $i<24){ ?>

								<div class="calendar-box">
									<h3 class="month-title"> 
										<a href="#" class="month-prev"></a> 
										<?php echo date_i18n( 'F Y', $ndt ); ?>
										<a href="#" class="month-next"></a>
									</h3>
									<div class="calendar-header">
										<ul><?php echo implode('',$headings); ?></ul>
									</div>

									<?php 
									// generate calendar body
									$month = date_i18n( 'm', $ndt );
									$year = date_i18n( 'Y', $ndt );
									
									// days and weeks vars now ... 
									$running_day = date('w',mktime(0,0,0,$month,7-intval($attributes['dof']),$year));

									$days_in_month = date('t',mktime(0,0,0,$month,1,$year));
									$days_in_month_prev = date('t',mktime(0,0,0,$month-1,1,$year));
									$days_in_this_week = 1;
									$day_counter = 0;
									$dates_array = array();
	
									// row for week one
									$calendar = '<div class="calendar-body"><ul id="calendar_'.$year.'_'.$month.'">';
																	
									// print "blank" days until the first of the current week 
									for($x = $running_day-1; $x > -1; $x--):
										$calendar.= '<li class="inactive"> </li>';
										$days_in_this_week++;
									endfor;

									// keep going with days.... 
									for($list_day = 1; $list_day <= $days_in_month; $list_day++):

										$today = gmmktime(0,0,0,$month,$list_day,$year);
										$dof = date( 'w', $today );
										$calendar.= '<li data-full="'.date_i18n( get_option( 'date_format' ), $today).'" data-dow="'.date_i18n('l', $today).'" data-dt="'.esc_attr($today).'" data-ym="'.$year.'_'.$month.'" data-date="'.$year."-".$month."-".$list_day.'" >';
										
										// add in the day number 
										$day_available = 'available';

										// day of week is not available
										if(!$inactive_dof[$dof]){
											$day_available = 'not-available';
										}

										// time is already in past
										if($today < time() && date( 'y-m-d', time()) != date( 'y-m-d', $today)){
											$day_available = 'not-available';
										}

										// time is in the holiday range
										$ih = 0; foreach( $attributes['holidaysAr'] as $item ): 
												
											$ih++;
											$slot_start = strtotime($item['ds']);
											$slot_end = strtotime($item['de']); 
											if($slot_start <= $today && $today <= $slot_end){
												$day_available = 'not-available';
											}
		
										endforeach;

										$calendar.= '<button class="cal-day '.$day_available.'">'.$list_day.'</button>';
										$calendar.= '</li>';
										if($running_day == 6):

											if(($day_counter+1) != $days_in_month):
												
											endif;
											$running_day = -1;
											$days_in_this_week = 0;
										endif;
										$days_in_this_week++; $running_day++; $day_counter++;
									endfor;

									// finish the rest of the days in the week 
									if($days_in_this_week < 8):
										for($x = 1; $x <= (8 - $days_in_this_week); $x++):
											$calendar.= '<li class="inactive"> </li>';
										endfor;
									endif;

									// final row
									$calendar.= '</ul>';

									// end the table
									$calendar.= '</div>';

									echo wp_kses_post( $calendar );
									?>
			
									<div class="calendar-footer" data-def="<?php echo esc_attr__('No free time slots available','kenzap-calendar'); ?>">
										<div class="calendar-footer-no" ><?php echo esc_html__('No free time slots available','kenzap-calendar'); ?></div>
										<ul>

											<?php $i = 0; foreach( $attributes['timeSlotsAr'] as $item ): 
												
												$i++;
												$slot_start = strtotime($item['ds']);
												$slot_end = strtotime($item['de']); 
												$slot_max = $item['ba']; ?>

												<li style="display:none;" data-url="<?php echo get_permalink( $item['pid'] );?>" data-product="<?php echo esc_attr($item['pid']); ?>" data-feat="<?php echo esc_attr($item['feat']); ?>" data-desc="<?php echo esc_attr($item['desc']); ?>" data-id="<?php echo esc_attr($i);?>" data-max="<?php echo esc_attr($slot_max);?>" data-ds="<?php echo esc_attr($slot_start); ?>" data-de="<?php echo esc_attr($slot_end); ?>"><button class="cal-time time-available"><?php echo esc_html($item['title']);?></button></li>

											<?php endforeach; ?>
										</ul>
									</div>
									<div class="calendar-label">
										<ul>
											<li class="label-available"><span></span> <?php echo esc_html__('Available','kenzap-calendar'); ?></li>
											<li class="label-not-available"><span></span> <?php echo esc_html__('Not Available','kenzap-calendar'); ?></li>
											<li class="label-selected"><span></span> <?php echo esc_html__('Selected','kenzap-calendar'); ?></li>
										</ul>
									</div>
								</div>

								<?php 
								$ndt = strtotime("+1 month", $ndt); 
								$nd = date_i18n( 'Y-m', $ndt ); 

								$i++;
							} ?>

						</div>
					</div>
				</div>
				<div class="kenzap-col-4">
					<div class="booking-info">
						<?php if(strlen($attributes['right_title'])>0){ echo '<h2>'.esc_html($attributes['right_title']).'</h2>'; } ?>
						<h3><span id="product_title"><?php if($_product) echo esc_html($_product->get_title()); ?></span> <strong id="product_price"><?php if($_product) echo get_woocommerce_currency_symbol().$_product->get_price(); ?></strong></h3>
						<p id="product_desc">
							<?php if(!$_product){ echo esc_html__('Go to General > Product ID under this block settings to provide valid WooCommerce product ID.','kenzap-calendar'); }else{ echo esc_html__('Please select date and time from the calendar on the left to view description here.','kenzap-calendar'); } ?>
						</p>
						<ul id="product_feat"> </ul>
					</div>
					<div class="booking-schedule">
						<h3 id="cal_dow" data-def="<?php echo esc_attr__('Pick Up','kenzap-calendar'); ?>"><?php echo esc_html__('Pick Up','kenzap-calendar'); ?></h3>
						<p id="cal_date_time" data-def="<?php echo esc_attr__('the calendar date','kenzap-calendar'); ?>"><?php echo esc_html__('the calendar date','kenzap-calendar'); ?></p>
					</div>

					<?php if($_product){ ?>

						<div class="btn-cont" data-url="<?php echo wc_get_cart_url(); ?>" data-type="<?php if( $_product->is_type( 'simple' ) ) echo 'simple'; ?>" data-text="<?php echo esc_attr__('Next','kenzap-calendar'); ?>"> </div>

					<?php } ?>

				</div>
			</div>

		</div>
	</div>

	<?php } ?>
	
<?php } 

$buffer = ob_get_clean();
return $buffer;