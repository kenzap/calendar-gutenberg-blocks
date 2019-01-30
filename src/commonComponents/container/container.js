const { __ } = wp.i18n; // Import __() from wp.i18n
const { RangeControl, CheckboxControl, SelectControl, RadioControl, PanelBody, Button } = wp.components;
const { Component, Fragment } = wp.element;
const { MediaUpload, PanelColorSettings } = wp.editor;

export const blockProps = {
    containerMaxWidth: {
        type: 'number',
        default: 1170,
    },

    containerPadding: {
        type: 'number',
        default: 0,
    },

    withPadding: {
        type: 'boolean',
        default: false,
    },

    autoPadding: {
        type: 'string',
        default: '',
    },

    withAutoPadding: {
        type: 'boolean',
        default: false,
    },

    width100: {
        type: 'boolean',
        default: false,
    },

    backgroundColor: {
        type: 'string',
        default: '#FFF',
    },

    backgroundImage: {
        type: 'string',
        default: 'none',
    },

    backgroundImageId: {
        type: 'string',
        default: '',
    },

    backgroundStyle: {
        type: 'string',
        default: '',
    },

    backgroundPosition: {
        type: 'string',
        default: 'center center',
    },

    alignment: {
        type: 'string',
        default: '',
    },
};

/**
 * Implements inspector container
 */
export class InspectorContainer extends Component {
    render() {
        const {
            withBackground = true,
            backgroundImageId,
            backgroundImage,
            containerMaxWidth,
            backgroundColor,
            backgroundRepeat,
            backgroundPosition,
            alignment,
            setAttributes,
            width100,
            withWidth100 = false,
            withPadding = false,
            containerPadding,
            autoPadding = '',
        } = this.props;

        return (
            <Fragment>
                { withBackground &&
                <PanelBody
                    title={ __( 'Background', 'kenzap-calendar' ) }
                    initialOpen={ false }
                >
                    <PanelColorSettings
                        title={ __( 'Background Color', 'kenzap-calendar' ) }
                        initialOpen={ true }
                        colorSettings={ [
                                {
                                    value: backgroundColor,
                                    onChange: ( value ) => {
                                        return setAttributes( { backgroundColor: value } );
                                    },
                                    label: __( 'Selected', 'kenzap-calendar' ),
                                },
                            ] }
                    />

                    <p style={ { marginBottom: '5px' } }>{ __( 'Background image', 'kenzap-calendar' ) }</p>
                    <MediaUpload
                        onSelect={ ( media ) => {
                                this.props.setAttributes( {
                                    backgroundImage: media.url,
                                    backgroundImageId: media.id,
                                } );
                            } }
                        value={ backgroundImageId }
                        allowedTypes={ [ 'image' ] }
                        render={ ( mediaUploadProps ) => (
                            <Fragment>
                                { ( backgroundImageId || backgroundImage !== 'none' ) ? (
                                    <Fragment>
                                        <Button
                                            isDefault
                                            onClick={ () => {
                                                setAttributes( {
                                                    backgroundImageId: '',
                                                    backgroundImage: 'none',
                                                } );
                                            } }
                                        >
                                            { __( 'Remove', 'kenzap-calendar' ) }
                                        </Button>
                                        <div
                                            style={ {
                                                width: '27px',
                                                height: '27px',
                                                display: 'inline-block',
                                                margin: '0 0 0 5px',
                                                backgroundImage: `url(${ [ this.props.backgroundImage ? this.props.backgroundImage : '' ] })`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundSize: 'cover',
                                            } }
                                        />
                                    </Fragment>
                                ) : (
                                    <Button isDefault onClick={ mediaUploadProps.open }>
                                        { __( 'Upload/Choose', 'kenzap-calendar' ) }
                                    </Button>
                                ) }
                            </Fragment>

                            ) }
                        />

                    <p style={ { fontStyle: 'italic' } }>
                        { __( 'Override background color with image. Transparent images may also apply.', 'kenzap-calendar' ) }
                    </p>

                    <SelectControl
                        label={ __( 'Background style', 'kenzap-calendar' ) }
                        value={ backgroundRepeat }
                        options={ [
                                { label: __( 'default', 'kenzap-calendar' ), value: 'default' },
                                { label: __( 'contain', 'kenzap-calendar' ), value: 'contain' },
                                { label: __( 'cover', 'kenzap-calendar' ), value: 'cover' },
                                { label: __( 'repeated', 'kenzap-calendar' ), value: 'repeat' },
                            ] }
                        onChange={ ( value ) => {
                                setAttributes( { backgroundStyle: value } );
                            } }
                        help={ __( 'Choose how to align background image', 'kenzap-calendar' ) }
                        />

                    <SelectControl
                        label={ __( 'Background position', 'kenzap-calendar' ) }
                        value={ backgroundPosition }
                        options={ [
                                { label: __( 'left top', 'kenzap-calendar' ), value: 'left top' },
                                { label: __( 'left center', 'kenzap-calendar' ), value: 'left center' },
                                { label: __( 'left bottom', 'kenzap-calendar' ), value: 'left bottom' },
                                { label: __( 'right top', 'kenzap-calendar' ), value: 'right top' },
                                { label: __( 'right center', 'kenzap-calendar' ), value: 'right center' },
                                { label: __( 'right bottom', 'kenzap-calendar' ), value: 'right bottom' },
                                { label: __( 'center top', 'kenzap-calendar' ), value: 'center top' },
                                { label: __( 'center center', 'kenzap-calendar' ), value: 'center center' },
                                { label: __( 'center bottom', 'kenzap-calendar' ), value: 'center bottom' },
                            ] }
                        onChange={ ( value ) => {
                                setAttributes( { backgroundPosition: value } );
                            } }
                        help={ __( 'Sets the starting position of a background image', 'kenzap-calendar' ) }
                        />
                </PanelBody>
                }

                <PanelBody
                    title={ __( 'Container', 'kenzap-calendar' ) }
                    initialOpen={ false }
                >
                    <RadioControl
                        label={ __( 'Alignment', 'kenzap-calendar' ) }
                        selected={ alignment }
                        options={ [
                            { label: 'Default', value: '' },
                            { label: 'Full width', value: 'fullwidth' },
                        ] }
                        onChange={ ( value ) => {
                            setAttributes( { alignment: value } );
                        } }
                        help={ __( 'Full Width may not work properly with all layout types including layouts with sidebars', 'kenzap-calendar' ) }
                    />

                    { ! width100 &&
                    <RangeControl
                        label={ __( 'Max width', 'kenzap-calendar' ) }
                        value={ containerMaxWidth }
                        onChange={ ( value ) => setAttributes( { containerMaxWidth: value } ) }
                        min={ 300 }
                        max={ 2000 }
                        help={ __( 'Restrict layout width for content children.', 'kenzap-calendar' ) }
                    />
                    }

                    { withWidth100 &&
                    <CheckboxControl
                        label={ __( 'No restriction', 'kenzap-calendar' ) }
                        checked={ width100 }
                        onChange={ ( isChecked ) => {
                            setAttributes( {
                                width100: isChecked,
                                containerMaxWidth: isChecked ? '100%' : 1170,
                            } );
                        } }
                        help={ __( 'No restriction layout width for content children.', 'kenzap-calendar' ) }
                    />
                    }

                    { withPadding &&
                        <Fragment>
                            <RangeControl
                                label={ __( 'Top and bottom paddings', 'kenzap-calendar' ) }
                                value={ containerPadding }
                                onChange={ ( value ) => setAttributes( { containerPadding: value } ) }
                                min={ 0 }
                                max={ 200 }
                                help={ __( 'Useful when you want to extend background image vertical size or create more space.', 'kenzap-calendar' ) }
                            />

                            <CheckboxControl
                                label={ __( 'Responsive paddings', 'kenzap-calendar' ) }
                                checked={ autoPadding.length > 0 }
                                onChange={ ( isChecked ) => {
                                    setAttributes( {
                                        autoPadding: isChecked ? 'autoPadding' : '',
                                    } );
                                } }
                                help={ __( 'Provides auto calculations for top and bottom paddings', 'kenzap-calendar' ) }
                            />
                        </Fragment>
                    }
                </PanelBody>
            </Fragment>
        );
    }
}

/**
 * Implements the edit container
 * @param {Object} props from editor
 * @return {Node} rendered edit component
 * @constructor
 */
export const ContainerEdit = ( props ) => {
    const styles = {};

    if ( props.withBackground ) {
        if ( props.attributes.backgroundImage ) {
            styles.backgroundImage = props.attributes.backgroundImage !== 'none' ? `url(${ props.attributes.backgroundImage })` : 'none';
            styles.backgroundRepeat = props.attributes.backgroundRepeat;
            styles.backgroundSize = props.attributes.backgroundSize;
            styles.backgroundPosition = props.attributes.backgroundPosition;
        }

        if ( props.attributes.backgroundColor ) {
            styles.backgroundColor = props.attributes.backgroundColor;
        }
    }

    if ( props.withPadding && ! props.attributes.autoPadding ) {
        styles.padding = `${ props.attributes.containerPadding }px 0`;
    }

    switch ( props.attributes.backgroundStyle ) {
        case 'default': {
            styles.backgroundRepeat = 'no-repeat';
            styles.backgroundSize = 'auto';
            break;
        }

        case 'contain': {
            styles.backgroundRepeat = 'no-repeat';
            styles.backgroundSize = 'contain';
            break;
        }

        case 'cover': {
            styles.backgroundRepeat = 'no-repeat';
            styles.backgroundSize = 'cover';
            break;
        }

        case 'repeat': {
            styles.backgroundRepeat = 'repeat';
            styles.backgroundSize = 'auto';
        }
    }

    return (
        <div
            className={ `${ props.className } kenzap-sm admin ${ props.attributes.alignment } ${ props.attributes.autoPadding }` }
            style={ { ...styles, ...props.style } }
        >
            { props.children }
        </div>
    );
};

/**
 * Implements the save container
 * @param {Object} props from editor
 * @return {Node} rendered edit component
 * @constructor
 */
export const ContainerSave = ( props ) => {
    const styles = {};

    if ( props.withBackground ) {
        if ( props.attributes.backgroundImage ) {
            styles.backgroundImage = props.attributes.backgroundImage !== 'none' ? `url(${ props.attributes.backgroundImage })` : 'none';
            styles.backgroundRepeat = props.attributes.backgroundRepeat;
            styles.backgroundSize = props.attributes.backgroundSize;
            styles.backgroundPosition = props.attributes.backgroundPosition;
        }

        if ( props.attributes.backgroundColor ) {
            styles.backgroundColor = props.attributes.backgroundColor;
        }
    }

    if ( props.withPadding && ! props.attributes.autoPadding ) {
        styles.padding = `${ props.attributes.containerPadding }px 0`;
    }

    switch ( props.attributes.backgroundStyle ) {
        case 'default': {
            styles.backgroundRepeat = 'no-repeat';
            styles.backgroundSize = 'auto';
            break;
        }

        case 'contain': {
            styles.backgroundRepeat = 'no-repeat';
            styles.backgroundSize = 'contain';
            break;
        }

        case 'cover': {
            styles.backgroundRepeat = 'no-repeat';
            styles.backgroundSize = 'cover';
            break;
        }

        case 'repeat': {
            styles.backgroundRepeat = 'repeat';
            styles.backgroundSize = 'auto';
        }
    }

    let additionalClassForKenzapContainer = 'kenzap-lg';
    if ( props.attributes.containerMaxWidth < 992 ) {
        additionalClassForKenzapContainer = 'kenzap-md';
    }
    if ( props.attributes.containerMaxWidth < 768 ) {
        additionalClassForKenzapContainer = 'kenzap-sm';
    }
    if ( props.attributes.containerMaxWidth < 480 ) {
        additionalClassForKenzapContainer = 'kenzap-xs';
    }
    if ( props.attributes.width100 ) {
        additionalClassForKenzapContainer = 'kenzap-lg';
    }

    return (
        <div
            className={ `${ props.className } ${ additionalClassForKenzapContainer } ${ props.attributes.alignment } ${ props.attributes.autoPadding }` }
            style={ { ...styles, ...props.style } }
        >
            { props.children }
        </div>
    );
};
