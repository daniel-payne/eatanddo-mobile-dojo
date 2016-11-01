/*global window, define, ertoc, window, app: true */
define([

  "ertoc/corsOverride" ,

  "dojo/date",
  "dojo/date/locale",
  "dojo/store/Memory",
  //"dojo/request/script",
  "dojo/request/registry",
  "dojox/encoding/base64",
  "dojo/Deferred",                                                                                                        
  "dojo/dom-style", 
  "dojo/dom",
  "dijit/registry",
  "dojox/mobile/ListItem",
  "dojo/_base/json",
  "dojo/promise/all",
  "dojo/sniff"

], function (corsOverride, date, locale, Memory, request, base64, Deferred, style, dom, registry, ListItem, json, all, sniff) {
  //
  "use strict";

  //REMBER CORS is blocked on localhost in IE !!! IT WILL NOT WORK IN VS DEBUGGING !!!!! 
  //var REST_ENDPOINT = window.location.href.replace(/\/[^\/]+$/, '').replace(/\/tests/, '').replace(/http:/, '')  + '/REST';
  //var REST_ENDPOINT = '//ws002.keldan.co.uk/mobile/rest';   corsOverride(/ws002.keldan.co.uk/);
  //var REST_ENDPOINT = '//eatanddo.com/mobile/100/rest';  corsOverride(/eatanddo.com/);
  
    var REST_ENDPOINT = '//eatanddo.net/mobile/100/rest';  corsOverride(/eatanddo.net/);  
                                                         
                                                           corsOverride(/cors-test.appspot.com/);

  window.app.data = {

    currentUser: {
      userEmail:      undefined,
      sessionGuid:    undefined,
      authentication: undefined,
      authorization:  undefined
    },

    server: {
      time:                undefined,
      serverName:          undefined,
      versionInformation:  undefined 
    },

    isFetching:                 false,
                                
    latestError:                undefined,
    latestMessage:              undefined,
                                
    selectedWeek:               undefined,
    selectedDay:                undefined,
    selectedSearch:             undefined,
    selectedMatch:              undefined,
    selectedFood:               undefined,
    selectedMealTime:           undefined,
    selectedHistory:            undefined,
    selectedFoodEntry:          undefined,
    selectedMeasurementEntry:   undefined,

    weeks:              new Memory({ idProperty: 'weekDate'       }),
    days:               new Memory({ idProperty: 'dayDate'        }),
    searches:           new Memory({ idProperty: 'phrase'         }),
    foods:              new Memory({ idProperty: 'foodGuid'       }),
    histories:          new Memory({ idProperty: 'mealtime'       }),
    foodTraces:         new Memory({ idProperty: 'period'         }),    
    measurementTraces:  new Memory({ idProperty: 'period'         }),

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    clear: function() {

      var data           = window.app.data;

      data.currentUser.userEmail       = undefined;
      data.currentUser.sessionGuid     = undefined;
      data.currentUser.authentication  = undefined;
      data.currentUser.authorization   = undefined;

      data.latestError                 = undefined;
      data.latestMessage               = undefined;
                                           
      data.selectedWeek                = undefined;
      data.selectedDay                 = undefined;
      data.selectedSearch              = undefined;
      data.selectedMatch               = undefined;
      data.selectedFood                = undefined;
      data.selectedMealTime            = undefined;
      data.selectedHistory             = undefined;
      data.selectedFoodEntry           = undefined;
      data.selectedMeasurementEntry    = undefined;

      data.weeks                       = new Memory({ idProperty: 'weekDate'       });
      data.days                        = new Memory({ idProperty: 'dayDate'        });
      data.searches                    = new Memory({ idProperty: 'phrase'         });
      data.foods                       = new Memory({ idProperty: 'foodGuid'       });
      data.histories                   = new Memory({ idProperty: 'mealtime'       });    
      data.foodTraces                  = new Memory({ idProperty: 'period'         });    
      data.measurementTraces           = new Memory({ idProperty: 'period'         });    
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    startIndicator: function(data){ var node = dom.byId('imgLoading'); if (node) {style.set(node, 'display', '');    }  window.app.data.logTransfer(data); if (app.display) {app.display.disableButtons();} app.data.isFetching = true;  },
    stopIndicator:  function(data){ var node = dom.byId('imgLoading'); if (node) {style.set(node, 'display', 'none');}  window.app.data.logTransfer(data); if (app.display) {app.display.enableButtons(); } app.data.isFetching = false; },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    logTransfer: function(data){

       if (window.app.showDebug === true) {

         var node = registry.byId('listDataLog');
 
         var date = new Date();
 
         var listItem = new ListItem({
                             rightText:         date.getTime().toString().substr(6) , 
                             variableHeight:    true,
                             label:             json.toJson(data)
                        });
      
         if (node) {
           node.addChild(listItem);
         }
       }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    logError: function(error){

       if (window.app.showDebug) {
         window.alert(error);
       }

       window.app.data.latestError =  error;

       window.app.data.stopIndicator('ERROR ' + error);

       throw error;
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    accessData: function(dataEndPoint, useSecure, method){

      var protocol = 'http:';

      if (! method) {
        method = 'GET';
      }

      //DEBUGGING
      //if (window.app.showDebug){
      
        useSecure = false;

      //}

      if ( (useSecure === true) && ( REST_ENDPOINT.indexOf('localhost') === -1) ) {      
        
        if (sniff('ie'))  {
           if (! window.confirm('Because of a problem with the way Microsoft created Internet Explorer, we can not send your data over an encrypted channel to our server. Press "OK" if we can send your details UNENCRYPTED, or use another browser if you want your password encrypted. ')) {
           
              return;
           }
        } else {
           protocol = 'https:';    
        }
      }

      window.app.data.startIndicator( protocol + REST_ENDPOINT + dataEndPoint );

      return request(protocol + REST_ENDPOINT + dataEndPoint, { 
        method:                 method, 
        handleAs:              'json', 
        preventCache:           true,
        headers: {
           'X-Requested-With':  null, 
           Accept:             'application/json, text/plain, */*' 
//           ,Origin:             'eatanddo.com'
        }
      }).then( function(response){
      
        window.app.data.stopIndicator(response);

        return response;
      }, 
        
        window.app.data.logError 
      );

    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    checkVersion: function(){
     
        window.app.data.retreveVersion().then(function (/*response*/) {

              //window.app.data.logTransfer(window.app.data.server.versionInformation);
        }, function (err) { 
         
              window.alert(err);  
        });  
    },
    retreveVersion: function () {

      var data           = window.app.data;

      return data.accessData('/ping', false ).then(function (response) {

        if (response.length === 1)
        {

          data.server.time                 = response[0].time;
          data.server.serverName           = response[0].serverName;
          data.server.versionInformation   = response[0].versionInformation;

        } else {

          throw new Error();
        }
      });
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retreveUserAuthorization: function (userEmail, password) {

      var data           = window.app.data;
      var authentication = userEmail + ':' + password;
      var bytes          = authentication.getBytes();
      var baseAuth       = base64.encode(bytes);

      data.currentUser.userEmail      = userEmail;
      data.currentUser.authentication = baseAuth;

      //data.accessData('/ping');

      return data.accessData('/authorizations/' + data.currentUser.authentication, true ).then(function (response) {

        if (response.length === 1)
        {

          //var bytes          = response[0].sessionGuid.getBytes();
          //var baseAuth       = base64.encode(bytes);

          data.currentUser.sessionGuid          = response[0].sessionGuid;
          data.currentUser.authorization        = response[0].sessionGuid;
          data.currentUser.authorizationExpires = response[0].authorizationExpires;
          //data.currentUser.authorization = baseAuth;

          app.storeLocaly('sessionGuid',          response[0].sessionGuid         );
          app.storeLocaly('authorizationExpires', response[0].authorizationExpires);

        } else {

          throw new Error();
        }
      });
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retreveAnonymousAuthorization: function () {

      var data           = window.app.data;

      return data.accessData('/authorizations/anonymous').then(function (response) {

        if (response.length === 1)
        {

          //var bytes          = response[0].sessionGuid.getBytes();
          //var baseAuth       = base64.encode(bytes);

          data.currentUser.userEmail     = response[0].message;
          data.currentUser.sessionGuid   = response[0].sessionGuid;
          data.currentUser.authorization = response[0].sessionGuid;
          //data.currentUser.authorization = baseAuth;

          app.storeLocaly('sessionGuid', response[0].sessionGuid);
        } else {

          throw new Error();
        }
      });
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retrevePasswordResetStatus: function (userEmail) {

      var data           = window.app.data;
      var authentication = userEmail + ':';
      var bytes          = authentication.getBytes();
      var baseAuth       = base64.encode(bytes);

      return data.accessData('/passwordResets/' + baseAuth, true, 'POST').then(function (response) {

        if (response.length === 1)
        {

          data.latestMessage = response[0].message;
        } else {

          throw new Error();
        }
      });
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    register: function(userEmail, password) {

      var data           = window.app.data;

      var authentication = userEmail + ':' + password;
      var bytes          = authentication.getBytes();
      var baseAuth       = base64.encode(bytes);

      return data.accessData('/register/' + data.currentUser.authorization + '/' + baseAuth , true, 'POST').then(function (response) {

        if (response.length === 1)
        {
          data.currentUser.userEmail = userEmail;                                                                             
        } else {
          throw new Error();
        }
      });
     },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    denyAuthorization: function() {

      var data           = window.app.data;
                                           
      return data.accessData('/denials/' + data.currentUser.authorization, false, 'POST').then(function (response) {

        if (response.length === 1)
        {
          data.clear();                                                                                
          //null or undefined get converted to string '' gets converted to undefined
          app.storeLocaly('sessionGuid', '');  
        } else {
          throw new Error();
        }
      });
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retreveSearch: function (phrase, maxCount) {

      var data           = window.app.data;
      
      var bytes          = phrase.getBytes();
      var base64Phrase   = base64.encode(bytes);

      if (maxCount === undefined) {

        maxCount = 10;
      }

      data.selectedSearch = undefined;

      data.searches.query({phrase: phrase }).forEach(function(search){  
        
        data.selectedSearch = search; 
  
      });

      if (data.selectedSearch !== undefined) {

         var empty = new Deferred();
         
         empty.resolve(data.selectedSearch);  
         
         return empty;          
      } 
      else {
      
        return data.accessData( '/matchDetails/' + base64Phrase, {} ).then(function (response) {

          var hasNoMoreData = false;

          if (response.length < 10) {hasNoMoreData = true;}

          var newSearch  = { phrase: phrase, maxCount: maxCount, matches: response, hasNoMoreData: hasNoMoreData };

          data.searches.add(newSearch);

          data.selectedSearch = newSearch; 
        });
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retreveMoreSearchMatches: function () {

      var data           = window.app.data;

      if (data.selectedSearch === undefined) { return; }
        
      var bytes          = data.selectedSearch.phrase.getBytes();
      var base64Phrase   = base64.encode(bytes);

      data.selectedSearch.maxCount = data.selectedSearch.maxCount * 2;
      
      return data.accessData( '/matchDetails/' + base64Phrase + '/' + data.selectedSearch.maxCount, {} ).then(function (response) {

        if (response.length < data.selectedSearch.maxCount){

          data.selectedSearch.hasNoMoreData = true;
        }

        data.selectedSearch.matches = response; 
      });
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retreveHistory: function (mealtime) {

      var data           = window.app.data;      
      var duration       = 10;

      data.selectedHistory = undefined;

      mealtime = mealtime.toUpperCase();

      data.histories.query({mealtime: mealtime }).forEach(function(history){  
        
        data.selectedHistory = history; 
  
      });

      if (data.selectedHistory !== undefined) {

         var empty = new Deferred();
         
         empty.resolve(data.selectedHistory);  
         
         return empty;          
      } 
      else {
      
        return data.accessData( '/foodEntryHistory/' + data.currentUser.authorization + '/' + mealtime + '/' + duration ).then(function (response) {

          var newHistory  = { mealtime: mealtime, duration: duration, entries: response, hasNoMoreData: false };

          data.histories.add(newHistory);

          data.selectedHistory = newHistory; 
        });
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retreveMoreHistoryEntries: function () {

      var data           = window.app.data;

      var MAX_COUNT = 100;

      if (data.selectedHistory === undefined) { return; }
        
      data.selectedHistory.duration = data.selectedHistory.duration * 2;

      if (data.selectedHistory.duration > MAX_COUNT) {

        data.selectedHistory.duration = MAX_COUNT;
      }
      
        return data.accessData( '/foodEntryHistory/' + data.currentUser.authorization + '/' + data.selectedHistory.mealtime + '/' + data.selectedHistory.duration ).then(function (response) {

        if (response.length === data.selectedHistory.entries.length){

          data.selectedHistory.hasNoMoreData = true;
        }

        data.selectedHistory.entries = response; 
      });
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retreveFood: function (foodGuid){

      var data           = window.app.data;

      data.selectedFood = undefined; 

      data.foods.query({foodGuid: foodGuid }).forEach(function(food){  
        
        data.selectedFood = food; 
  
      });

      if (data.selectedFood !== undefined) {

         var empty = new Deferred();
         
         empty.resolve(data.selectedFood);  
         
         return empty;          
      } 
      else {
      
        return data.accessData( '/foodDetails/' + foodGuid, {} ).then(function (response) {

          if (response.length === 1){

            var newFood  = response[0];

            data.foods.add(newFood);

            data.selectedFood = newFood; 
          }
        });
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retreveCurrentWeek: function () {

      var data  = window.app.data;
      var today = new Date();
      var start = today.toISOString();

      return data.retreveWeek(start);

    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retrevePriorWeek: function () {

      var data  = window.app.data;

      var currentWeek = new Date(data.selectedWeek.weekDate);  

      currentWeek = date.add(currentWeek, "week", -1);

      var start = currentWeek.toISOString();

      return data.retreveWeek(start);

    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retreveNextWeek: function () {

      var data  = window.app.data;

      var currentWeek = new Date(data.selectedWeek.weekDate);  

      currentWeek = date.add(currentWeek, "week", 1);

      var start = currentWeek.toISOString();

      return data.retreveWeek(start);

    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retreveWeek: function (startISO) {
       
      var data = window.app.data;
      //months are zero based
      var start  = new Date(startISO);
      var monday = start.getDay() || 7;  

      if( monday !== 1 ) {              
          start.setHours(start.getHours() + (-24 * (monday - 1)) );   
      }    
        
      var startCode = start.toISOString()
                           .substring(0,10);                                         
      
      data.selectedWeek = undefined;

      data.weeks.query({weekDate: startCode }).forEach(function(week){  
        
        data.selectedWeek = week; 
  
      });

      if (data.selectedWeek !== undefined) {

         var empty = new Deferred();
         
         empty.resolve(data.selectedWeek);  
         
         return empty;          
      } 
      else {

        return data.accessData('/daySummaries/' + data.currentUser.authorization + '/' + startCode ).then(function (response) {
            
          var weekDate = new Date(startCode);

          var weekName = locale.format(weekDate, { datePattern: 'EEEE, d MMMM', selector: 'date' }); 

          var newWeek  = { weekDate: startCode, name: weekName, dailySummaries: response };

          data.weeks.add(newWeek);

          data.selectedWeek = newWeek; 
        });
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retrevePriorDay: function () {

      var data  = window.app.data;

      var currentDay = new Date(data.selectedDay.dayDate);  

      currentDay = date.add(currentDay, "day", -1);

      var start = currentDay.toISOString();

      return data.retreveDay(start);

    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retreveNextDay: function () {

      var data  = window.app.data;

      var currentDay = new Date(data.selectedDay.dayDate);  

      currentDay = date.add(currentDay, "day", 1);

      var start = currentDay.toISOString();

      return data.retreveDay(start);

    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retreveCurrentDay: function () {

      var data  = window.app.data;
      var today = new Date();
      var start = today.toISOString();

      return data.retreveDay(start);

    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retreveYesterday: function () {

      var data      = window.app.data;
      var today     = new Date();
      var yesterday = date.add(today, "day", -1);
      var start     = yesterday.toISOString();

      return data.retreveDay(start);
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retreveTommorow: function () {

      var data      = window.app.data;
      var today     = new Date();
      var tommorow  = date.add(today, "day", 1);
      var start     = tommorow.toISOString();

      return data.retreveDay(start);
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retreveSelectedWeekDay: function (weekDay) {

      var data = window.app.data;

      var dayDate = new Date( data.selectedWeek.weekDate );

      if      (weekDay.toLowerCase() === 'monday'   ) { dayDate = date.add(dayDate, "day", 0);  }
      else if (weekDay.toLowerCase() === 'tuesday'  ) { dayDate = date.add(dayDate, "day", 1);  }
      else if (weekDay.toLowerCase() === 'wednesday') { dayDate = date.add(dayDate, "day", 2);  }
      else if (weekDay.toLowerCase() === 'thursday' ) { dayDate = date.add(dayDate, "day", 3);  }
      else if (weekDay.toLowerCase() === 'friday'   ) { dayDate = date.add(dayDate, "day", 4);  }
      else if (weekDay.toLowerCase() === 'saturday' ) { dayDate = date.add(dayDate, "day", 5);  }
      else if (weekDay.toLowerCase() === 'sunday'   ) { dayDate = date.add(dayDate, "day", 6);  }

      return data.retreveDay(dayDate.toISOString());
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    retreveDay: function (dayISO) {

      var data = window.app.data;

      var startCode = dayISO.substring(0,10); 
      
      data.selectedDay = undefined;

      data.days.query({dayDate: startCode }).forEach(function(day){  
        
        data.selectedDay = day; 
  
      });

      if (data.selectedDay !== undefined) {

         var empty = new Deferred();
         
         empty.resolve(data.selectedDay);  
         
         return empty;          
      } 
      else {      
      
        var dayDate = new Date(startCode);

        var dayName = locale.format(dayDate, { datePattern: 'EEEE, d MMMM', selector: 'date' }); 

        var newDay  = { dayDate: startCode, name: dayName, foodEntryDetails: null,  measurementEntryDetails: null };

        data.days.add(newDay);

        data.selectedDay = newDay;          

        var foodRequest = data.accessData('/foodEntryDetails/' + data.currentUser.authorization + '/' + startCode).then(function (response) {

            newDay.foodEntryDetails = response;
        });

        var measurementRequest = data.accessData('/measurementEntryDetails/' + data.currentUser.authorization+ '/' + startCode ).then(function (response) {

          newDay.measurementEntryDetails = response;
        });

        return all([foodRequest, measurementRequest]);
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    storeFoodEntry: function(amount, unit, foodGuid, dayDate, mealTime){
    
      var data = window.app.data;

      var dayCode  = dayDate.substring(0,10); 
      var unitName = unit.replace(' ', '%20');

      return data.accessData('/foodEntry/' + data.currentUser.authorization + '/' + dayCode + '/' + mealTime + '?foodGuid=' + foodGuid + '&amount=' + amount + '&unitName=' + unitName, false, 'POST');
    }, 
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    updateFoodEntry: function(amount, unit, foodEntryGuid){
    
      var data = window.app.data;

      var unitName = unit.replace(' ', '%20');

      return data.accessData('/foodEntry/' + data.currentUser.authorization + '/' + foodEntryGuid + '?amount=' + amount + '&unitName=' + unitName, false, 'POST');
    }, 
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    updateMeasurementEntry: function(time, value, unit, measurementEntryGuid){
    
      var data = window.app.data;

      var unitName = unit.replace(' ', '%20');

      var timeParts = time.split(':');

      var minutes = timeParts[0].extractNumber()*60;

      if (timeParts[1].toLowerCase().indexOf("pm") > -1) {minutes = minutes + (60*12) ; }

      minutes = minutes + timeParts[1].extractNumber();

      return data.accessData('/measurementEntry/' + data.currentUser.authorization + '/' + measurementEntryGuid + '?' + 'minutes=' + minutes +  '&' + 'value=' + value + '&' + 'unitName=' + unitName, false, 'POST');
    }, 
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    deleteFoodEntry: function(foodEntryGuid){
    
      var data = window.app.data;

      return data.accessData('/foodEntry/' + data.currentUser.authorization + '/deleted/' + foodEntryGuid, false, 'POST');
    }, 
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    deleteMeasurementEntry: function(measurementEntryGuid){
    
      var data = window.app.data;

      return data.accessData('/measurementEntry/' + data.currentUser.authorization + '/deleted/' + measurementEntryGuid, false, 'POST');
    }, 
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    storeMeasurementEntry: function(measurement, value, unit, dayDate, time){
    
      var data = window.app.data;

      var dayCode  = dayDate.substring(0,10); 
      var unitName = unit.replace(' ', '%20');

      var timeParts = time.split(':');

      var minutes = timeParts[0].extractNumber()*60;

      if (timeParts[1].toLowerCase().indexOf("pm") > -1) {minutes = minutes + (60*12) ; }

      minutes = minutes + timeParts[1].extractNumber();

      return data.accessData('/measurementEntry/' + data.currentUser.authorization + '/' + dayCode + '/' + minutes + '?' + 'measurement=' + measurement + '&' + 'value=' + value + '&' + 'unitName=' + unitName, false, 'POST');
    }, 
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    updateEMail: function(newEmail){
    
      var data = window.app.data;

      var emailBytes         = data.currentUser.userEmail.getBytes();
      var emailBase          = base64.encode(emailBytes);

      var newEmailBytes      = newEmail.getBytes();
      var newEmailBase       = base64.encode(newEmailBytes);

      return data.accessData('/emailUpdate/' + data.currentUser.authorization + '?' + 'oldEmail=' + emailBase + '&' + 'newEmail=' + newEmailBase, true, 'POST');
    }, 
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    updatePassword: function(oldPassword, newPassword){
    
      var data = window.app.data;

      var emailBytes            = data.currentUser.userEmail.getBytes();
      var emailBase             = base64.encode(emailBytes);

      var oldPasswordBytes      = oldPassword.getBytes();
      var oldPasswordBase       = base64.encode(oldPasswordBytes);

      var newPasswordBytes      = newPassword.getBytes();
      var newPasswordBase       = base64.encode(newPasswordBytes);

      return data.accessData('/passwordUpdate/' + data.currentUser.authorization + '?' + 'Email=' + emailBase + '&' + 'oldPassword=' + oldPasswordBase + '&' + 'newPassword=' + newPasswordBase, true, 'POST');
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
  };

  return window.app.data;
});