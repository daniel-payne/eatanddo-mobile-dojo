/*global window, define, ertoc, window: true */
define([
  "ertoc/app", 
  "ertoc/data", 

  "dojo/dom",
  "dojo/dom-style",      
  "dijit/registry",
  "dojo/_base/array",
  "dojo/dom-class", 
  "dojox/mobile/ListItem",
  "dojo/query",
  "dojo/on",
  "dojo/date/locale"                                                                                    
  //"dojo/parser" 
  //"dojox/mobile/parser" 
], function (app, data, dom, style, registry, arrayManager, domClass, ListItem, query, on, locale) {
  //
  "use strict";

  //var weekDays     = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  //var mealTimes    = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];                                                   
  //var itemNumbers  = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
  //var nutrents     = ['Salt', 'Fibre', 'SaturatedFat', 'Fat', 'Sugar', 'Carbohydrate', 'Protein', 'Calories' ];
  //var measurements = ['BloodPressure', 'Weight'];
  
  var servingOptions = [
    { description: '¼',   value: 0.25, sufix: ''  },
    { description: '⅓',   value: 0.33, sufix: ''  },
    { description: '½',   value: 0.50, sufix: ''  },
    { description: '1',   value: 1.00, sufix: ''  },
    { description: '2',   value: 2.00, sufix: 's' },
    { description: '3',   value: 3.00, sufix: 's' } 
  ];
   
  window.app.display = {
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    formatFoodValue: function(value){ 

      if ( (value === '0.0') || (value === '0.00') ) {

        value = '<span class="Minor">Trace</span>';  
      }

      value = value.replace('-', '*'); 
      
      if (value === '') {

        value = '&nbsp;';
      } 
      
      return value;
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    formatMeasurementValue: function(value){ 
      
      if (value === '') {

        value = '&nbsp;';
      } 
      
      return value;
    },
//    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
//    formatBloodPressureValue: function(value){ 
//
//      value = value.replace('.0','/').replace('.','/');
//      
//      if (value === '') {
//
//        value = '&nbsp;';
//      } 
//      
//      return value;
//    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    resize: function () {

      window.app.trace('Window Width Resize : ' + window.innerWidth);

      if (window.innerWidth >= 1090)  {

        query('.Div-Header-Small-Screen').forEach(    function(node){ style.set(node, 'display', 'none'); });
        query('.Div-Header-Medium-Screen').forEach(   function(node){ style.set(node, 'display', 'none'); });
        query('.Div-Header-Large-Screen').forEach(    function(node){ style.set(node, 'display', '');     });

        query('.Div-Info-Data-Small-Screen').forEach( function(node){ style.set(node, 'display', 'none'); });
        query('.Div-Info-Data-Medium-Screen').forEach(function(node){ style.set(node, 'display', 'none'); });     
        query('.Div-Info-Data-Large-Screen').forEach( function(node){ style.set(node, 'display', '');     });     
      
      } else if (window.innerWidth >= 820)  {

        query('.Div-Header-Small-Screen').forEach(    function(node){ style.set(node, 'display', 'none'); });
        query('.Div-Header-Medium-Screen').forEach(   function(node){ style.set(node, 'display', '');     });
        query('.Div-Header-Large-Screen').forEach(    function(node){ style.set(node, 'display', 'none'); });

        query('.Div-Info-Data-Small-Screen').forEach( function(node){ style.set(node, 'display', 'none'); });
        query('.Div-Info-Data-Medium-Screen').forEach(function(node){ style.set(node, 'display', '');     });     
        query('.Div-Info-Data-Large-Screen').forEach( function(node){ style.set(node, 'display', 'none'); });   
 
      } else if (window.innerWidth >= 780)  {

        query('.Div-Header-Small-Screen').forEach(    function(node){ style.set(node, 'display', 'none'); });
        query('.Div-Header-Medium-Screen').forEach(   function(node){ style.set(node, 'display', 'none'); });
        query('.Div-Header-Large-Screen').forEach(    function(node){ style.set(node, 'display', ''); });

        query('.Div-Info-Data-Small-Screen').forEach( function(node){ style.set(node, 'display', 'none'); });
        query('.Div-Info-Data-Medium-Screen').forEach(function(node){ style.set(node, 'display', 'none'); });     
        query('.Div-Info-Data-Large-Screen').forEach( function(node){ style.set(node, 'display', '');     });     
      
      } else if (window.innerWidth >= 470)  {

        query('.Div-Header-Small-Screen').forEach(    function(node){ style.set(node, 'display', 'none'); });
        query('.Div-Header-Medium-Screen').forEach(   function(node){ style.set(node, 'display', '');     });
        query('.Div-Header-Large-Screen').forEach(    function(node){ style.set(node, 'display', 'none'); });

        query('.Div-Info-Data-Small-Screen').forEach( function(node){ style.set(node, 'display', 'none'); });
        query('.Div-Info-Data-Medium-Screen').forEach(function(node){ style.set(node, 'display', '');     });     
        query('.Div-Info-Data-Large-Screen').forEach( function(node){ style.set(node, 'display', 'none'); });     
      
      //} else if (window.innerWidth >= 480)  {
      } else {

        query('.Div-Header-Small-Screen').forEach(    function(node){ style.set(node, 'display', '');     });
        query('.Div-Header-Medium-Screen').forEach(   function(node){ style.set(node, 'display', 'none'); });
        query('.Div-Header-Large-Screen').forEach(    function(node){ style.set(node, 'display', 'none'); });

        query('.Div-Info-Data-Small-Screen').forEach( function(node){ style.set(node, 'display', '');     });
        query('.Div-Info-Data-Medium-Screen').forEach(function(node){ style.set(node, 'display', 'none'); });     
        query('.Div-Info-Data-Large-Screen').forEach( function(node){ style.set(node, 'display', 'none'); });     
     }

     query('.Div-Hide-WhenLarge').forEach( function(node){ 
       
       if (window.innerWidth >= app.tabletSize){
         style.set(node, 'display', 'none'); 
       } else {
         style.set(node, 'display', ''); 
       }
     }); 
 
     query('.Div-Hide-WhenSmall').forEach( function(node){ 
       
       if (window.innerWidth <= app.phoneSize){

         var target = registry.byId(node.id);

         if (target) {
           target.set('label', ''); 
         }
       } 
     }); 
   },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    clearAll: function () {

      window.app.display.clearWeekListing();
      window.app.display.clearDayListing();
      window.app.display.clearSearchPhrase();
      window.app.display.clearSearchListing();
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    destroyDescendants: function(id){

      var list = registry.byId(id);

      if (list) {
        
        arrayManager.forEach(list.getChildren(), function(child){
          
          if (child.clickHandler !== undefined) { 
            
            child.clickHandler.remove(); 

            child.clickHandler = undefined;
          }
        }); 

        list.destroyDescendants();
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    destroyInnerHTML: function(id){
      
      var target = dom.byId(id);
      
      if (target) {

         target.innerHTML = '';
       }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    destroyValue: function(id){
      
      var target = registry.byId(id);
      
      if (target) {

         target.set('value', '');
       }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    hideElement: function(id){
      
      var target = registry.byId(id);

      if (target) {

        style.set(target, 'display', 'none');
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    showElement: function(id){
      
      var target = registry.byId(id);

      if (target) {

        style.set(target, 'display', '');
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    showPopupMenu: function () {
      
      var target = dom.byId('menuPopup');
       
      if (target) {

        if ( style.get(target, 'display') === 'block') {

          app.display.hidePopupMenu();

        } else {

          style.set(target, 'display', '');
        }
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    hidePopupMenu: function () {
      
      var target = dom.byId('menuPopup');

      if (target) {

        style.set(target, 'display', 'none');
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    hideChangeTime: function(){

      var target;

      target = dom.byId('timePickerNewMeasurement');          if (target){ style.set(target, 'display', 'none'); }     
      target = dom.byId('labelNewMeasurementTime');           if (target){ style.set(target, 'display', '');     }     
      target = dom.byId('buttonNewMeasurementChangeTime');    if (target){ style.set(target, 'display', '');     }   
         
      target = dom.byId('timePickerUpdateMeasurement');       if (target){ style.set(target, 'display', 'none'); }     
      target = dom.byId('labelUpdateMeasurementTime');        if (target){ style.set(target, 'display', '');     }     
      target = dom.byId('buttonUpdateMeasurementChangeTime'); if (target){ style.set(target, 'display', '');     }   
         
          
      var now     = new Date();
      var hours   = now.getHours(); 
      var minutes = now.getMinutes(); 

      target = registry.byId('timePickerNewMeasurement');    if (target){ target.set('values', [hours,minutes]);      }
      target = registry.byId('timePickerUpdateMeasurement'); if (target){ target.set('values', [hours,minutes]);      }

      target = dom.byId('labelNewMeasurementTime');          if (target){ target.innerHTML = hours + ':' +  minutes;  }
      target = dom.byId('labelUpdateMeasurementTime');       if (target){ target.innerHTML = hours + ':' +  minutes;  }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    showChangeTime: function(){

      var target;

      target = dom.byId('timePickerNewMeasurement');          if (target){ style.set(target, 'display', '');     }     
      target = dom.byId('labelNewMeasurementTime');           if (target){ style.set(target, 'display', 'none'); }     
      target = dom.byId('buttonNewMeasurementChangeTime');    if (target){ style.set(target, 'display', 'none'); }     

      target = dom.byId('timePickerUpdateMeasurement');       if (target){ style.set(target, 'display', '');     }     
      target = dom.byId('labelUpdateMeasurementTime');        if (target){ style.set(target, 'display', 'none'); }     
      target = dom.byId('buttonUpdateMeasurementChangeTime'); if (target){ style.set(target, 'display', 'none'); }     
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    clearWeekListing: function() {

       app.display.destroyInnerHTML('spanFoodWeekName'       );
       app.display.destroyInnerHTML('spanMeasurementWeekName');

       app.display.destroyDescendants('listFoodEntrySummaries'       );
       app.display.destroyDescendants('listMeasurementEntrySummaries');

    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    clearDayListing: function() {

       app.display.destroyDescendants('listFoodEntries'       );
       app.display.destroyDescendants('listMeasurementEntries');

    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    clearSearchPhrase: function() {

      app.display.destroyValue('InputSearchTerm');
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    clearSearchListing: function() {

      app.display.destroyDescendants('listSearchMatches');
      
      app.display.hideElement('listSearchMatches');
      app.display.hideElement('buttonMoreSearchMatches');
    },
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    clearHistoryListing: function() {

      app.display.destroyDescendants('listHistoryEntries');

      app.display.hideElement('listHistoryEntries');
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    clearLog: function(){

      app.display.destroyDescendants('listDataLog');
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    connectError: function () {

      app.showDialog('DialogLoginError');
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    inputError: function (title, message, goToView) {

      dom.byId('divClientTitle').innerHTML    = title;
      dom.byId('divClientMessage').innerHTML  = message;

      app.showDialog('DialogClientMessage', goToView);
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    dataError: function () {

      window.alert('data Error: ' + data.latestError);
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    serverMessage: function () {

      dom.byId('divServerMessage').innerHTML =  data.latestMessage;

      app.showDialog('DialogServerMessage');
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    disableButtons: function () {

      domClass.add( 'buttonFoodNextWeek',  'mblButtonDisabled');
      domClass.add( 'buttonFoodPriorWeek', 'mblButtonDisabled');
      
      domClass.add( 'buttonMeasurementNextWeek',  'mblButtonDisabled');
      domClass.add( 'buttonMeasurementPriorWeek', 'mblButtonDisabled');
      
      domClass.add( 'buttonFoodTommorow',  'mblButtonDisabled');
      domClass.add( 'buttonFoodYesterday', 'mblButtonDisabled');
      
      domClass.add( 'buttonMeasurementTommorow',  'mblButtonDisabled');
      domClass.add( 'buttonMeasurementYesterday', 'mblButtonDisabled');
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    enableButtons: function () {

      domClass.remove( 'buttonFoodNextWeek',  'mblButtonDisabled');
      domClass.remove( 'buttonFoodPriorWeek', 'mblButtonDisabled');
      
      domClass.remove( 'buttonMeasurementNextWeek',  'mblButtonDisabled');
      domClass.remove( 'buttonMeasurementPriorWeek', 'mblButtonDisabled');
      
      domClass.remove( 'buttonFoodTommorow',  'mblButtonDisabled');
      domClass.remove( 'buttonFoodYesterday', 'mblButtonDisabled');
      
      domClass.remove( 'buttonMeasurementTommorow',  'mblButtonDisabled');
      domClass.remove( 'buttonMeasurementYesterday', 'mblButtonDisabled');
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    adjustValuePicker: function () {
       
      var currentUnit = this.get('value').toUpperCase();

      if (this.id === 'valuePickerNewFoodUnit'){
      
        if (currentUnit === 'GRAM') {

          style.set('valuePickerNewFoodQuantityMetric100',        'display', '');
          style.set('valuePickerNewFoodQuantityMetric10',         'display', '');      
          style.set('valuePickerNewFoodQuantityMetric1',          'display', '');

          style.set('valuePickerNewFoodQuantityImperial',         'display', 'none');
          style.set('valuePickerNewFoodQuantityImperialFraction', 'display', 'none');
      
        } else if (currentUnit === 'OZ') {

          style.set('valuePickerNewFoodQuantityMetric100',        'display', 'none');
          style.set('valuePickerNewFoodQuantityMetric10',         'display', 'none');
          style.set('valuePickerNewFoodQuantityMetric1',          'display', 'none');

          style.set('valuePickerNewFoodQuantityImperial',         'display', '');
          style.set('valuePickerNewFoodQuantityImperialFraction', 'display', '');
        }

      } else if (this.id === 'valuePickerUpdateFoodUnit'){
        
        if (currentUnit === 'GRAM') {

          style.set('valuePickerUpdateFoodQuantityMetric100',        'display', '');
          style.set('valuePickerUpdateFoodQuantityMetric10',         'display', '');
          style.set('valuePickerUpdateFoodQuantityMetric1',          'display', '');
                               
          style.set('valuePickerUpdateFoodQuantityImperial',         'display', 'none');
          style.set('valuePickerUpdateFoodQuantityImperialFraction', 'display', 'none');
      
        } else if (currentUnit === 'OZ') {

          style.set('valuePickerUpdateFoodQuantityMetric100',        'display', 'none');
          style.set('valuePickerUpdateFoodQuantityMetric10',         'display', 'none');
          style.set('valuePickerUpdateFoodQuantityMetric1',          'display', 'none');
                               
          style.set('valuePickerUpdateFoodQuantityImperial',         'display', '');
          style.set('valuePickerUpdateFoodQuantityImperialFraction', 'display', '');
        }

      } else if (this.id === 'valuePickerNewMeasurementUnit'){

        if (currentUnit === 'ST LB') {

          style.set('valuePickerNewMeasurementQuantityKG',           'display', 'none');
          style.set('valuePickerNewMeasurementQuantityG',            'display', 'none');
          style.set('valuePickerNewMeasurementQuantityLBS',          'display', 'none');
          style.set('valuePickerNewMeasurementQuantityST',           'display', ''    );
          style.set('valuePickerNewMeasurementQuantityLB',           'display', ''    );
          style.set('valuePickerNewMeasurementQuantityHR',           'display', 'none');
          style.set('valuePickerNewMeasurementQuantityQT',           'display', 'none');
          style.set('valuePickerNewMeasurementQuantityMIN',          'display', 'none');
      
        } else if (currentUnit === 'LBS') {

          style.set('valuePickerNewMeasurementQuantityKG',           'display', 'none');
          style.set('valuePickerNewMeasurementQuantityG',            'display', 'none');
          style.set('valuePickerNewMeasurementQuantityLBS',          'display', ''    );
          style.set('valuePickerNewMeasurementQuantityST',           'display', 'none');
          style.set('valuePickerNewMeasurementQuantityLB',           'display', 'none');
          style.set('valuePickerNewMeasurementQuantityHR',           'display', 'none');
          style.set('valuePickerNewMeasurementQuantityQT',           'display', 'none');
          style.set('valuePickerNewMeasurementQuantityMIN',          'display', 'none');

        } else if (currentUnit === 'KG') {

          style.set('valuePickerNewMeasurementQuantityKG',           'display', ''    );
          style.set('valuePickerNewMeasurementQuantityG',            'display', ''    );
          style.set('valuePickerNewMeasurementQuantityLBS',          'display', 'none');
          style.set('valuePickerNewMeasurementQuantityST',           'display', 'none');
          style.set('valuePickerNewMeasurementQuantityLB',           'display', 'none');
          style.set('valuePickerNewMeasurementQuantityHR',           'display', 'none');
          style.set('valuePickerNewMeasurementQuantityQT',           'display', 'none');
          style.set('valuePickerNewMeasurementQuantityMIN',          'display', 'none');

        } else if (currentUnit === 'HR') {

          style.set('valuePickerNewMeasurementQuantityKG',           'display', 'none');
          style.set('valuePickerNewMeasurementQuantityG',            'display', 'none');
          style.set('valuePickerNewMeasurementQuantityLBS',          'display', 'none');
          style.set('valuePickerNewMeasurementQuantityST',           'display', 'none');
          style.set('valuePickerNewMeasurementQuantityLB',           'display', 'none');
          style.set('valuePickerNewMeasurementQuantityHR',           'display', ''    );
          style.set('valuePickerNewMeasurementQuantityQT',           'display', ''    );
          style.set('valuePickerNewMeasurementQuantityMIN',          'display', 'none');

        } else if (currentUnit === 'MIN') {

          style.set('valuePickerNewMeasurementQuantityKG',           'display', 'none');
          style.set('valuePickerNewMeasurementQuantityG',            'display', 'none');
          style.set('valuePickerNewMeasurementQuantityLBS',          'display', 'none');
          style.set('valuePickerNewMeasurementQuantityST',           'display', 'none');
          style.set('valuePickerNewMeasurementQuantityLB',           'display', 'none');
          style.set('valuePickerNewMeasurementQuantityHR',           'display', 'none');
          style.set('valuePickerNewMeasurementQuantityQT',           'display', 'none');
          style.set('valuePickerNewMeasurementQuantityMIN',          'display', ''    );
       }

      } else if (this.id === 'valuePickerUpdateMeasurementUnit'){

        if (currentUnit === 'ST LB') {

          style.set('valuePickerUpdateMeasurementQuantityKG',           'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityG',            'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityLBS',          'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityST',           'display', ''    );
          style.set('valuePickerUpdateMeasurementQuantityLB',           'display', ''    );
          style.set('valuePickerUpdateMeasurementQuantityHR',           'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityQT',           'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityMIN',          'display', 'none');
      
        } else if (currentUnit === 'LBS') {

          style.set('valuePickerUpdateMeasurementQuantityKG',           'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityG',            'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityLBS',          'display', ''    );
          style.set('valuePickerUpdateMeasurementQuantityST',           'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityLB',           'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityHR',           'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityQT',           'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityMIN',          'display', 'none');

        } else if (currentUnit === 'KG') {

          style.set('valuePickerUpdateMeasurementQuantityKG',           'display', ''    );
          style.set('valuePickerUpdateMeasurementQuantityG',            'display', ''    );
          style.set('valuePickerUpdateMeasurementQuantityLBS',          'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityST',           'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityLB',           'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityHR',           'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityQT',           'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityMIN',          'display', 'none');

        } else if (currentUnit === 'HR') {

          style.set('valuePickerUpdateMeasurementQuantityKG',           'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityG',            'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityLBS',          'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityST',           'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityLB',           'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityHR',           'display', ''    );
          style.set('valuePickerUpdateMeasurementQuantityQT',           'display', ''    );
          style.set('valuePickerUpdateMeasurementQuantityMIN',          'display', 'none');

        } else if (currentUnit === 'MIN') {

          style.set('valuePickerUpdateMeasurementQuantityKG',           'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityG',            'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityLBS',          'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityST',           'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityLB',           'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityHR',           'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityQT',           'display', 'none');
          style.set('valuePickerUpdateMeasurementQuantityMIN',          'display', ''    );
       }

      } 
    }, 
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    connectedMenu: function (hideFromAnonymousUser) {

      style.set('imgSplash', 'display', 'none');
      
      query(".ShowOnConnect").forEach(function(node){
         style.set(node, 'display', '');
      });
      query(".ShowOnDisconnect").forEach(function(node){
         style.set(node, 'display', 'none');
      });

      if (hideFromAnonymousUser === true){

        query(".HideOnAnonymous").forEach(function(node){
           style.set(node, 'display', 'none');
        });
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    disConnectedMenu: function () {

      query(".ShowOnConnect").forEach(function(node){
         style.set(node, 'display', 'none');
      });
      query(".ShowOnDisconnect").forEach(function(node){
         style.set(node, 'display', '');
      });
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    anonymousUserForms:function () { 
      
      style.set('divAnonymousUserLogout', 'display', ''    );
      style.set('divExistingUserLogout',  'display', 'none');
    },
    existingUserForms:function () { 

      style.set('divAnonymousUserLogout', 'display', 'none');
      style.set('divExistingUserLogout',  'display', ''    );
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    weekListing: function() {

      var week = window.app.data.selectedWeek;
      
      var list;
      var template;
      var listItem;
      //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ 
      var foodheaderTemplate =  '<div class="Div-Header-Large-Screen">                                                                ' +
                                '  <div class="Div-Info-Header-Small      "                                 >Salt</div>               ' +
                                '  <div class="Div-Info-Header-Small      "                                 >Fibre</div>              ' +
                                '  <div class="Div-Info-Header-Small-Down "   style="; text-indent:-20px"   >Saturated Fat</div>      ' +
                                '  <div class="Div-Info-Header-Small-Up   "                                 >Fat</div>                ' +
                                '  <div class="Div-Info-Header-Small-Down "   style="; text-indent:-10px"   >Sugars</div>             ' +
                                '  <div class="Div-Info-Header-Small-Up   "   style="; text-indent: 20px"   >Carbohydrates</div>      ' +
                                '  <div class="Div-Info-Header-Small      "                                 >Protein</div>            ' +
                                '  <div class="Div-Info-Header-Small      "                                 >Calories</div>           ' +
                                '</div>                                                                                               ' +
                                
                                '<div class="Div-Header-Medium-Screen">                                                               ' +
                                '  <div class="Div-Info-Header-Small      "                                 >Fat</div>                ' +
                                '  <div class="Div-Info-Header-Small      "                                 >Carbs.</div>             ' +
                                '  <div class="Div-Info-Header-Small      "                                 >Protein</div>            ' +
                                '  <div class="Div-Info-Header-Small      "                                 >Calories</div>           ' +
                                '</div>                                                                                               ' +
                                
                                '<div class="Div-Header-Small-Screen">                                                                ' +
                                '  <div class="Div-Info-Header-Small">Calories</div>                                                  ' +
                                '</div>                                                                                               ' +

                                '<div class="Div-Info-Title-Left">                                                                    ' +
                                '  <span>[WEEK.NAME]</span>                                                                           ' +
                                '</div>                                                                                               ';
 
     var foodSummaryTemplate =  '<div class="Div-Info-Data-Large-Screen">                               ' +
                                '  <div class="Div-Info-Data"      >[SUMMARY.SALT1]</div>               ' +
                                '  <div class="Div-Info-Data"      >[SUMMARY.FIBRE1]</div>              ' +
                                '  <div class="Div-Info-Data-light">[SUMMARY.SATURATEFAT1]</div>        ' +
                                '  <div class="Div-Info-Data"      >[SUMMARY.FAT1]</div>                ' +
                                '  <div class="Div-Info-Data-light">[SUMMARY.SUGARS1]</div>             ' +
                                '  <div class="Div-Info-Data"      >[SUMMARY.CARBOHYDRATES1]</div>      ' +
                                '  <div class="Div-Info-Data"      >[SUMMARY.PROTEIN1]</div>            ' +
                                '  <div class="Div-Info-Data"      >[SUMMARY.CALORIES1]</div>           ' +
                                '</div>                                                                 ' +   

                                '<div class="Div-Info-Data-Medium-Screen">                              ' +
                                '  <div class="Div-Info-Data"      >[SUMMARY.FAT2]</div>                ' +
                                '  <div class="Div-Info-Data"      >[SUMMARY.CARBOHYDRATES2]</div>      ' +
                                '  <div class="Div-Info-Data"      >[SUMMARY.PROTEIN2]</div>            ' +
                                '  <div class="Div-Info-Data"      >[SUMMARY.CALORIES2]</div>           ' +
                                '</div>                                                                 ' +   

                                '<div class="Div-Info-Data-Small-Screen">                               ' +
                                '  <div class="Div-Info-Data">[SUMMARY.CALORIES3]</div>                 ' +
                                '</div>                                                                 ' +  
                                                                                                                                                                                    
                                '<div class="Div-Info-Title-Left">                                      ' +
                                '  <span>[SUMMARY.NAME]</span>                                          ' +
                                '</div>                                                                 ';


       var measurementHeaderTemplate =  '<div class="Div-Header-Large-Screen">                                                       ' +
                                        '  <div class="Div-Info-Header-Small-Wide       ">BP</div>                                   ' +
                                        '  <div class="Div-Info-Header-Small-Wide       ">Weight (KG)</div>                          ' +
                                        '  <div class="Div-Info-Header-Small-Wide       ">Exercise (Hr:Min)</div>                    ' +
                                        '</div>                                                                                      ' +

                                        '<div class="Div-Header-Small-Screen">                                                       ' +
                                        '  <div class="Div-Info-Header-Small      ">Weight</div>                                     ' +
                                        '</div>                                                                                      ' +

                                        '<div class="Div-Info-Title-Left">                                                           ' +
                                        '  <span>[WEEK.NAME]</span>                                                                  ' +
                                        '</div>                                                                                      ';



      var measurementSummaryTemplate =  '<div  class="Div-Header-Large-Screen" >                                                     ' +
                                        '  <div class="Div-Info-Data-Wide ">[SUMMARY.BLOODPRESSURE]</div>                            ' +
                                        '  <div class="Div-Info-Data-Wide ">[SUMMARY.WEIGHT1]</div>                                  ' +
                                        '  <div class="Div-Info-Data-Wide ">[SUMMARY.EXERCISE]</div>                                 ' +
                                        '</div>                                                                                      ' +    
                                                                                             
                                        '<div class="Div-Header-Small-Screen">                                                       ' +
                                        '  <div class="Div-Info-Data-Wide ">[SUMMARY.WEIGHT2]</div>                                  ' +
                                        '</div>                                                                                      ' +                                                                                                 
                                        
                                        '<div class="Div-Info-Title-Left">                                                           ' +
                                        '  <span>[SUMMARY.NAME]</span>                                                               ' +
                                        '</div>                                                                                      ';
      //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ 
      list = registry.byId('listFoodEntrySummaries');
      
      template = foodheaderTemplate.replace('[WEEK.NAME]', week.name);

      listItem = new ListItem();

      listItem.set('innerHTML', template);                                           

      list.addChild(listItem);       

      arrayManager.forEach(week.dailySummaries, function(summary){ 

         template = foodSummaryTemplate;
         
         template = template.replace('[SUMMARY.NAME]',                                       summary.dayName              ); 
         template = template.replace('[SUMMARY.CALORIES1]',      app.display.formatFoodValue(summary.caloriesPerDay     ) ); 
         template = template.replace('[SUMMARY.PROTEIN1]',       app.display.formatFoodValue(summary.proteinPerDay      ) ); 
         template = template.replace('[SUMMARY.CARBOHYDRATES1]', app.display.formatFoodValue(summary.carbohydratePerDay ) ); 
         template = template.replace('[SUMMARY.SUGARS1]',        app.display.formatFoodValue(summary.fatPerDay          ) ); 
         template = template.replace('[SUMMARY.FAT1]',           app.display.formatFoodValue(summary.sugarPerDay        ) ); 
         template = template.replace('[SUMMARY.SATURATEFAT1]',   app.display.formatFoodValue(summary.saturatedFatPerDay ) ); 
         template = template.replace('[SUMMARY.FIBRE1]',         app.display.formatFoodValue(summary.fibrePerDay        ) ); 
         template = template.replace('[SUMMARY.SALT1]',          app.display.formatFoodValue(summary.saltPerDay         ) ); 

         template = template.replace('[SUMMARY.CALORIES2]',      app.display.formatFoodValue(summary.caloriesPerDay     ) ); 
         template = template.replace('[SUMMARY.PROTEIN2]',       app.display.formatFoodValue(summary.proteinPerDay      ) ); 
         template = template.replace('[SUMMARY.CARBOHYDRATES2]', app.display.formatFoodValue(summary.carbohydratePerDay ) ); 
         template = template.replace('[SUMMARY.FAT2]',           app.display.formatFoodValue(summary.sugarPerDay        ) ); 

         template = template.replace('[SUMMARY.CALORIES3]',      app.display.formatFoodValue(summary.caloriesPerDay     ) ); 
         
         listItem = new ListItem();

         listItem.set('moveTo',         'viewDailyFoodEntries'  );
         listItem.set('variableHeight',  true            ); 
         listItem.set('innerHTML',       template        );

         //on(listItem, 'click', function(){app.actions.showDay(summary.dayName );} );
         listItem.clickHandler = on(listItem, 'click', (function(s) { return function(){ app.actions.showDay(s); }; }(summary.dayName)) );

         list.addChild(listItem); 
      });
      //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ 
      list = registry.byId('listMeasurementEntrySummaries');
      
      template = measurementHeaderTemplate.replace('[WEEK.NAME]', week.name);

      listItem = new ListItem();

      listItem.set('innerHTML', template);                                           

      list.addChild(listItem);       

      arrayManager.forEach(week.dailySummaries, function(summary){ 

         template = measurementSummaryTemplate;

         listItem = new ListItem();

         template = template.replace('[SUMMARY.NAME]',                                                        summary.dayName                    ); 
         template = template.replace('[SUMMARY.BLOODPRESSURE]',          app.display.formatMeasurementValue(  summary.bloodPressureAverage     ) ); 
         template = template.replace('[SUMMARY.WEIGHT1]',                app.display.formatMeasurementValue(  summary.weightAverage            ) ); 
         template = template.replace('[SUMMARY.WEIGHT2]',                app.display.formatMeasurementValue(  summary.weightAverage            ) ); 
         template = template.replace('[SUMMARY.EXERCISE]',               app.display.formatMeasurementValue(  summary.exerciseTotal            ) ); 

         listItem.set('moveTo',         'viewDailyMeasurementEntries'  );
         listItem.set('variableHeight',  true                          ); 
         listItem.set('innerHTML',       template                      );

         //on(listItem, 'click', function(){app.actions.showDay(summary.dayName );} );
         listItem.clickHandler = on(listItem, 'click', (function(s) { return function(){ app.actions.showDay(s); }; }(summary.dayName)) );

         list.addChild(listItem); 
      });
      
      window.app.display.resize();
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    dayListing: function() {

      var day = window.app.data.selectedDay;
      
      var list;
      var template;                                                                         
      var listItem;
      var rightText;
      var mealTime;

      var mealtimeLabels = [];

      mealtimeLabels.push(new ListItem({label: 'Snacks'     }));
      mealtimeLabels.push(new ListItem({label: 'Dinner'     }));
      mealtimeLabels.push(new ListItem({label: 'Lunch'      }));
      mealtimeLabels.push(new ListItem({label: 'Breakfast'  }));

      //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ 
      var foodheaderTemplate =  '<div class="Div-Header-Large-Screen">                                                ' +
                                '  <div class="Div-Info-Header-Small      "                                 >Salt</div>                    ' +
                                '  <div class="Div-Info-Header-Small      "                                 >Fibre</div>                   ' +
                                '  <div class="Div-Info-Header-Small-Down "   style="; text-indent:-20px"   >Saturated Fat</div>           ' +
                                '  <div class="Div-Info-Header-Small-Up   "                                 >Fat</div>                     ' +
                                '  <div class="Div-Info-Header-Small-Down "   style="; text-indent:-10px"   >Sugars</div>                  ' +
                                '  <div class="Div-Info-Header-Small-Up   "   style="; text-indent: 20px"   >Carbohydrates</div>           ' +
                                '  <div class="Div-Info-Header-Small      "                                 >Protein</div>                 ' +
                                '  <div class="Div-Info-Header-Small      "                                 >Calories</div>                ' +
                                '</div>                                                                                                    ' +
                              
                                '<div class="Div-Header-Medium-Screen">                                                ' +
                                '  <div class="Div-Info-Header-Small      "                                 >Fat</div>                     ' +
                                '  <div class="Div-Info-Header-Small      "                                 >Carbohydrates</div>           ' +
                                '  <div class="Div-Info-Header-Small      "                                 >Protein</div>                 ' +
                                '  <div class="Div-Info-Header-Small      "                                 >Calories</div>                ' +
                                '</div>                                                                                                    ' +
                                
                                '<div class="Div-Header-Small-Screen">                                                                     ' +
                                '  <div class="Div-Info-Header-Small      ">Calories</div>                                                 ' +
                                '</div>                                                                                                    ' +
                                
                                '<div class="Div-Info-Title-Left">                                                                         ' +
                                '  <span>[DAY.NAME]</span>                                                                                 ' +
                                '</div>                                                                                                    ';
                                
     var foodItemTemplate =     '<div class="Div-Header-Large-Screen">                                    ' +
                                '  <div     class="Div-Info-Data"      >[ITEM.SALT1]</div>                ' +
                                '  <div     class="Div-Info-Data"      >[ITEM.FIBRE1]</div>               ' +
                                '  <div     class="Div-Info-Data-light">[ITEM.SATURATEFAT1]</div>         ' +
                                '  <div     class="Div-Info-Data"      >[ITEM.FAT1]</div>                 ' +
                                '  <div     class="Div-Info-Data-light">[ITEM.SUGARS1]</div>              ' +
                                '  <div     class="Div-Info-Data"      >[ITEM.CARBOHYDRATES1]</div>       ' +
                                '  <div     class="Div-Info-Data"      >[ITEM.PROTEIN1]</div>             ' +
                                '  <div     class="Div-Info-Data"      >[ITEM.CALORIES1]</div>            ' +
                                '</div>                                                                   ' +
                               
                               '<div class="Div-Header-Medium-Screen">                                    ' +
                                '  <div     class="Div-Info-Data"      >[ITEM.FAT2]</div>                 ' +
                                '  <div     class="Div-Info-Data"      >[ITEM.CARBOHYDRATES2]</div>       ' +
                                '  <div     class="Div-Info-Data"      >[ITEM.PROTEIN2]</div>             ' +
                                '  <div     class="Div-Info-Data"      >[ITEM.CALORIES2]</div>            ' +
                                '</div>                                                                   ' +
                                
                                '<div class="Div-Header-Small-Screen" >                                   ' +
                                '  <div class="Div-Info-Data      ">[ITEM.CALORIES3]</div>                ' +
                                '</div>                                                                   ' +
                                
                                '<div class="Div-Info-Title-Left" >                                       ' +
                                '  <span class="Span-Info-Quantity"    >[ITEM.QUANTITY]</span>            ' +
                                '  <span class="Span-Info-Insert-Small">[ITEM.SERVINGSIZE]</span>         ' +
                                '  <span class="Span-Info-Description" >[ITEM.FOODNAME]</span>            ' +
                                '</div>                                                                   ';
                                
      var foodsummaryTemplate = '<div class="Div-Header-Large-Screen">                                    ' +
                                '  <div     class="Div-Summary-Data"       >[ITEM.SALT1]</div>            ' +
                                '  <div     class="Div-Summary-Data"       >[ITEM.FIBRE1]</div>           ' +
                                '  <div     class="Div-Summary-Data-light" >[ITEM.SATURATEFAT1]</div>     ' +
                                '  <div     class="Div-Summary-Data"       >[ITEM.FAT1]</div>             ' +
                                '  <div     class="Div-Summary-Data-light" >[ITEM.SUGARS1]</div>          ' +
                                '  <div     class="Div-Summary-Data"       >[ITEM.CARBOHYDRATES1]</div>   ' +
                                '  <div     class="Div-Summary-Data"       >[ITEM.PROTEIN1]</div>         ' +
                                '  <div     class="Div-Summary-Data"       >[ITEM.CALORIES1]</div>        ' +
                                '</div>                                                                   ' +
                                                                                                          
                                '<div class="Div-Header-Medium-Screen">                                   ' +
                                '  <div     class="Div-Summary-Data"       >[ITEM.FAT2]</div>             ' +
                                '  <div     class="Div-Summary-Data"       >[ITEM.CARBOHYDRATES2]</div>   ' +
                                '  <div     class="Div-Summary-Data"       >[ITEM.PROTEIN2]</div>         ' +
                                '  <div     class="Div-Summary-Data"       >[ITEM.CALORIES2]</div>        ' +
                                '</div>                                                                   ' +
                                                                                                          
                                '<div class="Div-Header-Small-Screen" >                                   ' +
                                '  <div class="Div-Summary-Data            ">[ITEM.CALORIES3]</div>       ' +
                                '</div>                                                                   ' ;
      //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ 
      var measurementHeaderTemplate =  '<div class="Div-Info-Title-Left">                                             ' +
                                       '  <span>[DAY.NAME]</span>                                                     ' +
                                       '</div>                                                                        ';

      var measurementItemTemplate =    '<div class="Div-Info-Details">                                                ' +
                                       '  <div      class="Div-Info-Data-Wide ">                                      ' +
                                       '    <div    class="Div-Info-Value">[ITEM.VALUE]</div>                         ' +
                                       '    <div    class="Div-Info-Unit">[ITEM.UNITNAME]</div>                       ' +
                                       '  </div>                                                                      ' +
                                       '  <div>                                                                       ' +
                                       '      <span   class="Span-Info-Description" >[ITEM.MEASUREMENTNAME]</span>    ' +
                                       '      <span   class="Span-Info-Insert-Small" >[ITEM.ENTRYTIME]</span>         ' +
                                       '  </div>                                                                      ' +
                                       '</div>                                                                        ';
      //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ 
      list = registry.byId('listFoodEntries');
      
      template = foodheaderTemplate.replace('[DAY.NAME]', day.name);

      listItem = new ListItem();

      listItem.set('innerHTML', template);                                           

      list.addChild(listItem);  
      //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------  
      if (mealtimeLabels.length > 0) {  list.addChild( mealtimeLabels.pop() ); } 
      //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ 
      arrayManager.forEach(day.foodEntryDetails, function(foodEntry){ 
      
        if      (foodEntry.entryTime === '101'){ while (mealtimeLabels.length > 3) {  list.addChild( mealtimeLabels.pop() ); } }
        else if (foodEntry.entryTime === '102'){ while (mealtimeLabels.length > 2) {  list.addChild( mealtimeLabels.pop() ); } }
        else if (foodEntry.entryTime === '103'){ while (mealtimeLabels.length > 1) {  list.addChild( mealtimeLabels.pop() ); } }
        else if (foodEntry.entryTime === '104'){ while (mealtimeLabels.length > 0) {  list.addChild( mealtimeLabels.pop() ); } }

        if (foodEntry.foodEntryGuid === 'SUMMARY') { 
          
          if      (foodEntry.entryTime === '101'){ mealTime = 'Breakfast'; }
          else if (foodEntry.entryTime === '102'){ mealTime = 'Lunch';     }
          else if (foodEntry.entryTime === '103'){ mealTime = 'Dinner';    }
          else if (foodEntry.entryTime === '104'){ mealTime = 'Snacks';    }
          
          rightText = 'Add to ' + mealTime;                                                                 
          
          if (foodEntry.caloriesPerEntry) {

            template = foodsummaryTemplate;

            template = template.replace('[ITEM.CALORIES1]',             app.display.formatFoodValue(  foodEntry.caloriesPerEntry                 ) ); 
            template = template.replace('[ITEM.PROTEIN1]',              app.display.formatFoodValue(  foodEntry.proteinPerEntry                  ) ); 
            template = template.replace('[ITEM.CARBOHYDRATES1]',        app.display.formatFoodValue(  foodEntry.carbohydratePerEntry             ) ); 
            template = template.replace('[ITEM.SUGARS1]',               app.display.formatFoodValue(  foodEntry.sugarPerEntry                    ) ); 
            template = template.replace('[ITEM.FAT1]',                  app.display.formatFoodValue(  foodEntry.fatPerEntry                      ) ); 
            template = template.replace('[ITEM.SATURATEFAT1]',          app.display.formatFoodValue(  foodEntry.saturatedFatPerEntry             ) ); 
            template = template.replace('[ITEM.FIBRE1]',                app.display.formatFoodValue(  foodEntry.fibrePerEntry                    ) ); 
            template = template.replace('[ITEM.SALT1]',                 app.display.formatFoodValue(  foodEntry.saltPerEntry                     ) ); 

            template = template.replace('[ITEM.CALORIES2]',             app.display.formatFoodValue(  foodEntry.caloriesPerEntry                 ) ); 
            template = template.replace('[ITEM.PROTEIN2]',              app.display.formatFoodValue(  foodEntry.proteinPerEntry                  ) ); 
            template = template.replace('[ITEM.CARBOHYDRATES2]',        app.display.formatFoodValue(  foodEntry.carbohydratePerEntry             ) ); 
            template = template.replace('[ITEM.FAT2]',                  app.display.formatFoodValue(  foodEntry.fatPerEntry                      ) ); 

            template = template.replace('[ITEM.CALORIES3]',             app.display.formatFoodValue(  foodEntry.caloriesPerEntry                 ) ); 
            
            listItem = new ListItem();                                 
                                                                                
            listItem.set('innerHTML',       template ); 

            list.addChild( listItem );  
          } 
          
          listItem = new ListItem();                                 
                                                                                
          listItem.set('rightText',      rightText                 );                    
          listItem.set('moveTo',         'viewNewFoodEntrySource'  );  

          //on(listItem, 'click', function(){ app.actions.showNewFoodEntry(mealTime); } );     closures are FUCKING ANOYING!!!!!
          listItem.clickHandler = on(listItem, 'click', (function(s) { return function(){ app.actions.showFoodEntryOptions('CURRENT', s, 'viewDailyFoodEntries'); }; }(mealTime)) );

          list.addChild( listItem );                                                                       
       } else {
        
          template = foodItemTemplate;

          template = template.replace('[ITEM.FOODNAME]',                                            foodEntry.foodName.capitalizeWords()           ); 
          template = template.replace('[ITEM.SERVINGSIZE]',                                         foodEntry.servingSize                          ); 
          template = template.replace('[ITEM.QUANTITY]',                                            foodEntry.amount + ' ' + foodEntry.unitName    ); 
          
          template = template.replace('[ITEM.CALORIES1]',              app.display.formatFoodValue(  foodEntry.caloriesPerEntry                  ) ); 
          template = template.replace('[ITEM.PROTEIN1]',               app.display.formatFoodValue(  foodEntry.proteinPerEntry                   ) ); 
          template = template.replace('[ITEM.CARBOHYDRATES1]',         app.display.formatFoodValue(  foodEntry.carbohydratePerEntry              ) ); 
          template = template.replace('[ITEM.SUGARS1]',                app.display.formatFoodValue(  foodEntry.sugarPerEntry                     ) ); 
          template = template.replace('[ITEM.FAT1]',                   app.display.formatFoodValue(  foodEntry.fatPerEntry                       ) ); 
          template = template.replace('[ITEM.SATURATEFAT1]',           app.display.formatFoodValue(  foodEntry.saturatedFatPerEntry              ) ); 
          template = template.replace('[ITEM.FIBRE1]',                 app.display.formatFoodValue(  foodEntry.fibrePerEntry                     ) ); 
          template = template.replace('[ITEM.SALT1]',                  app.display.formatFoodValue(  foodEntry.saltPerEntry                      ) ); 

          template = template.replace('[ITEM.PROTEIN2]',               app.display.formatFoodValue(  foodEntry.proteinPerEntry                   ) ); 
          template = template.replace('[ITEM.CARBOHYDRATES2]',         app.display.formatFoodValue(  foodEntry.carbohydratePerEntry              ) ); 
          template = template.replace('[ITEM.CALORIES2]',              app.display.formatFoodValue(  foodEntry.caloriesPerEntry                  ) ); 
          template = template.replace('[ITEM.FAT2]',                   app.display.formatFoodValue(  foodEntry.fatPerEntry                       ) ); 

          template = template.replace('[ITEM.CALORIES3]',             app.display.formatFoodValue(  foodEntry.caloriesPerEntry                   ) ); 
          
          listItem = new ListItem();

          listItem.set('innerHTML',       template             ); 
          listItem.set('variableHeight',  true                 ); 
          listItem.set('moveTo',         'viewUpdateFoodEntry' );  

          listItem.clickHandler = on(listItem, 'click', (function(e) { return function(){ app.actions.showUpdateFoodEntry(e); }; }(foodEntry)) );

          list.addChild(listItem); 
        }

      });

      while (mealtimeLabels.length > 0) { list.addChild( mealtimeLabels.pop() );  }      
      //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ 
      list = registry.byId('listMeasurementEntries');
      
      template = measurementHeaderTemplate.replace('[DAY.NAME]', day.name);

      listItem = new ListItem();

      listItem.set('innerHTML', template);                                           

      list.addChild(listItem);  
      //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ 
      arrayManager.forEach(day.measurementEntryDetails, function(measurementEntry){ 
          
          template = measurementItemTemplate;

          template = template.replace('[ITEM.MEASUREMENTNAME]',                                      measurementEntry.measurementName.capitalizeWords()   ); 
          template = template.replace('[ITEM.ENTRYTIME]',                                            measurementEntry.entryTime                           ); 
          template = template.replace('[ITEM.VALUE]',           app.display.formatMeasurementValue(  measurementEntry.value                             ) ); 
          template = template.replace('[ITEM.UNITNAME]',        app.display.formatMeasurementValue(  measurementEntry.unitName                          ) );                                                                                                                                         
 
          listItem = new ListItem();

          listItem.set('innerHTML',       template                    ); 
          listItem.set('variableHeight',  true                        ); 
          listItem.set('moveTo',         'viewUpdateMeasurementEntry' );  

          listItem.clickHandler = on(listItem, 'click', (function(e) { return function(){ app.actions.showUpdateMeasurementEntry(e); }; }(measurementEntry)) );

          list.addChild(listItem); 
      });
      //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ 
      listItem = new ListItem();

      listItem.set('label',     ''                                );                                           
      listItem.set('rightText', 'Add Measurement'                 );                                           
      listItem.set('moveTo',    'viewNewMeasurementEntryOptions'  );  

      listItem.clickHandler = on(listItem, 'click', app.actions.showAddMeasurementEntry   );

      list.addChild(listItem);  
      //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ 
      window.app.display.resize();
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    searchListing: function(){

      var data       = window.app.data;
      var list       = registry.byId('listSearchMatches');
      var listItem;
      var source;
      var target;

      if ((! data.selectedSearch) || (! data.selectedSearch.matches)) { return; }
      
      style.set('listSearchMatches',       'display', '');
      style.set('buttonMoreSearchMatches', 'display', '');

      if (data.selectedSearch.matches.length === 0){

          listItem = new ListItem({
                              variableHeight:    false,
                              label:             'No matches found'
                        });
      
          list.addChild(listItem); 
          
          style.set('buttonMoreSearchMatches', 'display', 'none');
      } else {                                                           

        arrayManager.forEach( data.selectedSearch.matches, function(match){
        
          listItem = new ListItem({
                              rightText:         'Add', 
                              moveTo:            'viewNewFoodEntryAmount',
                              variableHeight:    true,
                              label:             match.description
                        });

          //on(listItem, 'click', function(){app.actions.showFoodDetails(match);}  );
          listItem.clickHandler = on(listItem, 'click', (function(s) { return function(){ app.actions.showFoodDetails(s); }; }(match)) );
      
          list.addChild(listItem); 
          
          source = list.domNode;       
        }); 
        
        if (data.selectedSearch.hasNoMoreData === true){

          style.set('buttonMoreSearchMatches', 'display', 'none');
        } 

        if ((source) && (data.selectedSearch.matches.length > 10)) {

          target = registry.byId('viewSearchFood'); 
        
          target.scrollIntoView(source, false, 0.3);
        }
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    historyListing: function(){

      var data       = window.app.data;
      var list       = registry.byId('listHistoryEntries');
      var listItem;
      var source;
      var target;

      if ((! data.selectedHistory) || (! data.selectedHistory.entries)) { return; }
      
      style.set('listHistoryEntries',       'display', '');
      style.set('buttonMoreHistoryItems',   'display', '');

      target = registry.byId('categoryHistoryEntries');

      if (target){ 
      
        target.set('label', data.selectedHistory.mealtime.capitalizeWords() + ' Items'); 
      }

      if (data.selectedHistory.entries.length === 0){

          listItem = new ListItem({
                              variableHeight:    false,
                              label:             'No matches found'
                        });
      
          list.addChild(listItem); 
          
          style.set('buttonMoreHistoryItems', 'display', 'none');
      } else {                                                           

        var lastDate;
        var currentDate;

        arrayManager.forEach( data.selectedHistory.entries, function(entry){

          currentDate = new Date(entry.dayDate);

          currentDate = locale.format(currentDate, { datePattern: 'EEEE, d MMMM', selector: 'date' }); 

          if ( lastDate !==  currentDate){

            listItem = new ListItem({
                                variableHeight:    true,
                                rightText:         currentDate
                          });
     
            list.addChild(listItem); 

          }

          lastDate =  currentDate;
        
          listItem = new ListItem({
                              rightText:         'Add', 
                              moveTo:            'viewDailyFoodEntries',
                              variableHeight:    true,
                              label:             entry.description
                        });

          listItem.clickHandler = on(listItem, 'click', (function(e,d, m) { return function(){ app.actions.addFoodEntry(e.amount, e.unitName, e.foodGuid, d.dayDate, m); }; }(entry, data.selectedDay, data.selectedMealTime)) );
      
          list.addChild(listItem); 
          
          source = list.domNode;       
        }); 

        if (data.selectedHistory.hasNoMoreData === true){

          style.set('buttonMoreHistoryItems', 'display', 'none');
        } 
        
        if ((source) && (data.selectedHistory.entries.length > 10)) {

          target = registry.byId('viewFoodEntryHistory'); 
        
          target.scrollIntoView(source, false, 0.3);
        }
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    foodDetails: function(){
      
      var data       = window.app.data;
      var food       = data.selectedFood;
      var node;

      if (! food) { return; }

      var foodName     = food.foodName;
      var servingName  = food.servingAmount;
      var baselineName = 'per 100g';

      if (food.brandName) {

        foodName = foodName + ' (' + food.brandName +')';
      }

      if (food.servingUnit) {

        servingName = food.servingAmount + ' ' + food.servingUnit;

        if (food.servingAmount > 1) {
           servingName = servingName + 's';
        }
      }

      if (food.servingWeight) {

        servingName = servingName + ' (' + food.servingWeight + 'g)';
      }


      if (food.servingVolume) {

        servingName = servingName + ' (' + food.servingVolume + 'ml)';
      }

      if      (food.baselineCode === 'W') { baselineName = 'per 100g';    }
      else if (food.baselineCode === 'V') { baselineName = 'per 100ml';   }
      else if (food.baselineCode === 'S') { baselineName = 'per Serving'; }
      else if (food.baselineCode === 'P') { baselineName = 'per Portion'; }

      node = registry.byId('listItemFoodName');               if (node) {  node.set('label',     foodName                     ); }     
      node = registry.byId('listItemFoodServingDescription'); if (node) {  node.set('rightText', servingName                  ); } 
      node = registry.byId('listItemFoodBaselineName');       if (node) {  node.set('rightText', baselineName                 ); } 

      if (servingName){
         style.set('listItemFoodServingDescription' ,    'display', ''     );
      } else if (node){
         style.set('listItemFoodServingDescription' ,    'display', 'none' );
      }
                                                                                                                                 
      node = registry.byId('listItemFoodCalories');           if (node) {  node.set('rightText', food.caloriePerBaseline      ); } 
      node = registry.byId('listItemFoodProtein');            if (node) {  node.set('rightText', food.proteinPerBaseline      ); } 
      node = registry.byId('listItemFoodCarbohydrate');       if (node) {  node.set('rightText', food.carbohydratePerBaseline ); } 
      node = registry.byId('listItemFoodSugar');              if (node) {  node.set('rightText', food.sugarPerBaseline        ); } 
      node = registry.byId('listItemFoodFat');                if (node) {  node.set('rightText', food.fatPerBaseline          ); } 
      node = registry.byId('listItemFoodSaturatedFat');       if (node) {  node.set('rightText', food.saturatedFatPerBaseline ); } 
      node = registry.byId('listItemFoodFibre');              if (node) {  node.set('rightText', food.fibrePerBaseline        ); } 
      node = registry.byId('listItemFoodSalt');               if (node) {  node.set('rightText', food.saltPerBaseline         ); } 

      var target = registry.byId('listAddFoodServings');

      if (target) {
        target.destroyDescendants();

        var perServing = 1;
        var perUnit    = 'g';

        if ( (food.servingAmount) && (food.servingUnit) && (food.servingAmount !== 0) ) {

          if (food.servingWeight) { 
            perUnit    = 'g'; 
            perServing = food.servingWeight / food.servingAmount; 
          } else if (food.servingVolume) { 
            perUnit    = 'ml'; 
            perServing = food.servingWeight / food.servingAmount; 
          }

          arrayManager.forEach( servingOptions , function(option){
        
            var servingSize   =  Math.round(option.value * perServing);
            var servingAmount =  option.description + ' ' + food.servingUnit;
            var serving       =  servingAmount + option.sufix + ' (' + servingSize + perUnit + ')'; 

            var listItem = new ListItem({
                                rightText:         'Add', 
                                moveTo:            '#viewDailyFoodEntries',         
                                variableHeight:    true,
                                label:             serving
                          });

            //on(listItem, 'click', function(){app.actions.addFoodEntry(option.value, food.servingUnit, food.FoodGuid);}  );
            listItem.clickHandler = on(listItem, 'click', (function(v,u) { return function(){ app.actions.addSelectedFoodServing(v,u); }; }(option.value, food.servingUnit)) );
      
            target.addChild(listItem); 
          });      

        }

        if (target.getChildren().length) {
          style.set('listAddFoodServings' ,    'display', ''         );
        } else {
          style.set('listAddFoodServings' ,    'display', 'none'     );
        }      
      }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
  };

  return window.app.display;
});