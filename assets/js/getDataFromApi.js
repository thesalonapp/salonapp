function getDataFromApi(data, responseHandler, requestDataType, requestType)
{
	if(requestType != ''){
		requestType = "POST";
	}
	var urlParams = new URLSearchParams(data);
	var async_request_param = urlParams.get('async_request');
	var async_request = true;
	if(async_request_param)
	{
		async_request = async_request_param;
	}
	$.ajax({
		type: requestType,
		url: WEBSERVICE_API_FILE_NAME,
		data: data,
		async: async_request,
		headers: {'Authorization': 'Bearer ' + SOrToKnDoE()},
		success: function (response) {
			return responseHandler(response);
		},
		error: function (xhr,status,error) {
			return "";
		}
	});
}

function UploadDataToServer(data, responseHandler)
{
	$.ajax({
		type: 'POST',
		url: WEBSERVICE_API_FILE_NAME,
		data: data,
		dataType: 'json',
		contentType: false,
        processData: false,
        headers: {'Authorization': 'Bearer ' + SOrToKnDoE()},
		success: function (response) {
			return responseHandler(response);
		},
		error: function (xhr,status,error) {
			return "";
		}
	});
}


function getDataFromAjaxCall(data, responseHandler)
{
	var ajaxOptions = {};
	ajaxOptions.type = 'POST';
	if(data.hasOwnProperty('REQUEST_TYPE')) {
		ajaxOptions.type = data.REQUEST_TYPE;
	}
	ajaxOptions.url = data.URL;
	ajaxOptions.data = data.AJAX_DATA;
	if(data.hasOwnProperty('REQUEST_DATA_TYPE')) {
		ajaxOptions.dataType = data.REQUEST_DATA_TYPE;
	}
	if(data.hasOwnProperty('REQUEST_ASYNC')) {
		ajaxOptions.async = data.REQUEST_ASYNC;
	}
	if(data.hasOwnProperty('REQUEST_CACHE')) {
		ajaxOptions.cache = data.REQUEST_CACHE;
	}
	if(data.hasOwnProperty('REQUEST_CONTENT_TYPE')) {
		ajaxOptions.contentType = data.REQUEST_CONTENT_TYPE;
	}
	if(data.hasOwnProperty('REQUEST_PROCESS_DATA')) {
		ajaxOptions.processData = data.REQUEST_PROCESS_DATA;
	}

	if(ajaxOptions.type == "POST") {
		ajaxOptions.headers = {'Authorization': 'Bearer ' + SOrToKnDoE()}
	}


	ajaxOptions.success = function (response) {
		var result = {
			'action': "1",
			'result': response
		};
		
		return responseHandler(result);
	};

	ajaxOptions.error = function (xhr,status,error) {
		var result = {
			'action': "0",
			'result': error
		};
		return responseHandler(result);
	};

	setTimeout(function() {
		var ajaxRequest = $.ajax(ajaxOptions);
		return ajaxRequest;
	}, 500);	
}

$(document).ready(function() {
	AOT6KSNzku();
});

var t0k, w1TsT0KbLx;

function OBlXC2syjR() {
    $.ajax({
        type: 'POST',
        url: window.location.origin + SITE_PANEL_PATH + 'RoTOQSk6OH_XXXXXXXX.php',
        data: 'cbIcuKhGdR_XXXXXXXX=Yes',
        success: function (data_response) {
            w1TsT0KbLx = JSON.parse(GetSysCookie('amifnctgk3hhsec'));
        }
    });
}

function SOrToKnDoE() {
	w1TsT0KbLx = JSON.parse(GetSysCookie('amifnctgk3hhsec'));

    t0k = w1TsT0KbLx[0];
    w1TsT0KbLx.shift();
	
    return t0k;
}

function mO4u1yc3dx(request) {
    request.setRequestHeader('Authorization', 'Bearer ' + SOrToKnDoE());
}

function ShpSq6fAm7(form) {
	$('<input>').attr({
	    type: 'hidden',
	    name: '_csrf_tok',
	    value: SOrToKnDoE()
	}).appendTo(form);
}

function AOT6KSNzku() {
	if($("form").length > 0) {
		$("form").each(function() {
			$(this).on('submit', function() {
				$('<input>').attr({
				    type: 'hidden',
				    name: '_csrf_tok',
				    value: SOrToKnDoE()
				}).appendTo(this);
			});			
		});
	}
}

function SetSysCookie(cname, cvalue, exdays) {
    "use strict";
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function GetSysCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}