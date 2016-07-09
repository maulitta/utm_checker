function runPrintResult(e) {
    if (e.keyCode == 13) {
        printResult()
    }
}

function printResult() {
    var itemClass = null;
    var messages = [];

    clearMessages();
    result = checkUtm();

    if (result.status === 'empty_fields') {
        message = 'Поле не должно быть пустым!';
        itemClass = 'alert';
        parentItemExpected = document.getElementById('expected_block');
        parentItemActual = document.getElementById('actual_block');

        if (result.expected_length == 0) {
            document.getElementById('expected_utm_field').setAttribute('alert-state', 'true');
            renderTextItems('span', parentItemExpected, message, 'alert', 'exp_alert');
        }

        if (result.actual_length == 0) {
            document.getElementById('actual_utm_field').setAttribute('alert-state', 'true');
            renderTextItems('span', parentItemActual, message, 'alert', 'act_alert');
        }

        return 
    }

    if (result.status === 'not_equal_length') {
        itemClass = 'failed';
        messages = ['UTM-метки содержат разное кол-во параметров!',
                    'Ожидаемое кол-во элементов: ' + result.expected_count,
                    'Фактическое кол-во элементаов: ' + result.actual_count
        ];

    } 
    if (result.status === false) {
        itemClass = 'failed';
        messages = ['UTM-метки не совпадают!',
                    'Ожидаемые элменеты: ' + result.expected_utms,
                    'Элементы, которые не найдены: ' + result.compare_result
        ];

    } 
    if (result.status === true) {
        itemClass = 'success';
        messages = ['UTM-метки полностью совпадают'];
    }

    var resultDiv = renderItem('div', itemClass, 'result', 'content-block');
    for (var i = 0; i < messages.length; i++) {
       renderTextItems('div', resultDiv, messages[i]);
    }
}


function checkUtm() {
   var utmExpected = document.getElementById('expected_utm_field').value;
   var utmActual = document.getElementById('actual_utm_field').value;
   var expectedUtms = utmExpected.split('&');
   var actualUtms = utmActual.split('&');

   if (utmExpected.length == 0 || utmActual.length == 0) {
        return {
            'status': 'empty_fields',
            'expected_length': utmExpected.length,
            'actual_length': utmActual.length
        }
   }

   if (!(expectedUtms.length === actualUtms.length)) {
        return {
            'status': 'not_equal_length',
            'expected_count': expectedUtms.length,
            'actual_count': actualUtms.length
        }
    }

    var compareResult = []; 
    for (var i = 0; i < expectedUtms.length; i++) {
        if (expectedUtms.includes(actualUtms[i])) continue;
        compareResult.push(actualUtms[i]);
    }

    if (compareResult.length === 0) {
        return {
            'status': true
        }
    }

    return {
        'status': false,
        'expected_utms': expectedUtms,
        'compare_result': compareResult
    }
}


function renderItem(item, itemClass, itemId, parentItemId) {
    var resultItem = document.createElement(item);
    resultItem.className = itemClass;
    resultItem.id = itemId;
    document.getElementById(parentItemId).appendChild(resultItem);
    return resultItem;
}


function renderTextItems(item, parentItem, message, itemClass, itemId) {
    var resultItem = document.createElement(item);
    resultItem.className = itemClass;
    resultItem.id = itemId;
    parentItem.appendChild(resultItem);
    resultItem.appendChild(document.createTextNode(message));
}


function clearMessages() {
    var resultDiv = document.getElementById('result');
    if (resultDiv) {
        document.getElementById('content-block').removeChild(resultDiv);
    }

    var expactedAlertMessage = document.getElementById('exp_alert');
    if (expactedAlertMessage) {
        document.getElementById('expected_block').removeChild(expactedAlertMessage);
    }

    var actualAlertMessage = document.getElementById('act_alert');
    if (actualAlertMessage) {
        document.getElementById('actual_block').removeChild(actualAlertMessage);
    }

    expected_utm_field = document.getElementById('expected_utm_field');
    if (expected_utm_field.getAttribute('alert-state') == 'true') {
        expected_utm_field.setAttribute('alert-state', 'false');
    }

    actual_utm_field = document.getElementById('actual_utm_field');
    if (actual_utm_field.getAttribute('alert-state') == 'true') {
        actual_utm_field.setAttribute('alert-state', 'false');
    }
}
