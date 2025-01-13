$(document).ready(function () {
    /*-----------------------------------------------------
     // country code auto width Adjust JS
 --------------------------------------------------------*/
    function EmptyValue() {
        if ($('div').hasClass('countryPhoneSelectChoice')) {
            if ($('.contact_number').val()) {
                var $contact_number = $('.contact_number');
                $contact_number.addClass('phoneinput');
            } else {
                $('.contact_number').removeClass('phoneinput');
            }
        }
    }
    
    EmptyValue();
    setInterval(() => {
        $('.form-group').each(function () {
            var $countryPhoneSelectWrapper = $(this).find('.countryPhoneSelectWrapper');
            var $phoneinput = $(this).find('.phoneinput');
            var $emailinput = $(this).find('.emailinput');
            var $hotelhide = $(this).find('.hotelhide');
            var $html = $('html');
            var countrycodeWidth = $(this).find('.countryPhoneSelectChoice').innerWidth();
            if (countrycodeWidth > 110) {
                $countryPhoneSelectWrapper.css('width', `${countrycodeWidth + 10}px`);
                var countryPhoneSelectWrapperWidth = $countryPhoneSelectWrapper.innerWidth();
                $phoneinput.css('paddingLeft', `${countryPhoneSelectWrapperWidth + 8}px`);
                if ($countryPhoneSelectWrapper.is(':hidden')) {
                    $emailinput.css({
                        paddingLeft: '16px', paddingRight: '16px'
                    });
                }
                if ($html.attr('dir') === 'rtl') {
                    $phoneinput.css({
                        paddingRight: `${countryPhoneSelectWrapperWidth + 20}px`, paddingLeft: '16px'
                    });
                }
            } else {
                $countryPhoneSelectWrapper.css('width', '110px'); // Corrected to use string value
                $phoneinput.css('padding', ''); // Reset padding
                $emailinput.css('padding', ''); // Reset padding
                $hotelhide.css('padding', ''); // Reset padding
            }
            EmptyValue();
        });
    }, 10);
    if ($("form[name='contactform'] .form-group").length > 0) {
        $("form[name='contactform'] .form-group").each(function (index) {
            $this = $(this).find('input');
            //console.log($this.val());
            if ($this.val() != "") {
                $this.closest('.form-group').addClass('floating');
            } else {
                $this.closest('.form-group').removeClass('floating');
            }
            if ($('input[name="vCode"]').length > 0 && $('input[name="vPhone"]').val().length > 0) {
                $this.closest('.form-group.phone-column').addClass('floating');
            } else {
                $this.closest('.form-group.phone-column').removeClass('floating');
            }
        })
    }
    
    
    /*------------------News letter-----------------*/
    
    
    //frmnewsletterActionset();
    function frmnewsletterActionset(){
        if ($("#frmnewsletter").length > 0)
        {
            var fromNewsLetterAction = $('form#frmnewsletter').attr('action');
            if(fromNewsLetterAction == ''){
                $('form#frmnewsletter').attr('action',tsite_url_base+'news_letter_action.php');
            }
        }
    }
    setTimeout (frmnewsletterActionset(), 2000);
    
    /*------------------News letter-----------------*/
    
    /*------------------language selection-----------------*/
    
    
    function change_lang_call() {
        change_lang_v2($("#lang_select").val());
    }
    
    function change_lang_v2(lang) {
        changelanguagecode_v2(lang , function (){
            if (window.location.protocol === "http:") {
                var httpReferer = window.location.href;
                window.location.href = 'common.php?lang=' + lang + '&HTTP_REFERER=' + encodeURIComponent(httpReferer);
            } else {
                window.location.href = 'common.php?lang=' + lang;
            }
        });
        
        
    }
    function changelanguagecode_v2(lang,callback){
        
        var ajaxData = {
            'URL': tsite_url_base+'ajax_fpass_action.php',
            'AJAX_DATA': {
                action: 'changeLangCode',
                langcode: lang
            },
            'REQUEST_DATA_TYPE': 'json'
        };
        getDataFromAjaxCall(ajaxData, function (response) {
            callback();
        });
    }
    
    $("#lang_select").removeAttr("onchange");
    $("#lang_select").change(change_lang_call);
    /*------------------language selection-----------------*/
});