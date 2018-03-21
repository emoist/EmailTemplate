"use strict";

/**
 * Email builder module
 * Include this module in your project like another Angular module ['email.builder'] or you can rename it.
 */
angular.module('email.builder', [
    'ngRoute',
    angularDragula(angular),
    'pascalprecht.translate',
    'ui.tinymce',
    'ngSanitize',
    'ngAlertify',
    'colorpicker.module'
])
    /**
     * You can upload custom images
     * This is a demo url, you can change with your own
     * At this url, will be send a POST request with 'upload' param, whem 'upload' is what you need to upload
     * You must return a status_code = 200 and put all information in 'data' like 'data.img_url', otherwise return status_txt with your error
     */
    .constant('variables', emailBuilderConfigurations)

    /**
     * Basic TinyMCE configs
     * Change this if you really know what you do
     */
    .value('uiTinymceConfig', {
        baseUrl: emailBuilderConfigurations.tinymceBaseUrl,
        format: 'raw'
    })

    /**
     * Custom directive to emulate Material Design for inputs
     * @example: <input type="text" md-input />
     */
    .directive('mdInput', [
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                // scope: {
                //     ngModel: '='
                // },
                controller: function ($scope, $element) {
                    var $elem = $($element);
                    $scope.updateInput = function () {
                        // clear wrapper classes
                        $elem.closest('.md-input-wrapper').removeClass('md-input-wrapper-danger md-input-wrapper-success md-input-wrapper-disabled');

                        if ($elem.hasClass('md-input-danger')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-danger');
                        }
                        if ($elem.hasClass('md-input-success')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-success');
                        }
                        if ($elem.prop('disabled')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-disabled');
                        }
                        if ($elem.hasClass('label-fixed')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-filled');
                        }
                        if ($elem.val() !== '') {
                            $elem.closest('.md-input-wrapper').addClass('md-input-filled');
                        }
                    };
                },
                link: function (scope, elem, attrs) {

                    var $elem = $(elem);

                    $timeout(function () {
                        if (!$elem.hasClass('md-input-processed')) {

                            if ($elem.prev('label').length) {
                                $elem.prev('label').addBack().wrapAll('<div class="md-input-wrapper"/>');
                            } else {
                                $elem.wrap('<div class="md-input-wrapper"/>');
                            }
                            $elem
                                .addClass('md-input-processed')
                                .closest('.md-input-wrapper')
                                .append('<span class="md-input-bar"/>');
                        }

                        scope.updateInput();

                    }, 100);

                    scope.$watch(function () {
                        return $elem.attr('class');
                    },
                        function (newValue, oldValue) {
                            if (newValue != oldValue) {
                                scope.updateInput();
                            }
                        }
                    );

                    scope.$watch(function () {
                        return $elem.val();
                    },
                        function (newValue, oldValue) {
                            if (!$elem.is(':focus') && (newValue != oldValue)) {
                                scope.updateInput();
                            }
                        }
                    );

                    $elem
                        .on('focus', function () {
                            $elem.closest('.md-input-wrapper').addClass('md-input-focus');
                        })
                        .on('blur', function () {
                            $timeout(function () {
                                $elem.closest('.md-input-wrapper').removeClass('md-input-focus');
                                if ($elem.val() === '') {
                                    $elem.closest('.md-input-wrapper').removeClass('md-input-filled');
                                } else {
                                    $elem.closest('.md-input-wrapper').addClass('md-input-filled');
                                }
                            }, 100);
                        });
                }
            };
        }
    ])
    /**
     * Custom directive to upload images
     * @example: <input type="file" input-file-upload />
     */
    .directive('inputFileUpload', [
        'utils',
        'variables',
        '$timeout',
        function (utils, variables, $timeout) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    element: '=',
                    model: '='
                },
                template: `
                    <div>
                        <div class="upload">
                            <div class="current-image">
                                <img ng-src="{{thumb || model}}" alt="" />
                            </div>
                            <div class="upload-image">
                                <p>Upload an image</p>
                                <a onclick="return false" href="#">Browse</a>
                            </div>
                            <div class="uploading">
                                <i class="material-icons icon-spin">hdr_strong</i>
                            </div>
                        </div>
                        <input type="text" class="md-input" ng-model="model" />
                    </div>
                `,
                link: (scope, elem, attrs) => {

                    let uploadLink = $(elem).find('.upload-image a');
                    let uploadingIcon = $(elem).find('.uploading')

                    let uploadInput = $('<input/>', {
                        type: 'file',
                        name: 'file'
                    }).on('change', function (event) {

                        if (!variables.urlToUploadImage)
                            throw Error('You don\'t set the \'urlToUploadImage\' in variables.');

                        var inputFile = $(event.target)
                        inputFile.prop('disabled', true);
                        uploadLink.text(utils.translate('uploading'));
                        uploadingIcon.addClass('active');
                        var formData = new FormData();
                        formData.append('upload', event.target.files[0]);
                        return $.ajax({
                            url: variables.urlToUploadImage,
                            data: formData,
                            processData: false,
                            contentType: false,
                            type: 'POST',
                            success: function (res) {
                                if (res.status_code == 200) {
                                    event.target.value = null;
                                    scope.$evalAsync(function () {
                                        scope.model = res.data.img_url;
                                        scope.thumb = res.data.thumb_url;
                                        if (scope.element.hasOwnProperty('width')) {
                                            scope.element.width = res.data.img_width;
                                        }
                                    });
                                    utils.notify(utils.translate('your_image_has_been_uploaded')).log();
                                } else {
                                    utils.notify(res.status_txt).error();
                                }
                            },
                            error: function (err) {
                                utils.notify(err.statusText).error();
                            },
                            complete: function () {
                                inputFile.prop('disabled', false);
                                uploadLink.text(utils.translate('browse'));
                                uploadingIcon.removeClass('active');
                            }
                        });
                    })

                    uploadLink.on('click', (e) => {
                        e.preventDefault();

                        if (/uploads.im/.test(variables.urlToUploadImage) && location.protocol == 'https:') {
                            return utils.notify('Sorry, but uploads.im don\'t support https!').error();
                        } else {
                            return uploadInput.click();
                        }
                    })
                }
            };
        }
    ])
    .directive('imageWithLink', [
        function () {
            return {
                restrict: 'A',
                transclude: true,
                scope: {
                    link: '='
                },
                link: function (scope, elem, attrs) {
                    scope.$watch(function () {
                        return scope.link.type;
                    }, function (newValue) {
                        if (newValue !== 'none') {
                            $(elem).unwrap('a');
                            $(elem).wrap($('<a/>', {
                                href: newValue == 'link' ? scope.link.link : 'mailto:' + scope.link.link,
                                target: '_blank'
                            }).on('click', function (e) {
                                e.preventDefault();
                            }));
                        } else {
                            $(elem).unwrap('a');
                        }
                    });

                    scope.$watch(function () {
                        return scope.link.link;
                    }, function (newValue) {
                        $(elem).closest('a').attr('href', scope.link.type == 'link' ? newValue : 'mailto:' + newValue);
                    });

                }
            };
        }
    ])
    .directive('colorInput', function () {
        return {
            restrict: 'E',
            replace: true,
            template: `
                <div>
                    <div class="current-color" ng-style="{ backgroundColor: model }"></div>
                    <input ng-model="model" colorpicker colorpicker-position="top" type="text" />
                </div>
            `,
            scope: {
                model: '='
            },
            link(scope, elem, attrs) {
                $(elem).on('click', '.current-color', () => $(elem).find('input:text').click());
                $(elem).find('input:text').on('focus', () => {
                    $(elem).addClass('focussed')
                }).on('focusout', () => {
                    $(elem).removeClass('focussed')
                });
            }
        }
    })
    .directive('mobilePreview', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                email: '='
            },
            template: `
                <iframe width="320"></iframe>
            `,
            link(scope, iframe, attrs) {
                scope.insertHtml = function (html) {
                    iframe[0].contentWindow.document.open();
                    iframe[0].contentWindow.document.write(html);
                    iframe[0].contentWindow.document.close();
                }

                $timeout(function () {
                    scope.$watch(function () {
                        return scope.email.html
                    }, scope.insertHtml)
                })

            }
        }
    }])

    /**
     * This is all filters what you need for this builder
     * You can change them, but be careful
     */
    .filter('arrToPadding', function () {
        return function (val) {
            var str = '';
            val.forEach(function (p) {
                if (p) {
                    str += p + " ";
                } else {
                    str += 0 + " ";
                }
            });
            return str;
        };
    })
    .filter('hexToRgb', function () {
        return function (hex, opacity) {
            var h = hex.replace('#', '');
            h = h.match(new RegExp('(.{' + h.length / 3 + '})', 'g'));

            for (var i = 0; i < h.length; i++)
                h[i] = parseInt(h[i].length == 1 ? h[i] + h[i] : h[i], 16);

            if (typeof opacity != 'undefined') {
                opacity = opacity / 100;
                h.push(opacity);
            }
            return 'rgba(' + h.join(',') + ')';
        };
    })
    .filter('translateCamelCase', ['utils', function (utils) {
        return function (key_to_translate, additional_data) {
            if (typeof key_to_translate !== 'string') return key_to_translate;
            var snake_key = utils.camelToSnake(key_to_translate);
            var translated = utils.translate(snake_key, additional_data);
            return translated === snake_key ? key_to_translate : translated;
        };
    }])
    .filter('rawHtml', ['$sce', function ($sce) {
        var div = document.createElement('div');
        return function (html, decode) {
            if (decode) {
                div.innerHTML = html;
                return $sce.trustAsHtml(div.textContent);
            }
            return $sce.trustAsHtml(html);
        };
    }])

    /**
     * All utils functions
     */
    .factory('utils', ['$filter', 'alertify', 'variables', function ($filter, alertify, variables) {
        var self = this;
        self.utils = {
            /**
             * Translate key direct in module
             * @example: utils.translate(key_to_translate, additional_data)
             * @param key_to_translate
             * @param additional_data
             * @returns {*}
             */
            translate: function (key_to_translate, additional_data) {
                return $filter('translate')(key_to_translate, additional_data);
            },
            /**
             * Convert string from snake to camel
             * @param str
             * @returns {*}
             */
            snakeToCamel: function (str) {
                if (typeof str !== 'string') return str;
                return str.replace(/_([a-z])/gi, function (m, w) {
                    return "" + w.toUpperCase();
                });
            },
            /**
             * Convert camel to snake
             * @param str
             * @returns {*}
             */
            camelToSnake: function (str) {
                if (typeof str !== 'string') return str;
                return str.replace(/([A-Z])/g, function (m, w) {
                    return "_" + w.toLowerCase();
                });
            },
            /**
             * Generate random id
             * @param prefix
             * @returns {string}
             */
            uid: function (prefix) {
                return (prefix || 'id') + (new Date().getTime()) + "RAND" + (Math.ceil(Math.random() * 100000));
            },
            /**
             * https://gist.github.com/aaronmccall/9751450
             * @param list
             * @param props
             * @returns {*}
             */
            findWhere: function (list, props) {
                var idx = 0;
                var len = list.length;
                var match = false;
                var item, item_k, item_v, prop_k, prop_val;
                for (; idx < len; idx++) {
                    item = list[idx];
                    for (prop_k in props) {
                        // If props doesn't own the property, skip it.
                        if (!props.hasOwnProperty(prop_k)) continue;
                        // If item doesn't have the property, no match;
                        if (!item.hasOwnProperty(prop_k)) {
                            match = false;
                            break;
                        }
                        if (props[prop_k] === item[prop_k]) {
                            // We have a match…so far.
                            match = true;
                        } else {
                            // No match.
                            match = false;
                            // Don't compare more properties.
                            break;
                        }
                    }
                    // We've iterated all of props' properties, and we still match!
                    // Return that item!
                    if (match) return item;
                }
                // No matches
                return null;
            },
            /**
             * @param email
             * @returns {string|*|Object|string|string}
             */
            createEmail: function (email) {
                email = email || {}; // I know, is ugly, but is supported in es5
                let compileMjmlObject = {
                    tagName: 'mjml',
                    children: [{
                        tagName: 'mj-head',
                        children: [{
                            tagName: 'mj-title',
                            content: email.name
                        },
                        {
                            tagName: 'mj-style',
                            attributes: {},
                            content: `@media all and (max-width: 480px) {
                                    td {
                                        width: 100%!important;
                                    }
                                }`
                        }
                        ]
                    },
                    {
                        tagName: 'mj-body',
                        attributes: {},
                        children: [{
                            tagName: 'mj-container',
                            attributes: {
                                'background-color': email.emailSettings.options.backgroundColor
                            },
                            children: [{
                                tagName: 'mj-wrapper',
                                attributes: {
                                    'padding-top': email.emailSettings.options.paddingTop,
                                    'padding-right': email.emailSettings.options.paddingRight,
                                    'padding-bottom': email.emailSettings.options.paddingBottom,
                                    'padding-left': email.emailSettings.options.paddingLeft,
                                },
                                children: email.elements.map(element => {
                                    switch (element.type) {
                                        case 'title':
                                            return {
                                                tagName: 'mj-section',
                                                attributes: {
                                                    'full-width': 'full-width',
                                                    'background-color': element.options.backgroundColor,
                                                    'padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`
                                                },
                                                children: [{
                                                    tagName: 'mj-column',
                                                    attributes: {
                                                        'width': '100%'
                                                    },
                                                    children: [{
                                                        tagName: 'mj-text',
                                                        attributes: {
                                                            'color': element.options.color,
                                                            'align': element.options.align,
                                                            'padding': 0,
                                                            'font-family': element.options.font.family,
                                                            'line-height': 0
                                                        },
                                                        content: `<h1 style="font-weight: ${element.options.font.weight};font-size: 32px;line-height: 1;margin: 0;">${element.options.title}</h1>`
                                                    }]
                                                },
                                                {
                                                    tagName: 'mj-column',
                                                    attributes: {
                                                        'width': '100%'
                                                    },
                                                    children: [{
                                                        tagName: 'mj-text',
                                                        attributes: {
                                                            'color': element.options.color,
                                                            'align': element.options.align,
                                                            'padding': 0,
                                                            'font-family': element.options.font.family
                                                        },
                                                        content: `<h4 style="font-weight: ${element.options.font.weight};margin-bottom: 0;font-size: 16px;">${element.options.subTitle}</h4>`
                                                    }]
                                                }
                                                ]
                                            }

                                        case 'button':
                                            return {
                                                tagName: 'mj-section',
                                                attributes: {
                                                    'full-width': 'full-width',
                                                    'background-color': element.options.backgroundColor,
                                                    'padding': 0
                                                },
                                                children: [{
                                                    tagName: 'mj-column',
                                                    attributes: {
                                                        'width': '100%'
                                                    },
                                                    children: [{
                                                        tagName: 'mj-button',
                                                        attributes: {
                                                            'align': element.options.align,
                                                            'border': `${element.options.border.size}px ${element.options.border.style} ${element.options.border.color}`,
                                                            'border-radius': `${element.options.border.radius}px`,
                                                            'background-color': element.options.buttonBackgroundColor,
                                                            'font-family': `${element.options.font.family}`,
                                                            'color': element.options.font.color,
                                                            'font-size': `${element.options.font.size}px`,
                                                            'font-weight': element.options.font.weight,
                                                            'width': Boolean(element.options.fullWidth) ? '100%' : 'auto',
                                                            'padding': `${element.options.margin[0]} ${element.options.margin[1]} ${element.options.margin[2]} ${element.options.margin[3]}`,
                                                            'inner-padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`,
                                                            'href': element.options.url
                                                        },
                                                        content: element.options.buttonText
                                                    }]
                                                }]
                                            }
                                        case 'text':
                                            return {
                                                tagName: 'mj-section',
                                                attributes: {
                                                    'full-width': 'full-width',
                                                    'background-color': element.options.backgroundColor,
                                                    'padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`
                                                },
                                                children: [{
                                                    tagName: 'mj-column',
                                                    children: [{
                                                        tagName: 'mj-text',
                                                        attributes: {
                                                            'font-size': '13px',
                                                            'color': 'rgb(0, 0, 0)',
                                                            'line-height': '20px',
                                                            'padding': 0,
                                                            'font-family': element.options.font.family
                                                        },
                                                        content: element.options.text
                                                    }]
                                                }]
                                            }
                                        case 'divider':
                                            return {
                                                tagName: 'mj-section',
                                                attributes: {
                                                    'full-width': 'full-width',
                                                    'padding': 0
                                                },
                                                children: [{
                                                    tagName: 'mj-column',
                                                    children: [{
                                                        tagName: 'mj-divider',
                                                        attributes: {
                                                            'padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`,
                                                            'container-background-color': element.options.backgroundColor,
                                                            'border-width': `${element.options.border.size}px`,
                                                            'border-style': `${element.options.border.style}`,
                                                            'border-color': `${element.options.border.color}`
                                                        }
                                                    }]
                                                }]
                                            }

                                        case 'image':
                                            return {
                                                tagName: 'mj-section',
                                                attributes: {
                                                    'full-width': 'full-width',
                                                    'background-color': element.options.backgroundColor,
                                                    'padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`
                                                },
                                                children: [{
                                                    tagName: 'mj-column',
                                                    children: [{
                                                        tagName: 'mj-image',
                                                        attributes: {
                                                            'align': element.options.align,
                                                            'src': element.options.image,
                                                            'alt': element.options.altTag,
                                                            'width': element.options.width,
                                                            'padding': 0,
                                                            'href': element.options.linkTo.type === 'link' && element.options.linkTo.link || element.options.linkTo.type === 'email' && `mailto:${element.options.linkTo.link}` || null
                                                        }
                                                    }]
                                                }]
                                            }
                                        case 'imageTextRight':
                                            return {
                                                tagName: 'mj-section',
                                                attributes: {
                                                    'full-width': 'full-width',
                                                    'background-color': element.options.backgroundColor,
                                                    'padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`
                                                },
                                                children: [{
                                                    tagName: 'mj-column',
                                                    children: [{
                                                        tagName: 'mj-image',
                                                        attributes: {
                                                            'align': element.options.align,
                                                            'src': element.options.image,
                                                            'alt': element.options.altTag,
                                                            'padding': 0,
                                                            'padding-right': '5px',
                                                            'width': element.options.width,
                                                            'href': element.options.linkTo.type === 'link' && element.options.linkTo.link || element.options.linkTo.type === 'email' && `mailto:${element.options.linkTo.link}` || null
                                                        }
                                                    }]
                                                },
                                                {
                                                    tagName: 'mj-column',
                                                    children: [{
                                                        tagName: 'mj-text',
                                                        attributes: {
                                                            'font-size': '13px',
                                                            'color': 'rgb(0, 0, 0)',
                                                            'line-height': '20px',
                                                            'padding': 0,
                                                            'padding-left': '5px',
                                                            'font-family': 'Arial, sans-serif'
                                                            // 'font-family': element.options.font.family
                                                        },
                                                        content: element.options.text
                                                    }]
                                                }
                                                ]
                                            }
                                        case 'imageTextLeft':
                                            return {
                                                tagName: 'mj-section',
                                                attributes: {
                                                    'full-width': 'full-width',
                                                    'background-color': element.options.backgroundColor,
                                                    'padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`
                                                },
                                                children: [{
                                                    tagName: 'mj-column',
                                                    children: [{
                                                        tagName: 'mj-text',
                                                        attributes: {
                                                            'font-size': '13px',
                                                            'color': 'rgb(0, 0, 0)',
                                                            'line-height': '20px',
                                                            'padding': 0,
                                                            'padding-right': '5px',
                                                            'font-family': 'Arial, sans-serif'
                                                            // 'font-family': element.options.font.family
                                                        },
                                                        content: element.options.text
                                                    }]
                                                },
                                                {
                                                    tagName: 'mj-column',
                                                    children: [{
                                                        tagName: 'mj-image',
                                                        attributes: {
                                                            'align': element.options.align,
                                                            'src': element.options.image,
                                                            'alt': element.options.altTag,
                                                            'padding': 0,
                                                            'padding-left': '5px',
                                                            'width': element.options.width,
                                                            'href': element.options.linkTo.type === 'link' && element.options.linkTo.link || element.options.linkTo.type === 'email' && `mailto:${element.options.linkTo.link}` || null
                                                        }
                                                    }]
                                                }
                                                ]
                                            }
                                        case 'imageText2x2':
                                            return {
                                                tagName: 'mj-section',
                                                attributes: {
                                                    'full-width': 'full-width',
                                                    'background-color': element.options.backgroundColor,
                                                    'padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`
                                                },
                                                children: [{
                                                    tagName: 'mj-column',
                                                    children: [{
                                                        tagName: 'mj-image',
                                                        attributes: {
                                                            'src': element.options.image1,
                                                            'alt': element.options.altTag1,
                                                            'padding': '0 5px',
                                                            'width': element.options.width1,
                                                            'href': element.options.linkTo1.type === 'link' && element.options.linkTo1.link || element.options.linkTo1.type === 'email' && `mailto:${element.options.linkTo1.link}` || null
                                                        }
                                                    },
                                                    {
                                                        tagName: 'mj-text',
                                                        attributes: {
                                                            'font-size': '13px',
                                                            'color': 'rgb(0, 0, 0)',
                                                            'line-height': '20px',
                                                            'padding': '0 5px',
                                                            'font-family': 'Arial, sans-serif'
                                                            // 'font-family': element.options.font.family
                                                        },
                                                        content: element.options.text1
                                                    }
                                                    ]
                                                },
                                                {
                                                    tagName: 'mj-column',
                                                    children: [{
                                                        tagName: 'mj-image',
                                                        attributes: {
                                                            'src': element.options.image2,
                                                            'alt': element.options.altTag2,
                                                            'padding': '0 5px',
                                                            'width': element.options.width2,
                                                            'href': element.options.linkTo2.type === 'link' && element.options.linkTo2.link || element.options.linkTo2.type === 'email' && `mailto:${element.options.linkTo2.link}` || null
                                                        }
                                                    },
                                                    {
                                                        tagName: 'mj-text',
                                                        attributes: {
                                                            'font-size': '13px',
                                                            'color': 'rgb(0, 0, 0)',
                                                            'line-height': '20px',
                                                            'padding': '0 5px',
                                                            'font-family': 'Arial, sans-serif'
                                                            // 'font-family': element.options.font.family
                                                        },
                                                        content: element.options.text2
                                                    }
                                                    ]
                                                }
                                                ]
                                            }
                                        case 'imageText3x2':
                                            return {
                                                tagName: 'mj-section',
                                                attributes: {
                                                    'full-width': 'full-width',
                                                    'background-color': element.options.backgroundColor,
                                                    'padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`
                                                },
                                                children: [{
                                                    tagName: 'mj-column',
                                                    children: [{
                                                        tagName: 'mj-image',
                                                        attributes: {
                                                            'src': element.options.image1,
                                                            'alt': element.options.altTag1,
                                                            'padding': '0 3px 3px',
                                                            'width': element.options.width1,
                                                            'href': element.options.linkTo1.type === 'link' && element.options.linkTo1.link || element.options.linkTo1.type === 'email' && `mailto:${element.options.linkTo1.link}` || null
                                                        }
                                                    },
                                                    {
                                                        tagName: 'mj-text',
                                                        attributes: {
                                                            'font-size': '13px',
                                                            'color': 'rgb(0, 0, 0)',
                                                            'line-height': '20px',
                                                            'padding': '0 3px',
                                                            'font-family': 'Arial, sans-serif'
                                                            // 'font-family': element.options.font.family
                                                        },
                                                        content: element.options.text1
                                                    }
                                                    ]
                                                },
                                                {
                                                    tagName: 'mj-column',
                                                    children: [{
                                                        tagName: 'mj-image',
                                                        attributes: {
                                                            'src': element.options.image2,
                                                            'alt': element.options.altTag2,
                                                            'padding': '0 3px 3px',
                                                            'width': element.options.width2,
                                                            'href': element.options.linkTo2.type === 'link' && element.options.linkTo2.link || element.options.linkTo2.type === 'email' && `mailto:${element.options.linkTo2.link}` || null
                                                        }
                                                    },
                                                    {
                                                        tagName: 'mj-text',
                                                        attributes: {
                                                            'font-size': '13px',
                                                            'color': 'rgb(0, 0, 0)',
                                                            'line-height': '20px',
                                                            'padding': '0 3px',
                                                            'font-family': 'Arial, sans-serif'
                                                            // 'font-family': element.options.font.family
                                                        },
                                                        content: element.options.text2
                                                    },
                                                    ]
                                                },
                                                {
                                                    tagName: 'mj-column',
                                                    children: [{
                                                        tagName: 'mj-image',
                                                        attributes: {
                                                            'src': element.options.image3,
                                                            'alt': element.options.altTag3,
                                                            'padding': '0 3px 3px',
                                                            'width': element.options.width3,
                                                            'href': element.options.linkTo3.type === 'link' && element.options.linkTo3.link || element.options.linkTo3.type === 'email' && `mailto:${element.options.linkTo3.link}` || null
                                                        }
                                                    },
                                                    {
                                                        tagName: 'mj-text',
                                                        attributes: {
                                                            'font-size': '13px',
                                                            'color': 'rgb(0, 0, 0)',
                                                            'line-height': '20px',
                                                            'padding': '0 3px',
                                                            'font-family': 'Arial, sans-serif'
                                                            // 'font-family': element.options.font.family
                                                        },
                                                        content: element.options.text3
                                                    },
                                                    ]
                                                }
                                                ]
                                            }
                                        case 'social':
                                            let links = '';
                                            Object.keys(element.options.links).forEach(key => {
                                                if (element.options.links[key].active) {
                                                    links += `<a href="${element.options.links[key].link}" target="_blank" style="border: none;text-decoration: none;">
                                                                <img border="0" src="${variables.assetsPath}/social/${key}.png">
                                                             </a>`
                                                }
                                            })

                                            return {
                                                tagName: 'mj-section',
                                                attributes: {
                                                    'full-width': 'full-width',
                                                    'background-color': element.options.backgroundColor,
                                                    'padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`
                                                },
                                                children: [{
                                                    tagName: 'mj-column',
                                                    attributes: {
                                                        'width': '100%'
                                                    },
                                                    children: [{
                                                        tagName: 'mj-text',
                                                        attributes: {
                                                            'color': element.options.color,
                                                            'align': element.options.align,
                                                            'padding': 0,
                                                            'font-family': 'Arial, sans-serif',
                                                            'line-height': 0
                                                        },
                                                        content: links
                                                    }]
                                                }]
                                            }
                                        default:
                                            return false;
                                    }
                                })
                            }]
                        }]
                    }
                    ]
                }
                return new Promise(function (succesFn, rejectFn) {
                    if (!variables.mjmlCompileAdress && (!variables.mjmlPublicKey || !variables.mjmlApplicationId)) {
                        return rejectFn('You did\'nt include compile address for MJML or MJML API keys!');
                    }
                    if (variables.mjmlPublicKey && variables.mjmlApplicationId) {
                        return $.ajax({
                            url: 'https://api.mjml.io/v1/render',
                            method: 'POST',
                            data: JSON.stringify({ mjml: JSON.stringify(compileMjmlObject) }),
                            datatype: 'json',
                            processData: false,
                            beforeSend(req) {
                                req.setRequestHeader('Authorization', `Basic ${btoa(`${variables.mjmlApplicationId}:${variables.mjmlPublicKey}`)}`)
                            },
                            success(data) {
                                return succesFn(data)
                            }
                        })
                    }
                    return $.post(variables.mjmlCompileAdress, JSON.stringify(compileMjmlObject)).then(succesFn);
                });
            },
            /**
             * Notify
             * @param msg
             * @param callback
             * @returns {{log: utils.log, success: utils.success, error: utils.error}}
             */
            notify: function (msg, callback) {
                return {
                    log: function () {
                        return alertify.log(msg, callback);
                    },
                    success: function () {
                        alertify.success(msg, callback);
                    },
                    error: function () {
                        alertify.error(msg, callback);
                    }
                };
            },
            /**
             * Confirm dialog
             * @param msg
             * @param succesFn
             * @param cancelFn
             * @param okBtn
             * @param cancelBtn
             * @returns {IAlertify}
             */
            confirm: function (msg, succesFn, cancelFn, okBtn, cancelBtn) {
                return alertify
                    .okBtn(okBtn)
                    .cancelBtn(cancelBtn)
                    .confirm(msg, succesFn, cancelFn);
            },
            /**
             * Alert dialog
             * @param msg
             * @returns {IAlertify}
             */
            alert: function (msg) {
                return alertify
                    .okBtn("Accept")
                    .alert(msg);
            },
            /**
             * Prompt dialog
             * @param defaultvalue
             * @param promptMessage
             * @param successFn
             * @param cancelFn
             * @returns {IAlertify}
             */
            prompt: function (defaultvalue, promptMessage, successFn, cancelFn) {
                return alertify
                    .defaultValue(defaultvalue)
                    .prompt(promptMessage, successFn, cancelFn);
            },
            /**
             * Validate email before save and import
             * @param emailToValidate
             * @returns {boolean}
             */
            validateEmail: function (emailToValidate) {
                return angular.isObject(emailToValidate) &&
                    // emailToValidate.hasOwnProperty('name') &&
                    angular.isArray(emailToValidate.elements) &&
                    angular.isString(emailToValidate.html) &&
                    angular.isObject(emailToValidate.emailSettings) &&
                    emailToValidate.emailSettings.type == 'emailSettings' &&
                    angular.isObject(emailToValidate.emailSettings.options);
            },
            /**
             * Track events with Google Analytics
             * @param category
             * @param event
             * @param name
             * @returns {*}
             */
            trackEvent: function (category, event, name) {
                if (variables.trackEvents && window.ga) {
                    return window.ga('send', 'event', category, event, name);
                } else if (variables.trackEvents && !window.ga) {
                    return console.info('To track events, add Google UA in config.json file!');
                }
            },
            removeLineBreaks: function (html) {
                return html.replace(/\n\s*\n/gi, '\n');
            }
        };
        return self.utils;
    }])
    /**
     * Storage
     */
    .factory('storage', ['utils', 'variables', '$http', 'store', 'jwtHelper', '$location', function (utils, variables, $http, store, jwtHelper, $location) {
        'use strict';

        var jwt = store.get('jwt');
        var user = jwt && jwtHelper.decodeToken(jwt);

        var defaultEmail = {
            name: variables.defaults.newEmailName,
            elements: [],
            html: '',
            emailSettings: {
                options: variables.defaults.emailOptions,
                type: 'emailSettings'
            }
        };

        var STORAGE_ID = 'Email',
            self = this;

        self.opts = {
            /**
             * Get Email from localStorage
             */
            get: function (email_id) {
                return new Promise(function (resolve, reject) {
                    try {
                        var email = {}
                        if (email_id == 'create') {
                            resolve(JSON.parse(JSON.stringify(defaultEmail)));
                        }
                        else {
                            $http.post('/emails/' + email_id, {user_id: user.id})
                            .then(response => {
                                email = JSON.parse(decodeURI(response.data)) || defaultEmail;
                                resolve(email);
                            }, err => {
                                utils.notify(err.data).error();
                                $location.path('/emails')
                            })
                        }
                    } catch (e) {
                        utils.notify(e).error();
                    }
                });
            },

            /**
             * Put changed data in Email
             * Emulate server storage with Promise
             * @param email
             * @returns {Promise}
             */
            put: function (email, email_id) {
                return new Promise(function (resolve, reject) {
                    try {
                        // Remove multine breaks
                        email.html = utils.removeLineBreaks(email.html);
                        if (email_id == 'create') {
                            $http.post('/emails/create', {template: encodeURI(JSON.stringify(email)), user_id: user.id})
                            .then(response => {
                                resolve()
                            }, err => {
                                utils.notify(err.data).error();
                            })
                        }
                        else {
                            $http.post('/emails/update', {template: encodeURI(JSON.stringify(email)), id: email_id})
                            .then(response => {
                                resolve()
                            }, err => {
                                utils.notify(err.data).error();
                            })
                        }

                        resolve();
                    } catch (e) {
                        utils.notify(e).error();
                        reject(e);
                    }
                });
            },

            /**
             * Delete current email template
             * @returns {*}
             */
            delete: function () {
                return new Promise(function (resolve, reject) {
                    resolve(JSON.parse(JSON.stringify(defaultEmail)))
                })
            }
        };

        return self.opts;
    }])

    /**
     * Module configurations
     */
    .config(['$routeProvider', '$translateProvider', '$translatePartialLoaderProvider', '$sceDelegateProvider','$compileProvider', 'variables',
        function ($routeProvider, $translateProvider, $translatePartialLoaderProvider, $sceDelegateProvider, $compileProvider, variables) {
            $sceDelegateProvider.resourceUrlWhitelist(['self']);
            $compileProvider.debugInfoEnabled(false);

            /**
             * Change '/' with your email builder route
             */
            $routeProvider.when('/emails/:id', {

                templateUrl: variables.layoutsPath + '/' + variables.defaultLayout + '/builder.html',
                controller: 'emailCtrl',
                data: {
                    requiresLogin: true
                }
            });

            /**
             * Tanslate configurations
             * Change 'urlTemplate' if you have another location for translations
             */
            $translatePartialLoaderProvider.addPart('builder');
            $translateProvider.useLoader('$translatePartialLoader', {
                urlTemplate: variables.translateTemplateUrl
            });
            $translateProvider.preferredLanguage('en');
            $translateProvider.useSanitizeValueStrategy('sanitize');
            $translateProvider.fallbackLanguage('en');
            $translateProvider.useSanitizeValueStrategy('escape');
        }])

    .controller('emailCtrl', ['$scope', 'utils', 'storage', 'dragulaService', '$interpolate', '$translate', '$templateCache', 'variables' ,'$routeParams', 'store', '`',
        function ($scope, utils, storage, dragulaService, $interpolate, $translate, $templateCache, variables, $routeParams, store, $location) {
            $scope.email_id = $routeParams.id;

            /**
             * Sync with store
             */
            storage.get($scope.email_id).then(function (email) {
                $scope.Email = email;
                $scope.cloneEmail = JSON.parse(JSON.stringify(email));
                $scope.$evalAsync(function () {
                    $scope.currentElement = $scope.Email.emailSettings;
                })
            });

            /**
             * All elements to drag and drop
             * @type {*[]}
             */
            $scope.elements = Object.keys(variables.blocks).map(function (key) {
                return variables.blocks[key].element
            }).sort(function (elem, elem2) {
                return variables.blocks[elem.type].sort - variables.blocks[elem2.type].sort
            }).filter(function (elem) {
                return variables.disableBlocks.indexOf(elem.type) === -1
            })

            /**
             * Check variables from HTML
             */
            $scope.getVariable = function (prop) {
                return variables[prop]
            }

            /**
             * Default language
             * @type {string}
             */
            $scope.currentLanguage = 'en';
            /**
             * Tinymce options
             * @type {{inline: boolean, skin: string, theme: string, plugins: string[], toolbar: string, fontsize_formats: string}}
             */
            $scope.tinymceOptions = {
                inline: true,
                skin: 'lightgray',
                theme: 'modern',
                plugins: ["advlist autolink lists link image charmap", "searchreplace visualblocks code", "insertdatetime media table contextmenu paste", 'textcolor'],
                toolbar: "undo redo | bold italic fontsizeselect forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | link",
                fontsize_formats: '8pt 9pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 18pt 24pt 36pt'
            };

            /**
             * Include Mailchimo Merge tags in Tinymce if is enabled
             */
            if (variables.includeMailchimpMergeTags) {
                $scope.tinymceOptions = angular.extend($scope.tinymceOptions, {
                    setup: function (editor) {
                        editor.addButton('mailchimpMergeTags', {
                            type: 'menubutton',
                            text: 'Merge Tags',
                            icon: false,
                            menu: ['*|FNAME|*', '*|LNAME|*', '*|EMAIL|*', '*|LIST:NAME|*', '*|LIST:COMPANY|*', '*|LIST:SUBSCRIBERS|*', '*|USER:COMPANY|*', '*|USER:ADDRESS|*', '*|USER:PHONE|*', '*|MC:DATE|*', '*|CURRENT_YEAR|*', '*|UNSUB|*', '*|UPDATE_PROFILE|*'].map(function (tag) {
                                return {
                                    text: tag,
                                    onclick: function () {
                                        editor.insertContent(tag);
                                    }
                                }
                            })
                        });
                    }
                });
            }

            $scope.addSocialNetwork = function (links, selectedNetwork) {
                if (selectedNetwork) {
                    links[selectedNetwork].active = true
                }
            }

            /**
             * Get template by type
             *
             * @param type
             * @returns {string}
             */
            $scope.getTemplate = function (type) {
                return type ? type + 'Template' : 'textTemplate';
            };
            /**
             * Remove block element by id
             * @param id
             */
            $scope.removeElement = function (id) {
                return utils.confirm(utils.translate('are_you_sure'), function () {
                    var el = utils.findWhere($scope.Email.elements, {
                        id: id
                    });
                    $scope.Email.elements.splice($scope.Email.elements.indexOf(el), 1);
                    utils.trackEvent('Elements', 'remove', el.type);
                    $scope.currentElement = $scope.Email.emailSettings;
                    $scope.$apply();
                }, null, utils.translate('delete_element'), utils.translate('do_not_remove_element'));
            };
            /**
             * Clone block element by id
             * @param id
             */
            $scope.cloneElement = function (id) {
                var el = utils.findWhere($scope.Email.elements, {
                    id: id
                });
                var newEl = JSON.parse(JSON.stringify(el));
                newEl.id = utils.uid();
                utils.trackEvent('Elements', 'clone', newEl.type);
                $scope.Email.elements.splice($scope.Email.elements.indexOf(el) + 1, 0, newEl);
                // $scope.changeHtml()
            };
            /**
             * Edit block element by id
             * @param id
             */
            $scope.editElement = function (id) {
                if (!id) {
                    return $scope.currentElement = $scope.Email.emailSettings
                }
                if ($scope.preview) return;
                $scope.currentElement = id != 'emailSettings' ? utils.findWhere($scope.Email.elements, {
                    id: id
                }) : $scope.Email[id];
                $scope.currentElement && utils.trackEvent('Email', 'edit', $scope.currentElement.type);
            };
            /**
             * Change languge
             * @param key
             * @returns {Server|Object|string}
             */
            $scope.changeLanguage = function (key) {
                $scope.currentLanguage = key;
                return $translate.use(key);
            };
            /**
             * Check if email has changed, to enable or disable save button
             * @returns {boolean}
             */
            $scope.hasChanges = function () {
                return !angular.equals($scope.Email, $scope.cloneEmail)
            };
            /**
             * Save email example
             */
            $scope.saveEmailTemplate = function () {
                utils.createEmail($scope.Email).then(function (res) {
                    if (res.errors.length) {
                        return utils.notify(res.errors.map(function (err) {
                            return err.message
                        }).join('<br>')).error()
                    } else {
                        $scope.Email.html = res.html;
                        // $scope.Email = is what you need to save
                        storage.put($scope.Email, $scope.email_id).then(function () {
                            utils.notify(utils.translate('email_saved')).success();
                            utils.trackEvent('Email', 'saved');
                            $scope.cloneEmail = JSON.parse(JSON.stringify($scope.Email));
                            $scope.$evalAsync(function () {
                                $scope.currentElement = $scope.Email.emailSettings
                            })
                        });
                    }
                }, function (err) {
                    return utils.notify(err).error()
                })
            };

            /**
             * Open export container
             * @returns {*}
             */
            $scope.openExportContainer = function () {
                if (!$scope.Email.elements.length)
                    return utils.notify(utils.translate('nothing_to_export')).log();
                $scope.exportAsHtml = false;
                $scope.currentElement = 'export';
                // $scope.changeHtml();
            };

            /**
             * Export email as JSON
             * @returns {*|{trigger, _default}}
             */
            $scope.exportEmailAsJson = function () {
                var a = document.createElement('a');
                a.target = '_blank';
                utils.trackEvent('Email', 'export', 'JSON');
                a.href = 'data:attachment/json,' + encodeURI(JSON.stringify($scope.Email));
                a.download = utils.uid('export') + '.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };

            /**
             * Download Email as HTML
             */
            $scope.downloadHtml = function () {
                var a = document.createElement('a');
                a.target = '_blank';
                utils.trackEvent('Email', 'export', 'HTML');
                a.href = 'data:attachment/html,' + encodeURI($scope.Email.html);
                a.download = utils.uid('export') + '.html';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };

            /**
             * Import email
             * @returns {*}
             */
            $scope.importEmail = function () {
                var file = $('<input />', {
                    type: 'file',
                    name: 'import-file'
                }).on('change', function () {
                    var importedFile = new FileReader();
                    importedFile.onload = function () {
                        var importedData = JSON.parse(importedFile.result);
                        if (utils.validateEmail(importedData)) {
                            utils.trackEvent('Email', 'import');
                            $scope.$evalAsync(function () {
                                $scope.currentElement = undefined;
                                $scope.Email = importedData;
                                $scope.cloneEmail = JSON.parse(JSON.stringify(importedData));
                            });
                            utils.notify(utils.translate('email_has_been_imported', {
                                lastModified: new Date(fileToImport.lastModified).toLocaleString()
                            })).success()
                        } else {
                            utils.notify(utils.translate('imported_data_isnt_valid')).error()
                        }
                    };
                    var fileToImport = this.files[0];
                    if (fileToImport.name.slice(-4) !== 'json') {
                        return utils.notify(utils.translate('invalid_format_file')).log()
                    }
                    importedFile.readAsText(fileToImport)
                });

                if (!$scope.Email.elements.length)
                    return file.click();

                return utils.confirm(utils.translate('before_import'), function () {
                    return file.click()
                }, function () {
                    return utils.notify(utils.translate('import_canceled')).log()
                }, utils.translate('accept'), utils.translate('deny'))
            };

            /**
             * Activate preview Email
             * @returns {*}
             */
            $scope.previewEmail = function () {
                if (!$scope.Email.elements.length)
                    return utils.notify(utils.translate('nothing_to_preview')).log();
                utils.trackEvent('Email', 'preview');
                $scope.preview = true;
                $scope.currentElement = undefined;
            };

            /**
             * Show and hide tinymce on preview
             */
            $scope.$watch('preview', function (newV) {
                tinymce.editors.forEach(function (editor) {
                    return editor[newV ? 'hide' : 'show']();
                })
            })

            $scope.mobilePreview = false;

            /**
             * Delete all elements from builder
             * @returns {*}
             */
            $scope.deleteAllElements = function () {
                return utils.confirm(utils.translate('before_delete_all_elements'), function () {
                    return storage.delete().then(function (email) {
                        $scope.$evalAsync(function () {
                            $scope.currentElement = undefined;
                            $scope.Email = email;
                            $scope.cloneEmail = JSON.parse(JSON.stringify(email));
                        });
                    });
                }, null, utils.translate('accept'), utils.translate('deny'))
            };

            /**
             * Dragula configuration for builder elements
             */
            dragulaService.options($scope, 'element', {
                isContainer: function (el) {
                    return el.classList.contains('email-container');
                },
                copy: true,
                copySortSource: false,
                removeOnSpill: true,
                moves: function (el, source, handle, sibling) {
                    return !$(source).hasClass('email-container');
                },
                invalid: function (el, handle) {
                    return false; // don't prevent any drags from initiating by default
                }
            });
            /**
             * Dragula configuration for builder
             */
            dragulaService.options($scope, 'element-html', {
                copy: false,
                copySortSource: false,
                moves: function (el, source, handle, sibling) {
                    return $(handle).hasClass('move');
                },
                invalid: function (el, handle) {
                    return false; // don't prevent any drags from initiating by default
                }
            });
            /**
             * Drag and drop events for elements
             */
            $scope.$on('element.drop', function (event, el, target, source, sibling) {
                var elementType = $(el).data('type');
                var element = $.extend(true, {}, {
                    type: elementType,
                    options: variables.blocks[elementType].defaultOptions
                });
                element.id = utils.uid();
                var index = $(sibling).index();
                $('.email-container li').remove();
                index == -1 ? $scope.Email.elements.push(element) : $scope.Email.elements.splice(index - 1, 0, element);
                utils.trackEvent('Elements', 'drop', element.type);
                // $scope.currentElement = undefined;
                $scope.$apply();
            });
            /**
             * Drag and drop events for elements inside the builder
             */
            $scope.$on('element-html.drop', function (event, el, target, source, sibling) {
                var id = $(el).attr('id');
                var index = $(sibling).index();
                if (index == -1) {
                    index = $scope.Email.elements.length - 1;
                } else {
                    index--;
                }
                var element = utils.findWhere($scope.Email.elements, {
                    id: id
                });
                var oldIndex = $scope.Email.elements.indexOf(element);
                if (index >= $scope.Email.elements.length) {
                    var k = index - $scope.Email.elements.length;
                    while ((k--) + 1) {
                        $scope.Email.elements.push(undefined);
                    }
                }
                $scope.Email.elements.splice(index, 0, $scope.Email.elements.splice(oldIndex, 1)[0]);
                $scope.$apply();
                // $scope.currentElement = undefined;
                return false;
            });

            $scope.logout = function() {
                store.remove('jwt');
                $location.path('/');
            }
        }
    ]);