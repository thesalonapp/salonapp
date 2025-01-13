var newfieldId = '';
var typingTimer = '';
var newCallback = '';
var searchKeyword = "";
var selectedValue = false;
var previousValue = '';
var add_google_logo = 'No';
var Not_add_logo = 'No'
var latlongLoad = '';
// alert("Ajax_for_advance_strategy .js file");
$(document).ready(function () {
    if ("geolocation" in navigator) {
        //  navigator.geolocation.getCurrentPosition(show_location, show_error, {timeout:1000, enableHighAccuracy: true}); //position request
    } else {
        // console.log("Browser doesn't support geolocation!");
    }
    if (GetGeoCookie('GEO_LATITUDE') != "" && GetGeoCookie('GEO_LONGITUDE') != "") {
        latlongLoad = {
            lat: parseFloat(GetGeoCookie('GEO_LATITUDE')),
            lng: parseFloat(GetGeoCookie('GEO_LONGITUDE'))
        };
    } else if (DEFAULT_COUNTRY_CENTER_LATITUDE != "" && DEFAULT_COUNTRY_CENTER_LONGITUDE != "") {
        latlongLoad = {
            lat: parseFloat(DEFAULT_COUNTRY_CENTER_LATITUDE),
            lng: parseFloat(DEFAULT_COUNTRY_CENTER_LONGITUDE)
        };
    }

    //Success Callback
    function show_location(position) {
        latlongLoad = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
    }

    //Error Callback
    function show_error(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("Permission denied by user.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location position unavailable.");
                break;
            case error.TIMEOUT:
                alert("Request timeout.");
                break;
            case error.UNKNOWN_ERROR:
                alert("Unknown error.");
                break;
        }
    }
});
$(window).resize(function () {
    localStorage.setItem("session_token", "");
    $(".ui-autocomplete").hide();
    $(".progress-indeterminate").remove();
    $("#clearbutton").hide();
    $('.ui-autocomplete').hide();
    previousValue = '';
    return false;
});

function buildAutoCompleteURL(query_str, sess_lang, latitude, longitude) {
    if ((latitude == '' || longitude == '') && latlongLoad != '') {
        latitude = latlongLoad.lat;
        longitude = latlongLoad.lng;
    } else if (latitude == '' || longitude == '') {
        latitude = '0.0';
        longitude = '0.0';
    }
    var url = GOOGLE_API_REPLACEMENT_URL + "autocomplete";
    var query_str = query_str;
    var sessionvalue = localStorage.getItem("session_token");
    if (sessionvalue == '' || sessionvalue == null || sessionvalue == 'null') {
        var session_token = generateSessionToken();
    }
    //var data = {language_code: sess_lang,search_query: query_str,session_token: session_token, latitude:23.073892, longitude:72.5033506, max_latitude:23.073892, max_longitude:72.5033506, min_latitude:23.073892, min_longitude:72.5033506};
    var data = {
        language_code: sess_lang,
        search_query: query_str,
        session_token: sessionvalue,
        vReturnData: query_str,
        latitude: latitude,
        longitude: longitude,
        TSITE_DB: TSITE_DB
    };
    return {
        url: url,
        data: data
    };
    // return {
    // url,
    // data
    // };
}

function buildPlaceDetail(PlaceId, vServiceId) {
    var url = GOOGLE_API_REPLACEMENT_URL + "placedetails";
    var sessionvalue = localStorage.getItem("session_token");
    //alert(sessionvalue);
    if (sessionvalue == '' || sessionvalue == null || sessionvalue == 'null') {
        var session_token = generateSessionToken();
    }
    var data = {
        language_code: sess_lang,
        session_token: sessionvalue,
        place_id: PlaceId,
        TSITE_DB: TSITE_DB,
        vServiceAccountId: vServiceId
    };
    if (MAPS_API_REPLACEMENT_STRATEGY != "Advance") {
        url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=" + PlaceId + "&fields=formatted_address,name,geometry&key=" + GOOGLE_SEVER_GCM_API_KEY + "&libraries=places";
        data = "";
    }
    return {
        url: url,
        data: data
    };
}

function generateSessionToken() {
    var session_token = "Passenger_" + Math.floor(Math.random() * (99 - 10)) + "_" + Math.floor(Math.random() * (9999999999999 - 1000000000000));
    localStorage.setItem("session_token", session_token);
    setTimeout(function () {
        generateSessionToken();
    }, 180000); // 180000 for 3 minute (1000 ms = 1 sec)
    return session_token;
}

function getValue(fieldId) {
    return $.trim($('#' + fieldId).val());
}

function buildAutoCompleteLat(fieldId, e, MIN_CHAR_REQ_GOOGLE_AUTO_COMPLETE, sess_lang, latitude, longitude, callback) {
    
    if ($("#" + fieldId).data('autocomplete') || $("#" + fieldId).hasClass('ui-autocomplete-input')) {
        $("#" + fieldId).autocomplete("destroy");
        $("#" + fieldId).removeData('autocomplete');
    }
    if (((e.altKey || e.ctrlKey) && e.keyCode == 16) || (e.altKey || e.ctrlKey) || (e.keyCode == 20) || ((e.keyCode < 124) && (e.keyCode > 111))) {
        return false;
    } else {
        executeBuildAutoComplete(fieldId, e.keyCode, MIN_CHAR_REQ_GOOGLE_AUTO_COMPLETE, sess_lang, latitude, longitude, callback);
    }
}

function buildAutoComplete(fieldId, e, MIN_CHAR_REQ_GOOGLE_AUTO_COMPLETE, sess_lang, callback) {
    
    if ($("#" + fieldId).data('autocomplete') || $("#" + fieldId).hasClass('ui-autocomplete-input')) {
        $("#" + fieldId).autocomplete("destroy");
        $("#" + fieldId).removeData('autocomplete');
    }
    if (((e.altKey || e.ctrlKey) && e.keyCode == 16) || (e.altKey || e.ctrlKey) || (e.keyCode == 20) || ((e.keyCode < 124) && (e.keyCode > 111))) {
        return false;
    } else {
        executeBuildAutoComplete(fieldId, e.keyCode, MIN_CHAR_REQ_GOOGLE_AUTO_COMPLETE, sess_lang, '', '', callback);
    }
}

function executeBuildAutoComplete(fieldId, keyCode, MIN_CHAR_REQ_GOOGLE_AUTO_COMPLETE, sess_lang, latitude, longitude, callback) {
    newfieldId = fieldId;
    newCallback = callback;
    showClearButton();
    $("#" + newfieldId).on('focusin', function () {
        // showClearButton(); // commented 28-02-2020 because IE error
        if ($("#" + newfieldId).val() != '') {
            $("#clearbutton").show();
        }
    });
    if ((keyCode == 40) || (keyCode == 39) || (keyCode == 38) || (keyCode == 37) || (keyCode == 13) || (keyCode == 9) || (keyCode == 16) || (keyCode == 17) || (keyCode == 18) || (keyCode == 93) /*|| (searchKeyword != "" && getValue(fieldId) == searchKeyword)*/ || (getValue(fieldId).length < MIN_CHAR_REQ_GOOGLE_AUTO_COMPLETE)) {
        return false;
    }
    if (typingTimer) {
        clearTimeout(typingTimer);
    }
    typingTimer = setTimeout(function () {
        continueBuildAutoComplete(fieldId, keyCode, MIN_CHAR_REQ_GOOGLE_AUTO_COMPLETE, sess_lang, latitude, longitude);
    }, 500);
}

function showSpinner() {
    $("#clearbutton").hide();
    $(".progress-indeterminate").show();
}

function hideSpinner() {
    $(".progress-indeterminate").remove();
    showClearButton();
}

function hideSpinnerOnly() {
    $(".progress-indeterminate").remove();
}

function showClearButton() {
    if (getValue(newfieldId).length > 0 && $("#" + newfieldId).is(":focus")) {
        $("#clearbutton").show();
        $("#" + newfieldId).focus();
    } else {
        // $("#clearbutton").hide(); // NM commented 08/01/2020
    }
}

function createLoader() {
    var mywidth = $("#" + newfieldId).outerWidth();
    var mleft = $("#" + newfieldId).css('margin-left');
    var mborder = $("#" + newfieldId).css('border');
    var mbottom = $("#" + newfieldId).css('margin-bottom');
    var rightonly = $("#" + newfieldId).css('right');
    var bgcolor = $("#" + newfieldId).css('background-color');
    // rightonly = rightonly.replace('px','');
    mleft = mleft.replace('px', '');
    if ($("div").hasClass("progress-indeterminate") == false) {
        $("#" + newfieldId).after('<div class="progress progress-indeterminate"><div class="progress-bar progress-bar-striped indeterminate"></div></div>');
        totalWidth = '100%';
        if (newfieldId == "vServiceAddress") {
            totalWidth = '55.50%';
        }
        $(".progress-indeterminate").css({
            "height": '3px'
        });
        $('.progress-indeterminate').css("margin-left", mleft + 'px');
        $('.progress-indeterminate').css("bottom", mbottom);
        $('.progress-indeterminate').css("right", rightonly);
        $('.progress-indeterminate').css("z-index", "999999999");
        $('.progress-indeterminate').css("background-color", bgcolor + '!important');
        $(".progress-bar").css({
            "height": '3px'
        });
    }
}

function continueBuildAutoComplete(fieldId, keyCode, MIN_CHAR_REQ_GOOGLE_AUTO_COMPLETE, sess_lang, latitude, longitude) {
    $('.ui-autocomplete').hide(); // 22-01-2020 NM Added because suggestion box was not replace data every time.
    if (getValue(fieldId).length == 0) {
        localStorage.setItem("session_token", "");
        $("#suggestions").html('');
        $(".ui-helper-hidden-accessible").html('');
        $(".ui-autocomplete").hide();
        $(".ui-menu-item").remove();
        $(".progress-indeterminate").remove();
        $("#clearbutton").hide();
        $('.ui-autocomplete').hide();
        $('#hidden_' + fieldId).val('');
        previousValue = '';
        return false;
    }
    newfieldId = fieldId
    createLoader();
    
   
    
    if (MAPS_API_REPLACEMENT_STRATEGY == "Advance") {
        var dataItems = [];
        var suggestions = '';
        var add_google_logo = '';
        var query_str = getValue(fieldId);
        if (query_str.length > 0) {
            getDatafromApi(buildAutoCompleteURL(query_str.trim(), sess_lang, latitude, longitude), function (data_responses, return_data) {
                //  $('#ui-id-1').hide(); // 22-01-2020 NM Added because suggestion box was not replace data every time.
                if (data_responses.vServiceName == 'Google') {
                    var add_google_logo = 'Yes';
                } else {
                    var add_google_logo = 'No';
                }
                if (getValue(fieldId) == return_data) {
                    searchKeyword = return_data;
                    var listofautocomplete = $("#" + fieldId).autocomplete({
                        autoFocus: false,
                        minLength: 0,
                        delay: 700,
                        source: function (request, response) {
                            if (query_str.length > 0) {
                                if (data_responses.data && data_responses.data.length > 0) {
                                    var dataArr = [];
                                    var dataArrSugg = [];
                                    navigator.permissions && navigator.permissions.query({name: 'geolocation'}).then(function (PermissionStatus) {
                                        if (PermissionStatus.state == 'granted') {
                                        } else {
                                            dataArrSugg = [{
                                                label: "Click here to improve your Search Results. You may need to allow or adjust location Setting in your browser.",
                                                Permission:0,
                                                value: {
                                                    place_title:'<span class="advance-pac-click-hint">Click here</span> to improve your Search Results. You may need to allow or adjust location Setting in your browser.'
                                                }
                                            }];
                                        }
                                    });

                                    //for (let i = 0; i < data_responses.data.length; i++) {
                                    for (var i = 0; i < data_responses.data.length; i++) {
                                        if (!dataArr[i]) {
                                            dataArr[i] = {};
                                        }
                                        data_responses.data[i]['vServiceName'] = data_responses.vServiceName ? data_responses.vServiceName : '';
                                        data_responses.data[i]['vServiceId'] = data_responses.vServiceId ? data_responses.vServiceId : '';
                                        dataArr[i]['label'] = data_responses.data[i]['address'];
                                        dataArr[i]['value'] = data_responses.data[i];
                                    }
                                    // data_responses.data = []; //NM Added on 08/01/2020
                                 
                                    setTimeout(function () {
                                        if(dataArrSugg[0]) {
                                            dataArr = [dataArrSugg[0], ...dataArr];
                                            
                                        }
                                        response(dataArr);
                                    }, 500);

                                } else {
                                    var result = [{
                                        label: "No result found",
                                        value: "-1"
                                    }];
                                    response(result);
                                    hideSpinner();
                                    data_responses.data = [];
                                }
                            } else {
                                hideSpinnerOnly();
                                return false;
                            }
                        },
                        focus: function (event, ui) {
                            event.preventDefault();
                        },
                        select: function (event, ui) {

                            if(ui.item.Permission == 0){
                                fetchLocation();
                                set_lat_long_values(ui.item.value);
                                hideSpinnerOnly();
                                return false;

                            }else if (ui.item.label != 'No result found') {

                                var background = $("#" + newfieldId).css('background-color');
                                var color = $("#" + newfieldId).css('color');
                                $("#" + fieldId).prop('disabled', true);
                                $("#" + fieldId).css('color', color);
                                $("#" + fieldId).css('background-color', background);
                                event.preventDefault();
                                set_lat_long_values(ui.item.value);
                                selectedValue = "true";
                            } else {


                                var previousValue = $('#hidden_' + fieldId).val();
                                $('#' + fieldId).val(previousValue);
                                hideSpinnerOnly();
                                return false;
                            }
                        },
                        open: function (event, ui) {
                            var previousValue = $('#hidden_' + fieldId).val();
                            if (getValue(fieldId).length < 1) {
                                $('#hidden_' + fieldId).val('');
                                previousValue = '';
                                $("#" + fieldId).autocomplete("close");
                                hideSpinner();
                                event.preventDefault();
                            }
                            if ($('#' + fieldId).is(':focus')) {
                                $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                                hideSpinner();
                            } else {
                                var previousValue = $('#hidden_' + fieldId).val();
                                $('#' + fieldId).val(previousValue);
                                $("#" + fieldId).autocomplete("close");
                                hideSpinner();
                            }
                            if (data_responses.data && data_responses.data.length > 0) {
                                if (add_google_logo == "Yes" && Not_add_logo != "Yes") {
                                    $(".ui-autocomplete").append("<div class='advance-pac-parent-new'><span class='advance-container-google-logo'><img src='https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3.png'></span></div>");
                                    $(".advance-pac-parent-new").css({
                                        "position": "sticky",
                                        "top": "10px",
                                        "bottom": "0",
                                        "margin-top": "0"
                                    });
                                    $(".advance-pac-parent-new img").css({
                                        "padding": "5px"
                                    });
                                }
                            }
                            Not_add_logo = "No";

                            navigator.permissions && navigator.permissions.query({name: 'geolocation'}).then(function (PermissionStatus) {
                                if (PermissionStatus.state != 'granted') {
                                    $('.ui-autocomplete').css('max-height', '265px');
                                } else {
                                    $('.ui-autocomplete').css('max-height', '200px');
                                }
                            });
                        },
                        close: function (event, ui) {
                            var previousValue = $('#hidden_' + fieldId).val();
                            $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                            if (selectedValue == "true") {
                                selectedValue = "false";
                                $("#clearbutton").hide();
                                event.preventDefault();
                            } else {
                                if ($('#' + fieldId).is(':focus')) {
                                    $("#clearbutton").hide();
                                    previousValue = $('#hidden_' + fieldId).val();
                                    $("#" + fieldId).val(previousValue);
                                    $('#clearbutton').hide();
                                    hideSpinner();
                                    event.preventDefault();
                                } else {
                                    $("#clearbutton").hide();
                                    $('#clearbutton').hide();
                                    event.preventDefault();
                                }
                            }
                        },
                        change: function (event, ui) {
                            $("#clearbutton").hide();
                            previousValue = $('#hidden_' + fieldId).val();
                            $("#" + fieldId).val(previousValue);
                        }
                    }).data("ui-autocomplete")._renderItem = function (ul, item) {
                        var inner_html = '';
                        
                        var place_title = item.value.place_sub_title;
                        var place_sub_title = '';
                        if (data_responses.data && data_responses.data.length > 0) {
                            if (item.value.place_title != '' && item.value.place_title != 'undefined' && item.value.place_title != null) {
                                var place_title = item.value.place_title;
                                if (item.value.place_sub_title) {
                                    place_sub_title = '<span>' + item.value.place_sub_title + '</span>';
                                }
                            }

                            if(item.hasOwnProperty('Permission')) {
                                var inner_html = '<div class="advance-pac-item advance-pac-improve-result"><span class="advance-pac-icon-marker"></span><span class="advance-pac-item-query advance-pac-item-improve-result"><span class="advance-pac-matched">' + place_title + '&nbsp;</span>' + place_sub_title + '</span></div>';    
                            } else {
                                var inner_html = '<div class="advance-pac-item"><span class="advance-pac-icon advance-pac-icon-marker"></span><span class="advance-pac-item-query"><span class="advance-pac-matched">' + place_title + '&nbsp;</span>' + place_sub_title + '</span></div>';    
                            }                            
                        } else {
                            var place_title = "No result found";
                            var place_sub_title = " ";
                            var inner_html = '<div class="advance-pac-item"><span class="advance-pac-item-query">&nbsp;' + ' ' + place_title + '&nbsp;</span></div>';
                        }
                        return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
                    };
                    $("#" + fieldId).trigger('keydown');
                    $('.ui-autocomplete').css({
                        "max-width": ($("#" + fieldId).outerWidth(true) + "px"), "z-index": "999999999999 !important"
                    });
                } else {
                    return false;
                }
            });
        }
    } else {
        var from = document.getElementById(fieldId);
        var displaySuggestions = function (predictions, status) {
            // if (status != google.maps.places.PlacesServiceStatus.OK) {
            // return;
            // } //(24-02-2020)NM commented because need no result found message
            $("#" + fieldId).autocomplete({
                autoFocus: false,
                minLength: 0,
                delay: 700,
                source: function (request, response) {
                    var dataArr = [];
                    if (predictions) {
                        for (var i = 0; i < (predictions).length; i++) {
                            if (!dataArr[i]) {
                                dataArr[i] = {};
                            }
                            dataArr[i]['label'] = predictions[i].description;
                            dataArr[i]['value'] = predictions[i];
                            if (i == predictions.length - 1) {
                                dataArr[i]['IS_LAST_POSITION'] = 'Yes';
                            } else {
                                dataArr[i]['IS_LAST_POSITION'] = 'No';
                            }
                        }
                        predictions = [];
                        response(dataArr);
                    } else {
                        var result = [{
                            label: "No result found",
                        }];
                        response(result);
                        hideSpinnerOnly();
                    }
                },
                focus: function (event, ui) {
                    event.preventDefault();
                },
                select: function (event, ui) {
                    if (ui.item.label != 'No result found') {
                        var background = $("#" + newfieldId).css('background-color');
                        var color = $("#" + newfieldId).css('color');
                        $("#" + fieldId).prop('disabled', true);
                        $("#" + fieldId).css('color', color);
                        $("#" + fieldId).css('background-color', background);
                        event.preventDefault();
                        selectedValue = "true";
                        set_lat_long_values(ui.item.value);
                    } else {
                        var previousValue = $('#hidden_' + fieldId).val();
                        $('#' + fieldId).val(previousValue);
                        hideSpinnerOnly();
                        return false;
                    }
                },
                open: function (event, ui) {
                    var previousValue = $('#hidden_' + fieldId).val();
                    if (getValue(fieldId).length < 1) {
                        $('#hidden_' + fieldId).val('');
                        previousValue = '';
                        $("#" + fieldId).autocomplete("close");
                        hideSpinner();
                        event.preventDefault();
                    }
                    if ($('#' + fieldId).is(':focus')) {
                        event.preventDefault();
                        $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                        hideSpinner();
                        // return;
                    } else {
                        $("#" + fieldId).val(previousValue);
                        $("#" + fieldId).autocomplete("close");
                        hideSpinner();
                    }
                    if ((predictions) && (Not_add_logo != "Yes")) {
                        $(".ui-autocomplete").append("<div class='advance-pac-parent-new'><span class='advance-container-google-logo'><img src='https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3.png'></span></div>");
                        $(".advance-pac-parent-new").css({
                            "position": "sticky",
                            "top": "10px",
                            "bottom": "0",
                            "margin-top": "0"
                        });
                        $(".advance-pac-parent-new img").css({
                            "padding": "5px"
                        });
                    }
                    Not_add_logo = "No";
                },
                close: function (event, ui) {
                    var previousValue = $('#hidden_' + fieldId).val();
                    $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                    if (selectedValue == "true") {
                        selectedValue = "false";
                        $('#clearbutton').hide();
                    } else {
                        if ($('#' + fieldId).is(':focus')) {
                            $("#clearbutton").hide();
                            previousValue = $('#hidden_' + fieldId).val();
                            $("#" + fieldId).val(previousValue);
                            $('#clearbutton').hide();
                            hideSpinner();
                            event.preventDefault();
                        } else {
                            $("#clearbutton").hide();
                            $('#clearbutton').hide();
                            event.preventDefault();
                        }
                    }
                },
                change: function (event, ui) {
                    var previousValue = $('#hidden_' + fieldId).val();
                    if (ui.item) {
                        $("#" + fieldId).val(previousValue);
                    } else {
                        $("#" + fieldId).val(previousValue);
                    }
                    // previousValue = '';
                }
            }).data("ui-autocomplete")._renderItem = function (ul, item) {
                if (predictions) {
                    var addclass = '';
                    if (item.IS_LAST_POSITION == "Yes") {
                        addclass = " last_position";
                    }
                    var place_title = item.value.structured_formatting.main_text;
                    var place_sub_title = '';
                    if (item.value.structured_formatting.main_text != '' && item.value.structured_formatting.main_text != 'undefined' && item.value.structured_formatting.main_text != null) {
                        var place_title = item.value.structured_formatting.main_text;
                        if (item.value.structured_formatting.secondary_text) {
                            place_sub_title = '<span>' + item.value.structured_formatting.secondary_text + '</span>';
                        }
                    }
                    var inner_html = '<div class="advance-pac-item ' + addclass + '"  ><span class="advance-pac-icon advance-pac-icon-marker"></span><span class="advance-pac-item-query"><span class="advance-pac-matched">' + place_title + '&nbsp;</span>' + place_sub_title + '</span></div>';
                } else {
                    var place_title = "No result found";
                    var place_sub_title = " ";
                    var inner_html = '<div class="advance-pac-item"><span class="advance-pac-item-query">&nbsp;' + ' ' + place_title + '&nbsp;</span></div>';
                }
                return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
            };
            $("#" + fieldId).trigger('keydown');
            $('.ui-autocomplete').css({
                "max-width": ($("#" + fieldId).outerWidth(true) + "px"), "z-index": "999999999999 !important"
            });
        };
        var loc_latitude = 0.0;
        var loc_longitude = 0.0;
        if (latitude != "" && longitude != "" && latitude != "0.0" && longitude != "0.0") {
            loc_latitude = parseFloat(latitude);
            loc_longitude = parseFloat(longitude);
        }
        var latlong_opt = new google.maps.LatLng({
            lat: loc_latitude,
            lng: loc_longitude
        });
        if (latlongLoad != '' && (loc_latitude == 0.0 || loc_longitude == 0.0)) {
            latlong_opt = new google.maps.LatLng({
                lat: latlongLoad.lat,
                lng: latlongLoad.lng
            });
        }
        var sessionvalue = localStorage.getItem("session_token");
        if (sessionvalue == '' || sessionvalue == null || sessionvalue == 'null') {
            var sessionvalue = generateSessionToken();
        }
        var service = new google.maps.places.AutocompleteService();
        service.getQueryPredictions({
            input: getValue(fieldId),
            location: latlong_opt,
            radius: 2000000,
            sessionToken: sessionvalue
        }, displaySuggestions);
    }
}

function set_lat_long_values(data_response) {
    createLoader();
    if (data_response.PlaceId || data_response.place_id) {
        if (data_response.PlaceId) {
            var PlaceID = data_response.PlaceId;
        } else if (data_response.place_id) {
            var PlaceID = data_response.place_id;
        }
        // get details from Google API using Place ID
        getDatafromApi(buildPlaceDetail(PlaceID, data_response.vServiceId ? data_response.vServiceId : ''), function (data_responses, vReturnData) {
            var latitude = "";
            var lngitude = "";
            var address = "";
            var address_components = [];
			var service_name = "";
            if (MAPS_API_REPLACEMENT_STRATEGY != 'Advance') {
                if ((data_responses != false) && (typeof(data_responses) != 'undefined') && (data_responses != 'undefined') && (data_responses != undefined)) {
                    latitude = data_responses.result.geometry.location.lat;
                    lngitude = data_responses.result.geometry.location.lng;
                    address = data_responses.result.formatted_address;
                    address_components = data_responses.result.address_components;
					service_name = data_responses.result.vServiceName;
                    if (data_response.hasOwnProperty('description')) {
                        address = data_response.description;
                    }
                    data_responses = [];
                } else {
                    $("#" + newfieldId).autocomplete = '';
                    $("#" + newfieldId).autocomplete({
                        autoFocus: true,
                        source: function (request, response) {
                            var result = [{
                                label: "No result found",
                                value: ""
                            }];
                            response(result);
                        },
                        select: function (event, ui) {
                            event.preventDefault();
                        },
                    }).data("ui-autocomplete")._renderItem = function (ul, item) {
                        var inner_html_nofound = '<div class="advance-pac-item"><span class="advance-pac-item-query">&nbsp;' + 'No result found &nbsp;</span></div>';
                        return $("<li></li>").data("item.autocomplete", item).append(inner_html_nofound).appendTo(ul);
                    };
                    $("#" + newfieldId).prop('disabled', false);
                    $("#" + newfieldId).trigger('keydown');
                    Not_add_logo = "Yes";
                    return false;
                }
            } else {
                if (data_responses.address != '' && data_responses.address != undefined && typeof(data_responses.address) != 'undefined') {
                    latitude = data_responses.latitude;
                    lngitude = data_responses.longitude;
                    address = data_responses.address;
                    address_components = data_responses.address_components;
					service_name = data_responses.vServiceName;
                    if (data_response.hasOwnProperty('description')) {
                        address = data_response.description;
                    }
                    data_responses = [];
                } else {
                    $("#" + newfieldId).autocomplete = '';
                    $("#" + newfieldId).autocomplete({
                        autoFocus: true,
                        source: function (request, response) {
                            var result = [{
                                label: "No result found",
                                value: ""
                            }];
                            response(result);
                        },
                        select: function (event, ui) {
                            event.preventDefault();
                        },
                    }).data("ui-autocomplete")._renderItem = function (ul, item) {
                        var inner_html_nofound = '<div class="advance-pac-item"><span class="advance-pac-item-query">&nbsp;' + 'No result found &nbsp;</span></div>';
                        return $("<li></li>").data("item.autocomplete", item).append(inner_html_nofound).appendTo(ul);
                    };
                    $("#" + newfieldId).prop('disabled', false);
                    $("#" + newfieldId).trigger('keydown');
                    $("#" + newfieldId).trigger('keyup');
                    Not_add_logo = "Yes";
                    return false;
                }
            }
            place_lat_log_value(address, latitude, lngitude);
            if (newCallback != '' && newCallback != 'undefined' && newCallback != undefined) {
				newCallback(latitude, lngitude, address, address_components, service_name);
            }
        });
    } else {
        place_lat_log_value(data_response.address, data_response.latitude, data_response.longitude);
        if (newCallback != '' && newCallback != 'undefined' && newCallback != undefined) {
			newCallback(data_response.latitude, data_response.longitude, data_response.address, data_response.address_components, data_response.vServiceName);
        }
    }
}

function place_lat_log_value(address, latitude, longitude) {
    $("#" + newfieldId).prop('disabled', false);
    $("#" + newfieldId).val(address);
    var fieldvalue = $('#' + newfieldId).val();
    var hiddenfield = $('#hidden_' + newfieldId).val();
    if (hiddenfield == undefined || hiddenfield == 'undefined') {
        $('<input>').attr({
            type: 'hidden',
            id: 'hidden_' + newfieldId,
            value: fieldvalue
        }).appendTo('body');
        previousValue = fieldvalue;
    } else {
        $('#hidden_' + newfieldId).val(fieldvalue);
        previousValue = fieldvalue;
    }
    if (newfieldId == "from" || newfieldId == "to") {
        $("#" + newfieldId + "_lat_long").val('(' + latitude + ', ' + longitude + ')');
        $("#" + newfieldId + "_lat").val(latitude);
        $("#" + newfieldId + "_long").val(longitude);
        $("#" + newfieldId + "_lat_long_frm").val('(' + latitude + ', ' + longitude + ')');
        $("#" + newfieldId + "_lat_frm").val(latitude);
        $("#" + newfieldId + "_long_frm").val(longitude);
    } else {
        $("#from_lat_long").val('(' + latitude + ', ' + longitude + ')');
        $("#from_lat").val(latitude);
        $("#from_long").val(longitude);
    } // ===========
    $("#tLongitude").val(longitude);
    $("#tLatitude").val(latitude);
    $("#cLatitude").val(latitude);
    $("#cLongitude").val(longitude);
    $("#from_lat_frm").val(latitude);
    $("#from_long_frm").val(longitude);
    $("#from_lat_long_frm").val('(' + latitude + ', ' + longitude + ')');
    $("#" + newfieldId).focus();
    $('.ui-autocomplete').hide();
    hideSpinnerOnly();
}

function SetGeoCookie(cname, cvalue, exdays) {
    "use strict";
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function GetGeoCookie(cname) {
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