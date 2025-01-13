var langVar;
function getAllLanguageCode(preferID, default_lang){

    var getEnglishText = $('#'+preferID+default_lang).val();
      
    if(getEnglishText.trim() == "") {
      	$('#'+preferID+default_lang+'_error').show();
        $('#'+preferID+default_lang).focus();

        clearInterval(langVar);
        langVar = setTimeout(function() {
            $('#'+preferID+default_lang+'_error').hide();
        }, 5000);
      
      	return false;
    } else {
        showLoader();
        $('#'+preferID+default_lang+'_error').hide();

        var ajaxData = {
            'URL': 'ajax_get_all_language_translate.php',
            'AJAX_DATA': {'englishText':getEnglishText},
            'REQUEST_DATA_TYPE': 'json'
        };
        getDataFromAjaxCall(ajaxData, function(res) {

            if (res.action == "1") {
                var response = res.result;
                $.each(response,function(name, Value){
                    var key = name.split('_');
                    $('#'+preferID+key[1]).val(Value);
                });
                
                hideLoader();

                if (typeof general_label === 'function') {
                    general_label();
                }
            } else {
                
            }
        });
    }
}

function showLoader()
{
    $('#loaderIcon').show();
    $('body').css('overflow', 'hidden');
}

function hideLoader()
{
    $('#loaderIcon').hide();
    $('body').css('overflow', 'auto');
}

/*function setDefaultLangValue(field_name, default_lang) 
{
    $('#'+field_name+'Default').val($('#'+field_name+default_lang).val());
    if (typeof general_label === 'function') {
        general_label();
    }
}*/

function resetToOriginalValue(elem, field_name)
{
    $(elem).closest('.modal-content').find('[data-originalvalue]').each(function(){
        $(this).val($(this).data('originalvalue'));
    });

    
    /*console.log($('#'+field_name+'Default').data('originalvalue'));
    console.log($('#'+field_name+'Default'));
    console.log(field_name);*/
    $('#'+field_name+'Default').val($('#'+field_name+'Default').data('originalvalue'));
}