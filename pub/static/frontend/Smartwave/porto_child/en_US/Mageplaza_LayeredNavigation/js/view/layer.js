/**
 * Mageplaza
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Mageplaza.com license sliderConfig is
 * available through the world-wide-web at this URL:
 * https://www.mageplaza.com/LICENSE.txt
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade this extension to newer
 * version in the future.
 *
 * @category    Mageplaza
 * @package     Mageplaza_LayeredNavigation
 * @copyright   Copyright (c) Mageplaza (https://www.mageplaza.com/)
 * @license     https://www.mageplaza.com/LICENSE.txt
 */

define([
    'jquery',
    'Mageplaza_AjaxLayer/js/action/submit-filter',
    'Magento_Catalog/js/price-utils',
    'accordion',
    'productListToolbarForm',
    'jquery/jquery-ui'
], function ($, submitFilterAction, ultil) {
    "use strict";
    var next_page = "";
    var loading = false;
    var infinite_loaded_count = 0;
    var active = false;

    $.widget('mageplaza.layer', $.mage.accordion, {
        options: {
            openedState: 'active',
            collapsible: true,
            multipleCollapsible: true,
            animate: 200,
            productsListSelector: '#layer-product-list',
            mobileShopbyElement: '#layered-filter-block .filter-title [data-role=title]',
            collapsibleElement: '[data-role=ln_collapsible]',
            header: '[data-role=ln_title]',
            content: '[data-role=ln_content]',
            isCustomerLoggedIn: false,
            isAjax: true,
            params: [],
            active: [],
            activeDesktop: [],
            activeMobile: [],
            checkboxEl: 'input[type=checkbox], input[type=radio]',
            sliderElementPrefix: '#ln_slider_',
            sliderTextElementPrefix: '#ln_slider_text_'
        },

        _create: function () {
            this.initActiveItems();

            this._super();

            this.initProductListUrl();
            this.initObserve();
            this.initSlider();
            this.initWishlistCompare();
            this.selectedAttr();
            this.renderCategoryTree();
        },

        inFinite: function() {
            var self = this;
            next_page = "";
            if($(self.options.productsListSelector +' .infinite-loader').length > 0){
                active = true;
            }
            $(".pages-items li > a.next").each(function(){
                next_page = $(this).attr("href");
            });
            if(!next_page){
                $('.infinite-loader').hide();
            }
            $(window).scroll(function(){
                if(!loading && next_page && active && $(".infinite-loader").hasClass('scrolling') && $(window).scrollTop() >= $(".infinite-loader").offset().top-$(window).height()+100){
                    loading = true;
                    $(".pages-items li > a.next").each(function(){
                        next_page = $(this).attr("href");
                    });
                    self.ajaxInfinite(next_page);
                }
            });
            $(".infinite-loader .btn-load-more").click(function(){
                if(!loading && next_page){
                    loading = true;
                    self.ajaxInfinite(next_page);
                }
            });
        },

        ajaxInfinite: function (submitUrl) {
            var self = this;
            infinite_loaded_count++;
            $('.infinite-loader .btn-load-more').hide();
            $('.infinite-loader .loading').hide();
            $.ajax({
                url: submitUrl,
                type: 'get',
                beforeSend: function () {
                    $('.infinite-loader .btn-load-more').hide();
                    $('.infinite-loader .loading').show();
                },
                success: function (res) {
                    loading = false;
                    var $products = $(res.products);
                    if (res.backUrl) {
                        window.location = res.backUrl;
                        return;
                    }
                    if($products){
                        $products.each(function(i,el){
                            if($(el).hasClass('products-grid')){
                                var items_grid = $(this).find('.product-items .item');
                                $(self.options.productsListSelector + ' .products.wrapper .product-items').append(items_grid);
                                $(self.options.productsListSelector).trigger('contentUpdated');
                            }
                            if($(el).hasClass('products-list')){
                                var items_list = $(this).find('.product-items .item');
                                $(self.options.productsListSelector + ' .products.wrapper .product-items').append(items_list);
                                $(self.options.productsListSelector).trigger('contentUpdated');
                            }
                            if($(el).hasClass('toolbar-products')){
                                if($(this).find('.pages a.next').length > 0){
                                    $(self.options.productsListSelector + ' .pages a.next').attr('href', $(this).find('.pages a.next').attr('href'));
                                }else{
                                    $(self.options.productsListSelector + ' .pages a.next').remove();
                                }
                            }
                        });
                        if($("form[data-role=tocart-form]").length > 0 && !redirect_cart) {
                            $("form[data-role=tocart-form]").catalogAddToCart();
                        }
                        window.setTimeout(function(){
                          $( '.product-item-info .effect-bhesfd' ).each( function() {
                              var $item = $( this ),
                                  $detail = $item.find( '.product-item-details .product-item-inner' ),
                                  height = $item.height() + $detail.height() + 32;
                              $item.find( '>.content-shadow' ).height( height );
                              $( window ).on( 'resize', function() {
                                  $detail = $item.find( '.product-item-details .product-item-inner' );
                                  height = $item.height() + $detail.height() + 32;
                                  $item.find('>.content-shadow').height( height );
                              } );
                          });
                        }, 500);
                        $('.main .products.grid .product-items li.product-item:nth-child(2n)').addClass('nth-child-2n');
                        $('.main .products.grid .product-items li.product-item:nth-child(2n+1)').addClass('nth-child-2np1');
                        $('.main .products.grid .product-items li.product-item:nth-child(3n)').addClass('nth-child-3n');
                        $('.main .products.grid .product-items li.product-item:nth-child(3n+1)').addClass('nth-child-3np1');
                        $('.main .products.grid .product-items li.product-item:nth-child(4n)').addClass('nth-child-4n');
                        $('.main .products.grid .product-items li.product-item:nth-child(4n+1)').addClass('nth-child-4np1');
                        $('.main .products.grid .product-items li.product-item:nth-child(5n)').addClass('nth-child-5n');
                        $('.main .products.grid .product-items li.product-item:nth-child(5n+1)').addClass('nth-child-5np1');
                        $('.main .products.grid .product-items li.product-item:nth-child(6n)').addClass('nth-child-6n');
                        $('.main .products.grid .product-items li.product-item:nth-child(6n+1)').addClass('nth-child-6np1');
                        $('.main .products.grid .product-items li.product-item:nth-child(7n)').addClass('nth-child-7n');
                        $('.main .products.grid .product-items li.product-item:nth-child(7n+1)').addClass('nth-child-7np1');
                        $('.main .products.grid .product-items li.product-item:nth-child(8n)').addClass('nth-child-8n');
                        $('.main .products.grid .product-items li.product-item:nth-child(8n+1)').addClass('nth-child-8np1');
                        var hist = submitUrl;
                        if(submitUrl.indexOf("p=") > -1){
                            var len = submitUrl.length-submitUrl.indexOf("p=");
                            var str_temp = submitUrl.substr(submitUrl.indexOf("p="),len);
                            var page_param = "";
                            if(str_temp.indexOf("&") == -1){
                                page_param = str_temp;
                            } else {
                                page_param = str_temp.substr(0,str_temp.indexOf("&"));
                            }
                            hist = submitUrl.replace(page_param, "");
                        }
                        if (typeof window.history.pushState === 'function') {
                            window.history.pushState({url: hist}, '', hist);
                        }
                        if(typeof enable_quickview != 'undefined' && enable_quickview == true) {
                            requirejs(['jquery', 'weltpixel_quickview' ],
                                function($, quickview) {
                                    $('.weltpixel-quickview').off('click').on('click', function() {
                                        var prodUrl = $(this).attr('data-quickview-url');
                                        if (prodUrl.length) {
                                            quickview.displayContent(prodUrl);
                                        }
                                    });
                                });
                        }
                        $(".products-grid .weltpixel-quickview").each(function(){
                            $(this).parent().parent().addClass('has-quickview');
                            if($(this).parents('.product-type-advanced').find(".product-item-photo.porto-tb-featured-image .icon-absolute").length > 0){
                              $(this).appendTo($(this).parents('.product-type-advanced').find(".product-item-photo .porto-tb-featured-image .product-item-inner .product-item-actions"));
                            }else{
                              $(this).appendTo($(this).parent().parent().children(".product-item-photo"));
                            }
                        });
                        $("#layer-product-list img.porto-lazyload:not(.porto-lazyload-loaded)").lazyload({effect:"fadeIn"});
                        if ($('#layer-product-list .porto-lazyload:not(.porto-lazyload-loaded)').closest('.owl-carousel').length) {
                            $('#layer-product-list .porto-lazyload:not(.porto-lazyload-loaded)').closest('.owl-carousel').on('initialized.owl.carousel', function() {
                                $(this).find('.porto-lazyload:not(.porto-lazyload-loaded)').trigger('appear');
                            });
                            $('#layer-product-list .porto-lazyload:not(.porto-lazyload-loaded)').closest('.owl-carousel').on('changed.owl.carousel', function() {
                                $(this).find('.porto-lazyload:not(.porto-lazyload-loaded)').trigger('appear');
                            });
                        }
                        self.initWishlistCompare();
                        next_page = "";
                        $(".pages-items li > a.next").each(function(){
                            next_page = $(this).attr("href");
                        });
                        $('.infinite-loader .loading').hide();
                        if(next_page){
                            $('.infinite-loader .btn-load-more').show();
                            $(".infinite-loader .btn-load-more").unbind("click").click(function(){
                                if(!loading && next_page){
                                    loading = true;
                                    self.ajaxInfinite(next_page);
                                }
                            });
                        }
                    }

                },
                error: function () {
                    window.location.reload();
                }
            });
        },

        initActiveItems: function () {
            var layerActivesDesktop = this.options.activeDesktop,
                layerActivesMobile  = this.options.activeMobile,
                activesDesktop = [],
                activesMobile = [];
            if ($(".page-layout-1column").length){
                this.options.multipleCollapsible = false;
            }

            if (typeof window.layerActiveTabs !== 'undefined') {
                layerActivesDesktop, layerActivesMobile = window.layerActiveTabs;
            }
            if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
                || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
                if (layerActivesMobile.length) {
                    this.element.find('.filter-options-item').each(function (index) {
                        if (~$.inArray($(this).attr('attribute'), layerActivesMobile)) {
                            activesMobile.push(index);
                        }
                    });
                }
                this.options.active = activesMobile;
                return this;
            }else{
                if (layerActivesDesktop.length) {
                    this.element.find('.filter-options-item').each(function (index) {
                        if (~$.inArray($(this).attr('attribute'), layerActivesDesktop)) {
                            activesDesktop.push(index);
                        }
                    });
                }
                this.options.active = activesDesktop;
                return this;
            }
        },

        initProductListUrl: function () {
            var isProcessToolbar = false,
                isAjax = this.options.isAjax;
            $.mage.productListToolbarForm.prototype.changeUrl = function (paramName, paramValue, defaultValue) {
                if (isProcessToolbar) {
                    return;
                }
                if (isAjax) {
                    isProcessToolbar = true;
                }

                var urlPaths = this.options.url.split('?'),
                    baseUrl = urlPaths[0],
                    urlParams = urlPaths[1] ? urlPaths[1].split('&') : [],
                    paramData = {},
                    parameters;
                for (var i = 0; i < urlParams.length; i++) {
                    parameters = urlParams[i].split('=');
                    paramData[parameters[0]] = parameters[1] !== undefined
                        ? window.decodeURIComponent(parameters[1].replace(/\+/g, '%20'))
                        : '';
                }
                paramData[paramName] = paramValue;
                if (paramValue === defaultValue) {
                    delete paramData[paramName];
                }
                paramData = $.param(paramData);
                if (isAjax) {
                    submitFilterAction(baseUrl + (paramData.length ? '?' + paramData : ''));
                } else location.href = baseUrl + (paramData.length ? '?' + paramData : '');
            }
        },

        initObserve: function () {
            var self = this;
            var isAjax = this.options.isAjax;
            // fix browser back, forward button
            if (typeof window.history.replaceState === "function") {
                window.history.replaceState({url: document.URL}, document.title);

                setTimeout(function () {
                    window.onpopstate = function (e) {
                        if (e.state) {
                            submitFilterAction(e.state.url, 1);
                        }
                    };
                }, 0)
            }
            var pageElements = $('#layer-product-list').find('.pages a');
            pageElements.each(function () {
                var el = $(this),
                    link = self.checkUrl(el.prop('href'));
                if (!link) {
                    return;
                }

                el.bind('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if (isAjax) {
                        submitFilterAction(link);
                    } else location.href = link;
                })
            });

            var currentElements = this.element.find('.filter-current a, .filter-actions a');
            currentElements.each(function (index) {
                var el = $(this),
                    link = self.checkUrl(el.prop('href'));
                if (!link) {
                    return;
                }

                el.bind('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if (isAjax) {
                        submitFilterAction(link);
                    } else {
                        location.href = link;
                    }
                });
            });

            var optionElements = this.element.find('.filter-options a');
            optionElements.each(function (index) {
                var el = $(this),
                    link = self.checkUrl(el.prop('href'));
                if (!link) {
                    return;
                }

                el.bind('click', function (e) {
                    if (el.hasClass('swatch-option-link-layered')) {
                        self.selectSwatchOption(el);
                    } else {
                        var checkboxEl = el.siblings(self.options.checkboxEl);
                        checkboxEl.prop('checked', !checkboxEl.prop('checked'));
                    }

                    e.stopPropagation();
                    e.preventDefault();
                    self.ajaxSubmit(link);
                });

                var checkbox = el.siblings(self.options.checkboxEl);
                checkbox.bind('click', function (e) {
                    e.stopPropagation();
                    self.ajaxSubmit(link);
                });
            });

            var swatchElements = this.element.find('.swatch-attribute');
            swatchElements.each(function (index) {
                var el = $(this);
                var attCode = el.attr('attribute-code');
                if (attCode) {
                    if (self.options.params.hasOwnProperty(attCode)) {
                        var attValues = self.options.params[attCode].split(",");
                        var swatchOptions = el.find('.swatch-option');
                        swatchOptions.each(function (option) {
                            var elOption = $(this);
                            if ($.inArray(elOption.attr('option-id'), attValues) !== -1) {
                                elOption.addClass('selected');
                            }
                        });
                    }
                }
            });
            if(typeof enable_quickview != 'undefined' && enable_quickview == true) {
                requirejs(['jquery', 'weltpixel_quickview' ],
                    function($, quickview) {
                        $('.weltpixel-quickview').off('click').on('click', function() {
                            var prodUrl = $(this).attr('data-quickview-url');
                            if (prodUrl.length) {
                                quickview.displayContent(prodUrl);
                            }
                        });
                    });
            }
            window.setTimeout(function(){
              $( '.product-item-info .effect-bhesfd' ).each( function() {
                  var $item = $( this ),
                      $detail = $item.find( '.product-item-details .product-item-inner' ),
                      height = $item.height() + $detail.height() + 32;
                  $item.find( '>.content-shadow' ).height( height );
                  $( window ).on( 'resize', function() {
                      $detail = $item.find( '.product-item-details .product-item-inner' );
                      height = $item.height() + $detail.height() + 32;
                      $item.find('>.content-shadow').height( height );
                  } );
              });
            }, 500);
            $(".products-grid .weltpixel-quickview").each(function(){
              $(this).parent().parent().addClass('has-quickview');
              if($(this).parents('.product-type-advanced').find(".product-item-photo.porto-tb-featured-image .icon-absolute").length > 0){
                $(this).appendTo($(this).parents('.product-type-advanced').find(".product-item-photo .porto-tb-featured-image .product-item-inner .product-item-actions"));
              }else{
                $(this).appendTo($(this).parent().parent().children(".product-item-photo"));
              }
            });
            $("#layer-product-list img.porto-lazyload:not(.porto-lazyload-loaded)").lazyload({effect:"fadeIn"});
            if ($('#layer-product-list .porto-lazyload:not(.porto-lazyload-loaded)').closest('.owl-carousel').length) {
                $('#layer-product-list .porto-lazyload:not(.porto-lazyload-loaded)').closest('.owl-carousel').on('changed.owl.carousel', function() {
                    $(this).find('.porto-lazyload:not(.porto-lazyload-loaded)').trigger('appear');
                });
            }
            if(isAjax) {
                self.inFinite();
            }else{
                $('.infinite-loader').hide();
            }
        },

        selectSwatchOption: function (el) {
            var childEl = el.find('.swatch-option');
            if (childEl.hasClass('selected')) {
                childEl.removeClass('selected');
            } else {
                childEl.addClass('selected');
            }
        },

        initSlider: function () {
            var self = this,
                slider = this.options.slider;

            for (var code in slider) {
                if (slider.hasOwnProperty(code)) {
                    var sliderConfig = slider[code],
                        sliderElement = self.element.find(this.options.sliderElementPrefix + code),
                        priceFormat = sliderConfig.hasOwnProperty('priceFormat') ? JSON.parse(sliderConfig.priceFormat) : null;

                    if (sliderElement.length) {
                        sliderElement.slider({
                            range: true,
                            min: sliderConfig.minValue,
                            max: sliderConfig.maxValue,
                            step: 0.01,
                            values: [sliderConfig.selectedFrom, sliderConfig.selectedTo],
                            slide: function (event, ui) {
                                self.displaySliderText(code, ui.values[0], ui.values[1], priceFormat);
                            },
                            change: function (event, ui) {
                                self.ajaxSubmit(self.getSliderUrl(sliderConfig.ajaxUrl, ui.values[0], ui.values[1]));
                            }
                        });
                    }
                    self.displaySliderText(code, sliderConfig.selectedFrom, sliderConfig.selectedTo, priceFormat);
                }
            }
        },

        displaySliderText: function (code, from, to, format) {
            var textElement = this.element.find(this.options.sliderTextElementPrefix + code);
            if (textElement.length) {
                if (format !== null) {
                    from = this.formatPrice(from, format);
                    to = this.formatPrice(to, format);
                }

                textElement.html(from + ' - ' + to);
            }
        },

        getSliderUrl: function (url, from, to) {
            return url.replace('from-to', from + '-' + to);
        },

        formatPrice: function (value, format) {
            return ultil.formatPrice(value, format);
        },

        ajaxSubmit: function (submitUrl) {
            var isAjax = this.options.isAjax;
            this.element.find(this.options.mobileShopbyElement).trigger('click'); 
            if (isAjax) {
                return submitFilterAction(submitUrl);
            }
            location.href = submitUrl;
        },

        checkUrl: function (url) {
            var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

            return regex.test(url) ? url : null;
        },

        //Handling 'add to wishlist' & 'add to compare' event
        initWishlistCompare: function () {
            var isAjax = this.options.isAjax;
            var isCustomerLoggedIn = this.options.isCustomerLoggedIn,
                elClass = 'a.action.tocompare' + (isCustomerLoggedIn ? ',a.action.towishlist' : '');
            $(elClass).each(function () {
                var el = $(this);
                if (isAjax){
                    $(el).bind('click', function (e) {
                        var dataPost = $(el).data('post'),
                            formKey = $('input[name="form_key"]').val(), method = 'post';
                        if (formKey) {
                            dataPost.data.form_key = formKey;
                        }

                        var paramData = $.param(dataPost.data),
                            url = dataPost.action + (paramData.length ? '?' + paramData : '');

                        e.stopPropagation();
                        e.preventDefault();

                        if (el.hasClass('towishlist')) {
                            submitFilterAction(url, true, method);
                        } else{
                            submitFilterAction(url, true, method);
                        }
                    });
                }
            })
        },

        //Selected attribute color after page load.
        selectedAttr: function () {
            var filterCurrent = $('.layered-filter-block-container .filter-current .items .item .filter-value');

            filterCurrent.each(function(){
                var el         = $(this),
                    colorLabel = el.html(),
                    swatchAttr  = $('.filter-options .filter-options-item .swatch-option-link-layered .swatch-option');

                swatchAttr.each(function(){
                    var elA = $(this);
                    if(elA.attr('data-option-label') === colorLabel && !elA.hasClass('selected')){
                        elA.addClass('selected');
                    }
                });
            });
        },

        renderCategoryTree: function () {
            var iconExpand = this.element.find('.filter-options .icon-expand');

            iconExpand.each(function () {
                var el = $(this);

                el.nextAll('ol').each(function() {
                    if($(this).find('input[checked]').length !== 0
                        && !$(this).prevAll('.icon-expand').hasClass('active')
                    ) {
                        $(this).show();
                        $(this).prevAll('.icon-expand').toggleClass('active');
                    }
                });

                el.bind('click', function (e) {
                    el.nextAll('ol').toggle();
                    el.toggleClass('active');
                    e.stopPropagation();
                });
            });
        }
    });

    return $.mageplaza.layer;
});
