
const { __ } = wp.i18n; // Import __() from wp.i18n
const { Component } = wp.element;
const { InspectorControls, PanelColorSettings } = wp.editor;
const { RangeControl, CheckboxControl, PanelBody, ServerSideRender, SelectControl, TextControl, TextareaControl, DateTimePicker } = wp.components;
import { InspectorContainer } from '../commonComponents/container/container';
const { __experimentalGetSettings } = wp.date;
/**
 * Keys for new blocks
 * @type {number}
 */
let key = 0;

/**
 * The edit function describes the structure of your block in the context of the editor.
 * This represents what the editor will render when the block is used.
 *
 * The "edit" property must be a valid function.
 * @param {Object} props - attributes
 * @returns {Node} rendered component
 */
export default class Edit extends Component {
    state = {
        activeSubBlock: -1,
    };

    render() {
        const {
            className,
            attributes,
            setAttributes,
        } = this.props;

        const settings = __experimentalGetSettings();

        // To know if the current timezone is a 12 hour time with look for an "a" in the time format.
        // We also make sure this a is not escaped by a "/".
        const is12HourTime = /a(?!\\)/i.test(
            settings.formats.time
                .toLowerCase() // Test only the lower case a
                .replace( /\\\\/g, '' ) // Replace "//" with empty strings
                .split( '' ).reverse().join( '' ) // Reverse the string and test for "a" not followed by a slash
        );

        const _toConsumableArray = function(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
        const _twoDigits = function(str){str+="";if(str.length==1){ return "0"+str; }else{ return str; } }

        //generate date now + 3 month
        var d = new Date();
        var d2 = new Date();
        d2.setMonth(d2.getMonth() + 3);

        var ds = d.getFullYear()+"-"+_twoDigits(d.getMonth()+1)+"-"+_twoDigits(d.getDate())+"T00:00:00";//+_twoDigits(d.getHours())+":"+_twoDigits(d.getMinutes())+":"+_twoDigits(d.getSeconds());
        var de = d2.getFullYear()+"-"+_twoDigits(d2.getMonth()+1)+"-"+_twoDigits(d2.getDate())+"T23:59:59";//+_twoDigits(d2.getHours())+":"+_twoDigits(d2.getMinutes())+":"+_twoDigits(d2.getSeconds());
   
        //set calendar default dates
        if ( attributes.start_date == '' ) attributes.start_date = ds;
        if ( attributes.end_date == '' ) attributes.end_date = de;

        //add holiday if holidays var is increased
        if ( attributes.holidays > attributes.holidaysAr.length ){

            var temp = "";
            // get new record from backup copy if exists
            if ( attributes.holidaysArBackup.length > attributes.holidaysAr.length ){

                var i = attributes.holidaysAr.length;
                temp = [].concat(_toConsumableArray(attributes.holidaysAr), attributes.holidaysArBackup[i]);
            
            // add new record 
            }else{

                temp = [].concat(_toConsumableArray(attributes.holidaysAr), [{
                        ds: ds,
                        de: ds,
                    }]
                )
            }
            attributes.holidaysAr = temp;
        }

        //remove holiday if holidays var is decreased
        if ( attributes.holidays < attributes.holidaysAr.length ){
            var temp = attributes.holidaysAr.slice(0, attributes.holidays);
            attributes.holidaysAr = temp;
        }

        //add timeslot if slots var is increased
        if ( attributes.slots > attributes.timeSlotsAr.length ){

            var temp = "";
            // get new record from backup copy if exists
            if ( attributes.timeSlotsArBackup.length > attributes.timeSlotsAr.length ){

                var i = attributes.timeSlotsAr.length;
                temp = [].concat(_toConsumableArray(attributes.timeSlotsAr), attributes.timeSlotsArBackup[i]);
            
            // add new record 
            }else{

                temp = [].concat(_toConsumableArray(attributes.timeSlotsAr), [{
                        title: '00:00',
                        ds: ds,
                        de: de,
                        ba: 1,
                        desc: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam quis nostrud exerci tation.',
                        feat: 'Feature 1\nFeature 3\nFeature 2\nFeature 4',
                        pid: ''
                    }]
                )
            }
            attributes.timeSlotsAr = temp;
        }

        //remove timeslot if slots var is decreased
        if ( attributes.slots < attributes.timeSlotsAr.length ){
            var temp = attributes.timeSlotsAr.slice(0, attributes.slots);
            attributes.timeSlotsAr = temp;
        }

        return (
            <div className={ className }>
                <InspectorControls
                    setAttributes={ setAttributes }
                    { ...attributes }
                >
                    <PanelBody
                        title={ __( 'General', 'kenzap-calendar' ) }
                        initialOpen={ false }
                    >

                        <TextControl
                            label={ __( 'Product ID', 'kenzap-calendar' ) }
                            value={ attributes.product_id }
                            onChange={ (product_id) => setAttributes( { product_id: product_id } ) }
                            help={ __( 'Go to Products > All Products > hover product to view its ID. This setting is mandatory.', 'kenzap-calendar' ) }
                        />

                        <PanelBody
                            title={ __( 'Starting Date', 'kenzap-calendar' ) }
                            initialOpen={ true }
                            help={ __( 'Specify starting date and time of the calendar.', 'kenzap-calendar' ) }
                        >

                            <DateTimePicker
                                currentDate={ attributes.start_date }
                                onChange={ ( start_date ) => setAttributes( { start_date: start_date } ) }
                                is12Hour={ is12HourTime }
                            />

                        </PanelBody>

                        <PanelBody
                            title={ __( 'Ending Date', 'kenzap-calendar' ) }
                            initialOpen={ true }
                        >

                            <DateTimePicker
                                currentDate={ attributes.end_date }
                                onChange={ ( end_date ) => setAttributes( { end_date: end_date } ) }
                                is12Hour={ is12HourTime }
                            />

                        </PanelBody>

                        <SelectControl
                            label={ __( 'First Day of Week', 'kenzap-calendar' ) }
                            checked={ attributes.dof }
                            options={[
                                { label:  __( 'Monday', 'kenzap-calendar' ) , value: '0' },
                                { label:  __( 'Tuesday', 'kenzap-calendar' ) , value: '1' },
                                { label:  __( 'Wednesday', 'kenzap-calendar' ) , value: '2' },
                                { label:  __( 'Thursday', 'kenzap-calendar' ) , value: '3' },
                                { label:  __( 'Friday', 'kenzap-calendar' ) , value: '4' },
                                { label: __( 'Saturday', 'kenzap-calendar' ) , value: '5' },
                                { label: __( 'Sunday', 'kenzap-calendar' ) , value: '6' },
                            ]}
                            onChange={ (dof) => setAttributes( { dof } ) }
                        />

                        <TextControl
                            label={ __( 'Calendar Title', 'kenzap-calendar' ) }
                            value={ attributes.left_title }
                            onChange={ ( left_title ) => { setAttributes( { left_title: left_title } ) } }
                            help={ __( 'Specify title on the left pane of the calendar section. Leave blank to hide.', 'kenzap-calendar' ) }
                        />

                        <TextControl
                            label={ __( 'Summary Title', 'kenzap-calendar' ) }
                            value={ attributes.right_title }
                            onChange={ ( right_title ) => { setAttributes( { right_title: right_title } ) } }
                            help={ __( 'Specify title on the right pane of the calendar section. Leave blank to hide.', 'kenzap-calendar' ) }
                        />

                        <SelectControl
                            label={ __( 'Booking Database', 'kenzap-calendar' ) }
                            checked={ attributes.cid }
                            options={[
                                { label:  __( 'DB #1', 'kenzap-calendar' ) , value: '1' },
                                { label:  __( 'DB #2', 'kenzap-calendar' ) , value: '2' },
                                { label:  __( 'DB #3', 'kenzap-calendar' ) , value: '3' },
                                { label:  __( 'DB #4', 'kenzap-calendar' ) , value: '4' },
                                { label:  __( 'DB #5', 'kenzap-calendar' ) , value: '5' },
                            ]}
                            onChange={ (cid) => setAttributes( { cid } ) }
                            help={ __( 'Set up different IDs if you plan to use multiple calendars and want to separate booking databases.', 'kenzap-calendar' ) }
                        />

                    </PanelBody>

                    <PanelBody
                            title={ __( 'Availability', 'kenzap-calendar' ) }
                            initialOpen={ false }
                        >

                        <CheckboxControl
                            label={ __( 'Monday', 'kenzap-calendar' ) }
                            checked={ attributes.monday}
                            onChange={ (monday) => setAttributes( { monday } ) }
                        />

                        <CheckboxControl
                            label={ __( 'Tuesday', 'kenzap-calendar' ) }
                            checked={ attributes.tuesday}
                            onChange={ (tuesday) => setAttributes( { tuesday } ) }
                        />

                        <CheckboxControl
                            label={ __( 'Wednesday', 'kenzap-calendar' ) }
                            checked={ attributes.wednesday}
                            onChange={ (wednesday) => setAttributes( { wednesday } ) }
                        />

                        <CheckboxControl
                            label={ __( 'Thursday', 'kenzap-calendar' ) }
                            checked={ attributes.thursday}
                            onChange={ (thursday) => setAttributes( { thursday } ) }
                        />

                        <CheckboxControl
                            label={ __( 'Friday', 'kenzap-calendar' ) }
                            checked={ attributes.friday}
                            onChange={ (friday) => setAttributes( { friday } ) }
                        />

                        <CheckboxControl
                            label={ __( 'Saturday', 'kenzap-calendar' ) }
                            checked={ attributes.saturday}
                            onChange={ (saturday) => setAttributes( { saturday } ) }
                        />

                        <CheckboxControl
                            label={ __( 'Sunday', 'kenzap-calendar' ) }
                            checked={ attributes.sunday}
                            onChange={ (sunday) => setAttributes( { sunday } ) }
                        />

                        <RangeControl
                            label={ __( 'Holidays', 'kenzap-calendar' ) }
                            value={ attributes.holidays }
                            onChange={ ( holidays ) => setAttributes( { holidays } ) }
                            min={ 0 }
                            max={ 10 }
                            help={ __( 'Define holiday periods when calendar bookings are not available. Set up date ranges below.', 'kenzap-calendar' ) }
                        />

                        { attributes.holidaysAr && attributes.holidaysAr.map( ( item, index ) => (

                            <PanelBody
                                title={ __( 'Holiday', 'kenzap-calendar' ) + " " + (index+1) }
                                initialOpen={ false }
                                >

                                <PanelBody
                                    title={ __( 'Start/End Period', 'kenzap-calendar' ) }
                                    initialOpen={ true }
                                >
                                    <DateTimePicker
                                        currentDate={ attributes.holidaysAr[index].ds }
                                        onChange={ ( value ) => {

                                            const temp = attributes.holidaysAr;
                                            value = value.split("T");
                                            value = value[0]+"T00:00:00";
                                            temp[index].ds = value; 
                                            setAttributes( { holidaysAr: temp, holidaysArBackup: temp, dump_value: value } ) 
                                        } }
                                        is12Hour={ is12HourTime }
                                    />

                                    <DateTimePicker
                                        currentDate={ attributes.holidaysAr[index].de }
                                        onChange={ ( value ) => {

                                            const temp = attributes.holidaysAr;
                                            value = value.split("T");
                                            value = value[0]+"T23:59:59";
                                            temp[index].de = value; 
                                            setAttributes( { holidaysAr: temp, holidaysArBackup: temp, dump_value: value } ) 
                                        } }
                                        is12Hour={ is12HourTime }
                                    />

                                </PanelBody>

                            </PanelBody>

                        ) ) }

                    </PanelBody>

                    <PanelBody
                            title={ __( 'Time slots', 'kenzap-calendar' ) }
                            initialOpen={ false }
                        >

                        <RangeControl
                            label={ __( 'Amount of Slots', 'kenzap-calendar' ) }
                            value={ attributes.slots }
                            onChange={ ( slots ) => setAttributes( { slots } ) }
                            min={ 0 }
                            max={ 25 }
                            help={ __( 'Define the amount of slots per calendar day. Warning! If you reduce the amount of slots records will be removed. If you do not want for changes to take affect reload the page without saving.', 'kenzap-calendar' ) }
                        />

                        { attributes.timeSlotsAr && attributes.timeSlotsAr.map( ( item, index ) => (

                            <PanelBody
                                title={ __( 'Slot', 'kenzap-calendar' ) + " " + (index+1) }
                                initialOpen={ false }
                                >

                                <TextControl
                                    value={ attributes.timeSlotsAr[index].title }
                                    onChange={ ( value ) => { 
                                    
                                        const temp = attributes.timeSlotsAr;
                                        temp[index].title = value; 
                                        setAttributes( { timeSlotsAr: temp, timeSlotsArBackup: temp, dump_value: value } )
                                    } }
                                    help={ __( 'Specify the title of the time slot. Ex.: 12:00.', 'kenzap-calendar' ) }
                                />

                                <RangeControl
                                    label={ __( 'Bookings per Slot', 'kenzap-calendar' ) + " " + (index+1) }
                                    value={ attributes.timeSlotsAr[index].ba }
                                    onChange={ ( value ) => { 
                                    
                                        const temp = attributes.timeSlotsAr;
                                        temp[index].ba = value; 
                                        setAttributes( { timeSlotsAr: temp, timeSlotsArBackup: temp, dump_value: value } )
                                    } }
                                    min={ 1 }
                                    max={ 10 }
                                    help={ __( 'Define the maximum amount of bookings for this time slot per day.', 'kenzap-calendar' ) }
                                />

                                <TextareaControl
                                    label="Description"
                                    value={ attributes.timeSlotsAr[index].desc }
                                    onChange={ ( value ) => { 
                                    
                                        const temp = attributes.timeSlotsAr;
                                        temp[index].desc = value; 
                                        setAttributes( { timeSlotsAr: temp, timeSlotsArBackup: temp, dump_value: value } )
                                    } }
                                    help={ __( 'Description will show up on the right pane of the summary container after date and time are selected.', 'kenzap-calendar' ) }
                                />

                                <TextareaControl
                                    label="Features"
                                    value={ attributes.timeSlotsAr[index].feat }
                                    onChange={ ( value ) => { 
                                    
                                        const temp = attributes.timeSlotsAr;
                                        temp[index].feat = value; 
                                        setAttributes( { timeSlotsAr: temp, timeSlotsArBackup: temp, dump_value: value } )
                                    } }
                                    help={ __( 'Specify one feature per line. Feature list will show up on the right pane of the summary container after date and time are selected.', 'kenzap-calendar' ) }
                                />

                                <PanelBody
                                    title={ __( 'Start/End Period', 'kenzap-calendar' ) }
                                    initialOpen={ true }
                                >
                                    <DateTimePicker
                                        currentDate={ attributes.timeSlotsAr[index].ds }
                                        onChange={ ( value ) => {

                                            const temp = attributes.timeSlotsAr;
                                            value = value.split("T");
                                            value = value[0]+"T00:00:00";
                                            temp[index].ds = value; 

                                            setAttributes( { timeSlotsAr: temp, timeSlotsArBackup: temp, dump_value: value } ) 
                                        } }
                                        is12Hour={ is12HourTime }
                                    />

                                    <DateTimePicker
                                        currentDate={ attributes.timeSlotsAr[index].de }
                                        onChange={ ( value ) => {

                                            const temp = attributes.timeSlotsAr;
                                            value = value.split("T");
                                            value = value[0]+"T23:59:59";
                                            temp[index].de = value; 

                                            setAttributes( { timeSlotsAr: temp, timeSlotsArBackup: temp, dump_value: value } ) 
                                        } }
                                        is12Hour={ is12HourTime }
                                    />

                                </PanelBody>

                                <TextControl
                                    label={ __( 'Product ID', 'kenzap-calendar' ) }
                                    value={ attributes.timeSlotsAr[index].pid }
                                    onChange={ ( value ) => {

                                        const temp = attributes.timeSlotsAr;
                                        temp[index].pid = value; 
                                        setAttributes( { timeSlotsAr: temp, timeSlotsArBackup: temp, dump_value: value } )
                                    } }
                                    help={ __( 'Override default product ID to variate price and checkout process for this slot.', 'kenzap-calendar' ) }
                                />

                            </PanelBody>

                        ) ) }

                    </PanelBody>

                    <PanelBody
                        title={ __( 'Style', 'kenzap-calendar' ) }
                        initialOpen={ false }
                    >

                        <PanelColorSettings
                            title={ __( 'Main Color', 'kenzap-calendar' ) }
                            initialOpen={ true }
                            colorSettings={ [
                                    {
                                        value: attributes.mainColor,
                                        onChange: ( value ) => {
                                            return setAttributes( { mainColor: value } );
                                        },
                                        label: __( 'Selected', 'kenzap-calendar' ),
                                    },
                                ] }
                        />

                        <PanelColorSettings
                            title={ __( 'Text Color', 'kenzap-calendar' ) }
                            initialOpen={ false }
                            colorSettings={ [
                                    {
                                        value: attributes.textColor,
                                        onChange: ( value ) => {
                                            return setAttributes( { textColor: value } );
                                        },
                                        label: __( 'Selected', 'kenzap-calendar' ),
                                    },
                                ] }
                        />

                        <PanelColorSettings
                            title={ __( 'Calendar Text Color', 'kenzap-calendar' ) }
                            initialOpen={ false }
                            colorSettings={ [
                                    {
                                        value: attributes.textColor2,
                                        onChange: ( value ) => {
                                            return setAttributes( { textColor2: value } );
                                        },
                                        label: __( 'Selected', 'kenzap-calendar' ),
                                    },
                                ] }
                        />

                        <RangeControl
                            label={ __( 'Container Border Radius', 'kenzap-calendar' ) }
                            value={ attributes.cbr }
                            onChange={ ( cbr ) => setAttributes( { cbr } ) }
                            min={ 0 }
                            max={ 50 }
                        />

                        <RangeControl
                            label={ __( 'Element Border Radius', 'kenzap-calendar' ) }
                            value={ attributes.ebr }
                            onChange={ ( ebr ) => setAttributes( { ebr } ) }
                            min={ 0 }
                            max={ 50 }
                        />
                    
                    </PanelBody>

                    <InspectorContainer
                        setAttributes={ setAttributes }
                        { ...attributes }
                        withPadding
                        withWidth100
                        withBackground
                    />
                </InspectorControls>

                <ServerSideRender
                    block="kenzap/calendar-1"
                    attributes={ {
                        serverSide: true,
                    } }
                />
            </div>
        );
    }
}
