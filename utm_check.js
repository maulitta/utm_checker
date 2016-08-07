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
        parentItemExpected = document.getElementById('expected_block');
        parentItemActual = document.getElementById('actual_block');

        if (result.expected_length == 0) {
            renderAlert(parentItemExpected, 'expected_utm_field', 'alert_exp');
        }

        if (result.actual_length == 0) {
            renderAlert(parentItemActual, 'actual_utm_field', 'alert_act');
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
                    'Фактические элементы: ' + result.actual_utms,
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

function getFieldValue(fieldId) {
   var fieldValue = document.getElementById(fieldId).value;
   if (fieldValue.length == 0) {
        return []
   }
   var a = document.createElement('a');
   a.href = fieldValue;
   if (Boolean(a.search)) {
        return a.search.slice(1).split('&');
   }
   if (fieldValue.charAt(0) == '?') {
        fieldValue = fieldValue.slice(1);
   }
        return fieldValue.split('&');
}

function checkUtm() {
   var expectedUtms = getFieldValue('expected_utm_field');
   var actualUtms = getFieldValue('actual_utm_field');

   if (expectedUtms.length == 0 || actualUtms.length == 0) {
        return {
            'status': 'empty_fields',
            'expected_length': expectedUtms.length,
            'actual_length': actualUtms.length
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
        'actual_utms': actualUtms,
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

    var expactedAlertMessage = document.getElementById('alert_exp');
    if (expactedAlertMessage) {
        document.getElementById('expected_block').removeChild(expactedAlertMessage);
    }

    var actualAlertMessage = document.getElementById('alert_act');
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

function renderAlert(parentItem, inputId, alertId) {
    message = 'Поле не должно быть пустым!';
    itemClass = 'alert';
    document.getElementById(inputId).setAttribute('alert-state', 'true');
    renderTextItems('span', parentItem, message, itemClass, alertId);

}
