/*global define, app, window, vehicleName, require, document: true */
define([
  //"dojo/query",
  //"dojo/dom-style", 
  
  "ertoc/data",
  "ertoc/display", 

  //"dojox/mobile", 
  //"dojo/dom",
  "dijit/registry",
  "dojo/dom-style", 
  "dojo/dom",
  "dojox/validate/web" 

], function (data, display, registry, style, dom, web) {
  //
  "use strict";
  //Global vairaible so that it can be accessed in HTML snippits
  window.app.actions = {
     
    //isAnonymousConnection:  false,
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    reConnect: function () {
      
      display.connectedMenu();
      display.existingUserForms();
      display.clearAll();

      data.retreveCurrentWeek()
          .then(display.weekListing, display.dataError); 

      data.retreveCurrentDay()
          .then(display.dayListing, display.dataError); 
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    connectExistingUser: function () {
      
      display.connectedMenu(false);
      display.existingUserForms();
      display.clearAll();

      var userEmail = dom.byId('inputUserEmail').value;
      var password  = dom.byId('inputPassword' ).value;

      dom.byId('inputPassword' ).value = '';

      app.storeLocaly('userName', userEmail);       
      
      if (window.innerWidth > 820){ app.displayView('viewWeeklyFoodSummaries'); } else { app.displayView('viewMenu'); }

      return data.retreveUserAuthorization(userEmail, password).then(
 
        function () { 

         data.retreveCurrentWeek()
             .then(display.weekListing, display.dataError); 


          data.retreveCurrentDay()
              .then(display.dayListing, display.dataError); 
        },
 
        display.connectError 
      );
    }, 
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    connectAnonymousUser: function () {
      
      display.connectedMenu(true);
      display.anonymousUserForms();
      display.clearAll();
        
      if (window.innerWidth > 820){ app.displayView('viewWeeklyFoodSummaries'); } else { app.displayView('viewMenu'); } 

      return data.retreveAnonymousAuthorization().then(
 
        function () { 
 
          data.retreveCurrentWeek()
              .then(display.weekListing, display.dataError); 

          data.retreveCurrentDay()
              .then(display.dayListing, display.dataError); 
        },
 
        display.connectError 
      );
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    resetPassword: function (EMail) {

      data.retrevePasswordResetStatus(EMail).then( function () { display.serverMessage(); } );
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    changeEMail: function () {

      var newEMail      = dom.byId('inputNewEMail').value;
      var confirmEMail  = dom.byId('inputConfirmNewEMail' ).value;

      if ((newEMail === '') || (newEMail !== confirmEMail)){
         
         display.inputError('Change EMail','New & Confirm EMail Must Match.', 'viewChangeEMail');         
      } else {

         dom.byId('inputNewEMail').innerHTML          = '';
         dom.byId('inputConfirmNewEMail' ).innerHTML  = '';       
         
         data.updateEMail(newEMail).then( function () { display.serverMessage(); } );    
      }   
      
      
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    changePassword: function () {

      var oldPassword      = dom.byId('inputOldPassword').value;
      var newPassword      = dom.byId('inputNewPassword').value;
      var confirmPassword  = dom.byId('inputConfirmNewPassword' ).value;

      if (oldPassword === ''){
         
         display.inputError('Change Password','As part of the security check you need to enter you old password.', 'viewChangePassword');         
      } else if ((newPassword === '') || (newPassword !== confirmPassword)){
         
         display.inputError('Change Password','New & Confirm Password Must Match.', 'viewChangePassword');         
      } else {

         dom.byId('inputOldPassword').innerHTML          = '';
         dom.byId('inputNewPassword').innerHTML          = '';
         dom.byId('inputConfirmNewPassword' ).innerHTML  = '';    
         
         data.updatePassword(oldPassword, newPassword).then( function () { display.serverMessage(); } );
      }

      
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retryConnect: function () {
      
      display.disConnectedMenu();

      app.displayView('viewExistingUser', 'fade');
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    disconnect: function () {
      
      display.disConnectedMenu();

      data.denyAuthorization();
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    register: function () {
      
      display.disConnectedMenu();

      var userName         = dom.byId('inputRegisterUserEmail'       ).value;
      var userNameConfirm  = dom.byId('inputRegisterUserEmailConfirm').value;
      var password         = dom.byId('inputRegisterPassword'        ).value;
      var passwordConfirm  = dom.byId('inputRegisterPasswordConfirm' ).value;

      if (! web.isEmailAddress(userName) ) {

        dom.byId('divRegisterError').innerHTML = 'Please use a valid EMail Address';

        app.showDialog('DialogRegisterError'); 
      
      } else  if ( (userName === '') || (userName !== userNameConfirm) ) { 
      
        dom.byId('divRegisterError').innerHTML = 'Please make sure your EMail Address Conformation matches your EMail Address';

        app.showDialog('DialogRegisterError'); 
      
      } else  if ( (password === '') ||  (password !== passwordConfirm) ) { 
            
        dom.byId('divRegisterError').innerHTML = 'Please make sure your Password Conformation matches your Password';

        app.showDialog('DialogRegisterError'); 
      
      } else {

        data.register(userName, password).then( data.denyAuthorization );

        dom.byId('inputUserEmail').value = userName;
        dom.byId('inputPassword' ).value = '';

        dom.byId('inputRegisterPassword'        ).value = '';
        dom.byId('inputRegisterPasswordConfirm' ).value = '';
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retryRegister: function () {
    
     var userName         = dom.byId('inputRegisterUserEmail'       ).value;
     var userNameConfirm  = dom.byId('inputRegisterUserEmailConfirm').value;

     if (userName !== userNameConfirm) {

        dom.byId('inputRegisterUserEmailConfirm').value = '';
      }

      dom.byId('inputRegisterPassword'        ).value = '';
      dom.byId('inputRegisterPasswordConfirm' ).value = '';

      app.displayView('viewLogout', 'fade');
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retreveWeek: function (target) {

      if (app.data.isFetching){ return; }

      display.clearWeekListing();

      data.retreveWeek(target.weekDate) 
          .then(display.weekListing, display.dataError); 
    }, 
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    refreshSelectedWeek: function () {

      //if (app.data.isFetching){ return; }

      var weekDate = app.data.selectedWeek.weekDate;

      app.data.weeks.remove(weekDate);

      display.clearWeekListing();

      data.retreveWeek(weekDate)
          .then(display.weekListing, display.dataError); 
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    activateBreakfastItem: function() {
      
      app.actions.showFoodEntryOptions('TODAY', 'BREAKFAST');

      app.displayView('viewNewFoodEntrySource');
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    activateLunchItem: function() {
      
      app.actions.showFoodEntryOptions('TODAY', 'LUNCH');

      app.displayView('viewNewFoodEntrySource');
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    activateDinnerItem: function() {
      
      app.actions.showFoodEntryOptions('TODAY', 'DINNER');

      app.displayView('viewNewFoodEntrySource');
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    activateSnacksItem: function() {
      
      app.actions.showFoodEntryOptions('TODAY', 'SNACKS');

      app.displayView('viewNewFoodEntrySource');
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    activateWeightItem: function() {
      
      app.actions.showMeasurementEntryOptions('TODAY', 'WEIGHT');           

      app.displayView('viewNewMeasurementEntryAmount');
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    activateBloodPressureItem: function() {
      
      app.actions.showMeasurementEntryOptions('TODAY', 'BLOOD PRESSURE');

      app.displayView('viewNewMeasurementEntryAmount');
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    activateExerciseItem: function() {
      
      app.actions.showMeasurementEntryOptions('TODAY', 'EXERCISE');          

      app.displayView('viewNewMeasurementEntryAmount');
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    showPriorWeek: function () {

      if (app.data.isFetching){ return; }

      display.clearWeekListing();

      data.retrevePriorWeek()
          .then(display.weekListing, display.dataError); 
    },    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    showNextWeek: function () {

      if (app.data.isFetching){ return; }

      display.clearWeekListing();

      data.retreveNextWeek()
          .then(display.weekListing, display.dataError); 
    }, 
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    showDay: function (weekDay) {

      if (app.data.isFetching){ return; }

       display.clearDayListing();

       data.retreveSelectedWeekDay(weekDay)
           .then(display.dayListing, display.dataError); 
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    refreshSelectedDay: function () {

      //if (app.data.isFetching){ return; }

      var dayDate = app.data.selectedDay.dayDate;

      app.data.days.remove(dayDate);

      display.clearDayListing();

      data.retreveDay(data.selectedDay.dayDate)
          .then(display.dayListing, display.dataError); 
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    showPriorDay: function () {

      if (app.data.isFetching){ return; }

      display.clearDayListing();

      data.retrevePriorDay()
          .then(display.dayListing, display.dataError); 
    },    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    showNextDay: function () {

      if (app.data.isFetching){ return; }

      display.clearDayListing();

      data.retreveNextDay()
          .then(display.dayListing, display.dataError); 
    },     
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    showFoodEntryOptions: function(day, mealtime){
      
      if (day === 'CURRENT') {
        
        app.actions.chooseMealTime(mealtime);       
      } else {

        app.actions.chooseDayAndMealTime(day, mealtime);
      }

      display.clearSearchPhrase();
      display.clearSearchListing();

//      var target;
//      var label;
//
//      if      (backout === 'viewDailyFoodEntries') { label = 'Diary';                                      }
//      else if (backout === undefined             ) { label = 'Mealtime'; backout = 'viewNewFoodEntryTime'; }
//      
//      target = registry.byId('headingNewFoodEntryOptions' ); if (target){ target.set('back', label);    target.set('moveTo',  backout);  }

    },    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    showMeasurementEntryOptions: function(day, measurement){
      
      app.actions.chooseDay(day);
      app.actions.chooseMeasurement(measurement);

//      var label;
//
//      if (backout === undefined             ) { label = 'Day'; backout = 'viewNewMeasurementEntryTime'; }
//
//      var target = registry.byId('headingNewMeasurementEntryOptions' ); if (target){ target.set('back', label);    target.set('moveTo',  backout);  }
    },    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    showAddMeasurementEntry: function(){
      
      var name = app.data.selectedDay.name.capitalizeWords();

      var target = registry.byId('categoryNewMeasurementEntryOptionsDate');       if (target) { target.set('label',  name);     }
          target = registry.byId('categoryNewMeasurementEntryDate');              if (target) { target.set('label',  name);     }
      
      target = registry.byId('headingNewMeasurementEntryOptions' ); if (target){ target.set('back', 'Diary'); target.set('moveTo',  'viewDailyMeasurementEntries');  }
    },    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    showUpdateMeasurementEntry: function(measurementEntry){
      

      if (app.data.isFetching){ return; }

      if (measurementEntry === undefined) { return; } 

      app.actions.chooseMeasurementEntry(measurementEntry);
       
    },    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    //
    showFoodDetails: function(match){

     if (app.data.isFetching){ return; }

     app.actions.chooseMatch(match);

     if (! app.data.selectedMatch){ return; }
       
     app.data.retreveFood(app.data.selectedMatch.foodGuid)
             .then(display.foodDetails, display.dataError); 
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    showSearchResults: function(phrase, matchAnyWord) {

      if (app.data.isFetching){ return; }

      display.clearSearchListing();

      if (! phrase      ){ phrase       = document.getElementById('InputSearchTerm').value;     }
      if (! matchAnyWord){ matchAnyWord = document.getElementById('InputMatchAnyWord').checked; }

      if (! phrase){ return; }

      if (matchAnyWord === true){

        phrase = phrase.replace(' ', ' or ');
      }

      data.retreveSearch(phrase)  
          .then(display.searchListing, display.dataError); 
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    showMoreSearchMatches: function() {

      if (app.data.isFetching){ return; }

      if (app.data.selectedSearch === undefined){ return; }

      display.clearSearchListing();

      data.retreveMoreSearchMatches()  
          .then(display.searchListing, display.dataError); 
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    showHistoryResults: function(mealtime) {

      if (app.data.isFetching){ return; }

      display.clearHistoryListing();

      if (! mealtime){ mealtime = app.data.selectedMealTime; }

      data.retreveHistory(mealtime)  
          .then(display.historyListing, display.dataError); 
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    showMoreHistoryEntries: function() {

      if (app.data.isFetching){ return; }

      if (app.data.selectedHistory === undefined){ return; }

      display.clearHistoryListing();

      data.retreveMoreHistoryEntries()  
          .then(display.historyListing, display.dataError); 
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    showUpdateFoodEntry: function(foodEntry) {

      if (app.data.isFetching){ return; }

      if (foodEntry === undefined) { return; } 

      app.actions.chooseFoodEntry(foodEntry);
    },
//    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
//    showMeasurementEntryAmounts: function(measurement) {
//
//      if (app.data.isFetching){ return; }
//
//      if (measurement === undefined) { return; } 
//
//      app.actions.chooseMeasurement(measurement);
//    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    addSelectedFood: function(){
      
      var  quantity;
      var  fraction  = '';
      var  unit      = registry.byId('valuePickerNewFoodUnit').get('value'); 

      if (unit === 'gram'){

         quantity = registry.byId('valuePickerNewFoodQuantityMetric100').get('value') + registry.byId('valuePickerNewFoodQuantityMetric10').get('value')  + registry.byId('valuePickerNewFoodQuantityMetric1').get('value') ;
      } else {

         quantity = registry.byId('valuePickerNewFoodQuantityImperial').get('value');
         fraction = registry.byId('valuePickerNewFoodQuantityImperialFraction').get('value');
 
         switch (fraction)
         {
           case '1/4':  fraction=".25";           break;
           case '1/3':  fraction=".3333";         break;
           case '1/2':  fraction=".5";            break;
           case '2/3':  fraction=".6666";         break;
           case '3/4':  fraction=".75";           break;
         } 

         quantity = quantity + fraction;
      }

      var  foodGuid  = app.data.selectedFood.foodGuid;
      var  dayDate   = app.data.selectedDay.dayDate;
      var  mealTime  = app.data.selectedMealTime;

      app.actions.addFoodEntry(quantity, unit, foodGuid, dayDate, mealTime);
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    updateSelectedFoodEntry: function(){
      
      var  quantity;
      var  fraction  = '';
      var  unit      = registry.byId('valuePickerUpdateFoodUnit').get('value'); 

      if (unit === 'gram'){

         quantity = registry.byId('valuePickerUpdateFoodQuantityMetric100').get('value') + registry.byId('valuePickerUpdateFoodQuantityMetric10').get('value')  + registry.byId('valuePickerUpdateFoodQuantityMetric1').get('value') ;
      } else {

         quantity = registry.byId('valuePickerUpdateFoodQuantityImperial').get('value');
         fraction = registry.byId('valuePickerUpdateFoodQuantityImperialFraction').get('value');
 
         switch (fraction)
         {
           case '1/4':  fraction=".25";           break;
           case '1/3':  fraction=".3333";         break;
           case '1/2':  fraction=".5";            break;
           case '2/3':  fraction=".6666";         break;
           case '3/4':  fraction=".75";           break;
         } 

         quantity = quantity + fraction;
      }

      var  foodEntryGuid  = app.data.selectedFoodEntry.foodEntryGuid;

      app.data.updateFoodEntry(quantity, unit, foodEntryGuid).then(
      
        app.actions.refreshSelectedDay
      ).then(

        app.actions.refreshSelectedWeek
      ); 
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    updateSelectedMeasurementEntry: function(){
     
      var measurementEntry = app.data.selectedMeasurementEntry;
      var measurement      = measurementEntry.measurementName.toUpperCase();
      
      var timeParts   =  registry.byId('timePickerUpdateMeasurement').get('values');
      var time;
      var unit;
      var value;

      time = timeParts[0] + ':' + timeParts[1];

      if (timeParts[2] !== undefined) { time = time + ' ' + timeParts[1]; }

      if (measurement === 'BLOOD PRESSURE') {

        value = registry.byId('valuePickerUpdateMeasurementQuantitySYS').get('value');
        
        var dis = (registry.byId('valuePickerUpdateMeasurementQuantityDIS').get('value'));

        if (dis < 100) { dis = '0' + dis.toString(); }

        value = value.toString() + '.' + dis;

        unit  = 'mmHg';

      } else if (measurement === 'WEIGHT') {

        unit = registry.byId('valuePickerUpdateMeasurementUnit').get('value').toUpperCase();

        if (unit === 'KG') {

          value = registry.byId('valuePickerUpdateMeasurementQuantityKG').get('value') + registry.byId('valuePickerUpdateMeasurementQuantityG').get('value');

        } else if (unit === 'LBS') {

          value = registry.byId('valuePickerUpdateMeasurementQuantityLBS').get('value');
        
        } else if (unit === 'ST LB') {

          value = registry.byId('valuePickerUpdateMeasurementQuantityST').get('value');
         
          value = parseInt(value,10) + (registry.byId('valuePickerUpdateMeasurementQuantityLB').get('value') / 14);

          unit = 'ST';
        }
      
      } else if (measurement === 'EXERCISE') {

        unit = registry.byId('valuePickerUpdateMeasurementUnit').get('value').toUpperCase();

        if (unit === 'HR') {

          value = registry.byId('valuePickerUpdateMeasurementQuantityHR').get('value');

          if (value === ''){
            value = '00';
          }
          
          var mins = registry.byId('valuePickerUpdateMeasurementQuantityQT').get('value').replace(':', '').extractNumber();

          if (!isNaN(mins)){

            value = parseFloat(value) + parseFloat(mins/60.00);
          }
        
        } else if (unit === 'MIN') {

          value = registry.byId('valuePickerUpdateMeasurementQuantityMIN').get('value');
        
        }
      }

      var  measurementEntryGuid  = measurementEntry.measurementEntryGuid;

      app.data.updateMeasurementEntry(time, value, unit, measurementEntryGuid).then(
      
        app.actions.refreshSelectedDay
      ).then(

        app.actions.refreshSelectedWeek
      ); 
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    addSelectedMeasurement: function(){

      var measurement = app.data.selectedMeasurement;
      var timeParts   =  registry.byId('timePickerNewMeasurement').get('values');
      var time;
      var unit;
      var value;

      time = timeParts[0] + ':' + timeParts[1];

      if (timeParts[2] !== undefined) { time = time + ' ' + timeParts[1]; }

      if (measurement === 'BLOOD PRESSURE') {

        value = registry.byId('valuePickerNewMeasurementQuantitySYS').get('value');
        
        var dis = (registry.byId('valuePickerNewMeasurementQuantityDIS').get('value'));

        if (dis < 100) { dis = '0' + dis.toString(); }

        value = value.toString() + '.' + dis;

        unit  = 'mmHg';

      } else if (measurement === 'WEIGHT') {

        unit = registry.byId('valuePickerNewMeasurementUnit').get('value').toUpperCase();

        if (unit === 'KG') {

        value = registry.byId('valuePickerNewMeasurementQuantityKG').get('value') + registry.byId('valuePickerNewMeasurementQuantityG').get('value');

        } else if (unit === 'LBS') {

         value = registry.byId('valuePickerNewMeasurementQuantityLBS').get('value');
        
        } else if (unit === 'ST LB') {

         value = registry.byId('valuePickerNewMeasurementQuantityST').get('value');
         
         value = parseInt(value,10) + (registry.byId('valuePickerNewMeasurementQuantityLB').get('value') / 14);
        }

      } else if (measurement === 'EXERCISE') {

        unit = registry.byId('valuePickerNewMeasurementUnit').get('value').toUpperCase();

        if (unit === 'HR') {

          value = registry.byId('valuePickerNewMeasurementQuantityHR').get('value');
          
          if (value === ''){
            value = '00';
          }

          var mins = registry.byId('valuePickerNewMeasurementQuantityQT').get('value').replace(':', '').extractNumber();

          if (!isNaN(mins)){

            value = parseFloat(value) + parseFloat(mins/60.00);
          }
        
        } else if (unit === 'MIN') {

          value = registry.byId('valuePickerNewMeasurementQuantityMIN').get('value');
        
        }
      }

      app.actions.addMeasurementEntry(time, value, unit);
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    deleteSelectedFoodEntry: function(){

      var  foodEntryGuid  = app.data.selectedFoodEntry.foodEntryGuid;

      app.data.deleteFoodEntry(foodEntryGuid).then(
      
        app.actions.refreshSelectedDay
      ).then(

        app.actions.refreshSelectedWeek
      ); 
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    deleteSelectedMeasurementEntry: function(){

      var  measurementEntryGuid  = app.data.selectedMeasurementEntry.measurementEntryGuid;

      app.data.deleteMeasurementEntry(measurementEntryGuid).then(
      
        app.actions.refreshSelectedDay
      ).then(

        app.actions.refreshSelectedWeek
      ); 
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    addSelectedFoodServing: function(quantity, unit){
      
      var  foodGuid  = app.data.selectedFood.foodGuid;
      var  dayDate   = app.data.selectedDay.dayDate;
      var  mealTime  = app.data.selectedMealTime;

      app.actions.addFoodEntry(quantity, unit, foodGuid, dayDate, mealTime);     
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    addFoodEntry: function(quantity, unit, foodGuid, dayDate, mealTime){
       
      if (! quantity){

       throw "Quantity Missing"; 
      }

      if (! unit){

       throw "Unit Missing"; 
      }

      if (! foodGuid){
        throw "FoodGuid Missing"; 
      }

      if (! dayDate){
        if (app.data.selectedDay){
          
          dayDate = app.data.selectedDay.dayDate;
        } else {
          
          var today = new Date();
          var start = today.toISOString();

          dayDate = start;
        }
      }

      if (! mealTime){
        if (app.data.selectedMealTime) {
          
          mealTime = app.data.selectedMealTime;
        } else {
          
          mealTime = 'breakfast';
        }
      }

      app.data.storeFoodEntry(quantity, unit, foodGuid, dayDate, mealTime).then(
      
        app.actions.refreshSelectedDay
      ).then(
        app.actions.refreshSelectedWeek
      ); 
      
      var target;

      target = registry.byId('headingNewFoodEntrySource');

      if (target){

        target.set('back',   'Diary'               );
        target.set('moveTo', 'viewDailyFoodEntries');
      }    

    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    addMeasurementEntry: function(time, value, unit){
      
      var target;
      var  dayDate     = app.data.selectedDay.dayDate;
      var  measurement = app.data.selectedMeasurement;

      if (unit.toUpperCase() === 'ST LB') { unit = 'ST'; }

      app.data.storeMeasurementEntry(measurement, value, unit, dayDate, time).then(
        app.actions.refreshSelectedDay
      ).then(
        app.actions.refreshSelectedWeek
      ); 
 
      target = registry.byId('headingNewFoodEntrySource');

      if (target){

        target.set('back',   'Diary'               );
        target.set('moveTo', 'viewDailyFoodEntries');
      }    
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    showNutrition: function () {
       
       app.displayView('viewFoodDetails', 'flip');   
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    hideNutrition: function () {
      
       app.displayView('viewNewFoodEntryAmount', 'flip');  
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    chooseMatch: function(match) {

      var display;      
      var target;

      app.data.selectedMatch = match;

      display = match.description.capitalizeWords();

      target = registry.byId('categoryAddFoodSelectedMatch'       ); if (target){ target.set('label', display);}

      target = registry.byId('valuePickerNewFoodQuantityMetric100'               ); if (target){ target.set('value', 1);      } 
      target = registry.byId('valuePickerNewFoodQuantityMetric10'                ); if (target){ target.set('value', 0);      } 
      target = registry.byId('valuePickerNewFoodQuantityMetric10'                ); if (target){ target.set('value', 0);      } 
      target = registry.byId('valuePickerNewFoodQuantityImperial'                ); if (target){ target.set('value', '3');    } 
      target = registry.byId('valuePickerNewFoodQuantityImperialFraction'        ); if (target){ target.set('value', '1/2');  } 
      target = registry.byId('valuePickerNewFoodUnit'                            ); if (target){ target.set('value', 'gram'); } 

    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    chooseDayAndMealTime: function(day, mealTime) {

      day = day.toUpperCase();

      if (app.data.isFetching){ return; }
      
      display.clearDayListing();
     
      if (day === 'TODAY')  {

        data.retreveCurrentDay()
            .then(display.dayListing, display.dataError) 
            .then( (function(m) { return function(){ app.actions.chooseMealTime(m); }; }(mealTime)) );

      } else if (day === 'YESTERDAY') {

        data.retreveYesterday()
            .then(display.dayListing, display.dataError) 
            .then( (function(m) { return function(){ app.actions.chooseMealTime(m); }; }(mealTime)) );

      } else if (day === 'TOMMOROW') {

        data.retreveTommorow()
            .then(display.dayListing, display.dataError) 
            .then( (function(m) { return function(){ app.actions.chooseMealTime(m); }; }(mealTime)) );
      }
    },    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    chooseDay: function(day) {

      day = day.toUpperCase();

      if (app.data.isFetching){ return; }
      
      display.clearDayListing();
     
      if (day === 'TODAY')  {

        data.retreveCurrentDay()
            .then(display.dayListing, display.dataError); 

      } else if (day === 'YESTERDAY') {

        data.retreveYesterday()
            .then(display.dayListing, display.dataError); 

      } else if (day === 'TOMMOROW') {

        data.retreveTommorow()
            .then(display.dayListing, display.dataError); 
      }

      var name = app.data.selectedDay.name.capitalizeWords();

      var target = registry.byId('categoryNewMeasurementEntryOptionsDate');       if (target) { target.set('label',  name);     }
          target = registry.byId('categoryNewMeasurementEntryDate');              if (target) { target.set('label',  name);     }
    },    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    chooseMeasurement: function(measurement) {
     
      app.display.hideChangeTime();

      window.app.data.selectedMeasurement = measurement.toUpperCase(); 

      var name = app.data.selectedMeasurement.capitalizeWords();
     
      var target;
      
      target = dom.byId('labelNewMeasurementEntryName'); if (target) { target.innerHTML = name; }

      if (measurement === 'BLOOD PRESSURE') {

        style.set('valuePickerNewMeasurementQuantitySYS',          'display', ''    );
        style.set('valuePickerNewMeasurementQuantityDIS',          'display', ''    );
        style.set('valuePickerNewMeasurementQuantityKG',           'display', 'none');
        style.set('valuePickerNewMeasurementQuantityG',            'display', 'none');
        style.set('valuePickerNewMeasurementQuantityLBS',          'display', 'none');
        style.set('valuePickerNewMeasurementQuantityST',           'display', 'none');
        style.set('valuePickerNewMeasurementQuantityLB',           'display', 'none');
        style.set('valuePickerNewMeasurementQuantityHR',           'display', 'none');
        style.set('valuePickerNewMeasurementQuantityQT',           'display', 'none');
        style.set('valuePickerNewMeasurementQuantityMIN',          'display', 'none');
        style.set('valuePickerNewMeasurementUnit',                 'display', 'none');
      
        target = registry.byId('valuePickerNewMeasurementQuantitySYS'    );   if (target) { target.set('value',  120      ); }
        target = registry.byId('valuePickerNewMeasurementQuantityDIS'    );   if (target) { target.set('value',   80      ); }
      
      } else  if (measurement === 'WEIGHT') {

        style.set('valuePickerNewMeasurementQuantitySYS',          'display', 'none');
        style.set('valuePickerNewMeasurementQuantityDIS',          'display', 'none');
        style.set('valuePickerNewMeasurementQuantityKG',           'display', ''    );
        style.set('valuePickerNewMeasurementQuantityG',            'display', ''    );
        style.set('valuePickerNewMeasurementQuantityLBS',          'display', 'none');
        style.set('valuePickerNewMeasurementQuantityST',           'display', 'none');
        style.set('valuePickerNewMeasurementQuantityLB',           'display', 'none');
        style.set('valuePickerNewMeasurementQuantityHR',           'display', 'none');
        style.set('valuePickerNewMeasurementQuantityQT',           'display', 'none');
        style.set('valuePickerNewMeasurementQuantityMIN',          'display', 'none');
        style.set('valuePickerNewMeasurementUnit',                 'display', ''    );
       
        target = registry.byId('valuePickerNewMeasurementUnit'         );   if (target) { target.set('items',  [[0,'Kg'],[1,'Lbs'],[2,'St Lb']]  ); }
         
        target = registry.byId('valuePickerNewMeasurementQuantityKG'   );   if (target) { target.set('value',   75     ); }
        target = registry.byId('valuePickerNewMeasurementQuantityG'    );   if (target) { target.set('value',  '.0'    ); }
        target = registry.byId('valuePickerNewMeasurementUnit'         );   if (target) { target.set('value',  'Kg'    ); }
      
      } else  if (measurement === 'EXERCISE') {

        style.set('valuePickerNewMeasurementQuantitySYS',          'display', 'none');
        style.set('valuePickerNewMeasurementQuantityDIS',          'display', 'none');
        style.set('valuePickerNewMeasurementQuantityKG',           'display', 'none');
        style.set('valuePickerNewMeasurementQuantityG',            'display', 'none');
        style.set('valuePickerNewMeasurementQuantityLBS',          'display', 'none');
        style.set('valuePickerNewMeasurementQuantityST',           'display', 'none');
        style.set('valuePickerNewMeasurementQuantityLB',           'display', 'none');
        style.set('valuePickerNewMeasurementQuantityHR',           'display', ''    );
        style.set('valuePickerNewMeasurementQuantityQT',           'display', ''    );
        style.set('valuePickerNewMeasurementQuantityMIN',          'display', 'none');
        style.set('valuePickerNewMeasurementUnit',                 'display', ''    );
       
        target = registry.byId('valuePickerNewMeasurementUnit'         );   if (target) { target.set('items',  [[0,'Hr'],[1,'Min']]  ); }
         
        target = registry.byId('valuePickerNewMeasurementQuantityHR'   );   if (target) { target.set('value',   1      ); }
        target = registry.byId('valuePickerNewMeasurementQuantityQT'   );   if (target) { target.set('value',  ''      ); }
        target = registry.byId('valuePickerNewMeasurementQuantityMIN'  );   if (target) { target.set('value',  '30'    ); }
        target = registry.byId('valuePickerNewMeasurementUnit'         );   if (target) { target.set('value',  'Hr'    ); }
      }
    },    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    chooseFoodEntry: function(foodEntry) {
      
      var target;
      var name;
      var quantity;
      var amount;      
      var unitName;
      var value100;
      var value10;
      var value1;
      var value;

      window.app.data.selectedFoodEntry = foodEntry;
      
      name     = foodEntry.foodName.capitalizeWords(); 
      quantity = foodEntry.amount + ' ' + foodEntry.unitName.capitalizeWords();

      amount = foodEntry.servingSize.extractNumber().toString();

      if (amount === 'NaN'){

        amount = foodEntry.amount;

        if      (foodEntry.amount.trim() === 'g' ) { unitName = 'gram'; }
        else if (foodEntry.amount.trim() === 'oz') { unitName = 'oz';   }
        else                                       { unitName = 'gram'; }
      } else {

        unitName = 'gram';
      }

      value = amount.extractNumber().toString();

      if      (value.length === 3) { value100 = value[0]; value10 = value[1]; value1 = value[2]; }
      else if (value.length === 2) { value100 = '0';      value10 = value[0]; value1 = value[1]; }
      else if (value.length === 1) { value100 = '0';      value10 = '0';      value1 = value[0]; }

      target = dom.byId('spanUpdateFoodEntryDescription');                if (target) { target.innerHTML = name;        }

      target = registry.byId('valuePickerUpdateFoodQuantityMetric100');   if (target) { target.set('value',  value100); }
      target = registry.byId('valuePickerUpdateFoodQuantityMetric10' );   if (target) { target.set('value',  value10 ); }
      target = registry.byId('valuePickerUpdateFoodQuantityMetric1'  );   if (target) { target.set('value',  value1  ); }

      target = registry.byId('valuePickerUpdateFoodUnit');                if (target) { target.set('value',  unitName); }
      
      target = registry.byId('categoryUpdateFoodEntryDescription');       if (target) { target.set('label',  name);     }

      window.app.actions.chooseMealTime(window.app.data.selectedFoodEntry.entryTime);
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    chooseMeasurementEntry: function(measurementEntry) {

      window.app.data.selectedMeasurementEntry = measurementEntry;

      var target;
      var values;

      var timeParts   = measurementEntry.entryTime.replace(' ', ':').split(':'); 
      var measurement = measurementEntry.measurementName.toUpperCase(); 
      var value       = measurementEntry.value;
      var unit        = measurementEntry.unitName.toUpperCase(); 

      app.display.hideChangeTime();

      target = registry.byId('timePickerUpdateMeasurement'    );       if (target) { target.set('values',  timeParts);                     }

      target = dom.byId('labelUpdateMeasurementTime'     );            if (target) { target.innerHTML = measurementEntry.entryTime.replace(' ', ':');     }
      target = dom.byId('labelUpdateMeasurementEntryName');            if (target) { target.innerHTML = measurement.capitalizeWords();                    }

      if (measurement === 'BLOOD PRESSURE'){

        style.set('valuePickerUpdateMeasurementQuantitySYS', 'display', ''    );
        style.set('valuePickerUpdateMeasurementQuantityDIS', 'display', ''    );
        style.set('valuePickerUpdateMeasurementQuantityKG',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityG',   'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityLBS', 'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityST',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityLB',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityHR',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityQT',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityMIN', 'display', 'none');
        
        style.set('valuePickerUpdateMeasurementUnit',        'display', 'none');
        
        values = value.split('/');
         
        target = registry.byId('valuePickerUpdateMeasurementQuantitySYS'); if (target) { target.set('value',  values[0]);     }
        target = registry.byId('valuePickerUpdateMeasurementQuantityDIS'); if (target) { target.set('value',  values[1]);     }
      
      } else if ( (measurement === 'WEIGHT') && (unit === 'KG')) {

        style.set('valuePickerUpdateMeasurementQuantitySYS', 'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityDIS', 'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityKG',  'display', ''    );
        style.set('valuePickerUpdateMeasurementQuantityG',   'display', ''    );
        style.set('valuePickerUpdateMeasurementQuantityST',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityLB',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityLBS', 'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityHR',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityQT',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityMIN', 'display', 'none');
        
        style.set('valuePickerUpdateMeasurementUnit',        'display', ''    );

        values = value.split('.');

        target = registry.byId('valuePickerUpdateMeasurementQuantityKG'); if (target) { target.set('value',        values[0] ); }
        target = registry.byId('valuePickerUpdateMeasurementQuantityG' ); if (target) { target.set('value',  '.' + values[1] ); }
        target = registry.byId('valuePickerUpdateMeasurementUnit'      ); if (target) { target.set('value',             'Kg' ); }
      
      } else if ( (measurement === 'WEIGHT') && (unit === 'ST')) {

        style.set('valuePickerUpdateMeasurementQuantitySYS', 'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityDIS', 'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityKG',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityG',   'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityST',  'display', ''    );
        style.set('valuePickerUpdateMeasurementQuantityLB',  'display', ''    );
        style.set('valuePickerUpdateMeasurementQuantityLBS', 'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityHR',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityQT',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityMIN', 'display', 'none');
       
        style.set('valuePickerUpdateMeasurementUnit',        'display', ''    );

        values = value.split(':');

        target = registry.byId('valuePickerUpdateMeasurementQuantityST'); if (target) { target.set('value',        values[0] ); }
        target = registry.byId('valuePickerUpdateMeasurementQuantityLB'); if (target) { target.set('value',        values[1] ); }
        target = registry.byId('valuePickerUpdateMeasurementUnit'      ); if (target) { target.set('value',          'St Lb' ); }
       
       } else if ( (measurement === 'WEIGHT') && (unit === 'LBS')) {

        style.set('valuePickerUpdateMeasurementQuantitySYS', 'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityDIS', 'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityKG',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityG',   'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityST',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityLB',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityLBS', 'display', ''    );
        style.set('valuePickerUpdateMeasurementQuantityHR',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityQT',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityMIN', 'display', 'none');
        
        style.set('valuePickerUpdateMeasurementUnit',        'display', ''    );

        target = registry.byId('valuePickerUpdateMeasurementQuantityLBS'); if (target) { target.set('value',            value ); }
        target = registry.byId('valuePickerUpdateMeasurementUnit'       ); if (target) { target.set('value',            'Lbs' ); }
      
       } else if ( (measurement === 'EXERCISE') && (unit === 'HR')) {

        style.set('valuePickerUpdateMeasurementQuantitySYS', 'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityDIS', 'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityKG',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityG',   'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityST',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityLB',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityLBS', 'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityHR',  'display', ''    );
        style.set('valuePickerUpdateMeasurementQuantityQT',  'display', ''    );
        style.set('valuePickerUpdateMeasurementQuantityMIN', 'display', 'none');
        
        style.set('valuePickerUpdateMeasurementUnit',        'display', ''    );         

        values = value.split(':');

        if (values[0] === '00') { values[0] = ''; } else if (values[0][0] === '0') { values[0] = values[0][1];     }
        if (values[1] === '00') { values[1] = ''; } else                           { values[1] = ':' + values[1];  }

        target = registry.byId('valuePickerUpdateMeasurementQuantityHR'); if (target) { target.set('value',        values[0] ); }
        target = registry.byId('valuePickerUpdateMeasurementQuantityQT'); if (target) { target.set('value',        values[1] ); }
        target = registry.byId('valuePickerUpdateMeasurementUnit'      ); if (target) { target.set('value',            'Hr'  ); }
      
      } else if ( (measurement === 'EXERCISE') && (unit === 'MIN')) {

        style.set('valuePickerUpdateMeasurementQuantitySYS', 'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityDIS', 'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityKG',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityG',   'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityST',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityLB',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityLBS', 'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityHR',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityQT',  'display', 'none');
        style.set('valuePickerUpdateMeasurementQuantityMIN', 'display', ''    );
        
        style.set('valuePickerUpdateMeasurementUnit',        'display', ''    );         

        target = registry.byId('valuePickerUpdateMeasurementQuantityMIN'); if (target) { target.set('value',            value ); }
        target = registry.byId('valuePickerUpdateMeasurementUnit'       ); if (target) { target.set('value',           'Min'  ); }
      
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    chooseMealTime: function(mealTime) {

      var display; 
      var target;

      if      (mealTime === '101') {mealTime = 'BREAKFAST';}
      else if (mealTime === '102') {mealTime = 'LUNCH';    }
      else if (mealTime === '103') {mealTime = 'DINNER';   }
      else if (mealTime === '104') {mealTime = 'SNACLS';   }

      if (mealTime === undefined){

        display =  app.data.selectedDay.name.capitalizeWords();
        
        app.data.selectedMealTime = undefined;
      } else {

        display =  mealTime.capitalizeWords() + ', ' + app.data.selectedDay.name.capitalizeWords();
        
        app.data.selectedMealTime = mealTime.toLowerCase();
      }

      target = registry.byId('categoryNewFoodEntrySourceDateAndMealTime'       ); if (target){ target.set('label', display);}
      target = registry.byId('categoryAddFoodDateAndMealTime'                   ); if (target){ target.set('label', display);}
      target = registry.byId('categoryNewMeasurementEntryOptionsDateAndMealTime'); if (target){ target.set('label', display);}
      target = registry.byId('categoryUpdateFoodEntryDateAndMealTime'           ); if (target){ target.set('label', display);}
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
  };
   
  return window.app.actions;
});
