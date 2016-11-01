/*global define, window: true */
define([
  
  "dojo/dom-style",      
  "dijit/registry",
  "dojo/parser",
  //"dojox/mobile/ViewController",
  //"dojo/_base/window",  , win
  "dojo/dom",
  "dojo/dom-construct",
  "dojo/request/xhr",
  "dojo/query",
  "dojo/_base/array",
  "dojo/promise/all",
  //"dojo/_base/lang",
  "dojo/dom-class",
  "dojo/_base/connect",
  "dojo/_base/window",
  "dojo/_base/lang",  
  "dojox/mobile"
  //"dojox/mobile/ViewController" 

], function (style, registry, parser, dom, construct, xhr, query, arrayManager, all, domClass, connect, win, lang) {
  //
  "use strict"; 

  //rewrirw of dojo method with bug in it dojox/common.js
  /*jsl:ignore*//*jslint nomen: true*//*======================================================================================*/
	var dm = lang.getObject("dojox.mobile", true);

	dm.tabletSize = 820;//500;
	dm.detectScreenSize = function(/*Boolean?*/force){
		// summary:
		//		Detects the screen size and determines if the screen is like
		//		phone or like tablet. If the result is changed,
		//		it sets either of the following css class to `<html>`:
		//
		//		- 'dj_phone'
		//		- 'dj_tablet'
		//
		//		and it publishes either of the following events:
		//
		//		- '/dojox/mobile/screenSize/phone'
		//		- '/dojox/mobile/screenSize/tablet'

		var dim = dm.getScreenSize();
		var sz = dim.w; //Math.max(dim.w, dim.h);
		var from, to;
		if(sz >= dm.tabletSize && (force || (!this._sz || this._sz < dm.tabletSize))){
			from = "phone";
			to = "tablet";
		}else if(sz < dm.tabletSize && (force || (!this._sz || this._sz >= dm.tabletSize))){
			from = "tablet";
			to = "phone";
		}
		if(to){
			domClass.replace(win.doc.documentElement, "dj_"+to, "dj_"+from);
			connect.publish("/dojox/mobile/screenSize/"+to, [dim]);
		}
		this._sz = sz;
	};
	dm.detectScreenSize();
  /*jsl:end*/ /*jslint nomen: false*//*======================================================================================*/

  window.app = {     

    showDebug: false,

    tabletSize: dm.tabletSize,   //820
    phoneSize:  480,
                                     
    initilize: function () { 

      String.prototype.getBytes = function () { 

        var bytes = []; 
        var i;

        for (i = 0; i < this.length; i += 1) { 
          bytes.push(this.charCodeAt(i)); 
        } 
        return bytes; 
      }; 

      String.prototype.extractNumber = function () { 
 
        return parseFloat(this.match(/[\d\.]+/)); 
      }; 

      String.prototype.capitalizeWords = function () { 
         
         var words = this.split(" "); 
         var i;

         for (i=0 ; i < words.length ; i = i+1){
            
            var currentWord = words[i];
            
            var firstLeter = currentWord.substr(0,1);  
            
            var restOfWord = currentWord.substr(1, currentWord.length -1);

            var capatilizedWord = firstLeter.toUpperCase() + restOfWord.toLowerCase();

            if       (capatilizedWord === 'Kg'  ) {capatilizedWord = 'kg';  }
            else if  (capatilizedWord === 'Mmhg') {capatilizedWord = 'mmHg';}
            
            words[i] = capatilizedWord;   
         }         
         
         return words.join(" ");
      };

      window.onresize       = window.app.display.resize;
      window.onbeforeunload = window.app.checkBeforeUnload;

      query(".ShowOnConnect").forEach(function(node){
         style.set(node, 'display', 'none');
      });

      query(".ShowOnDisconnect").forEach(function(node){
         style.set(node, 'display', '');
      });

      if (window.app.showDebug !== true) {

        style.set(dom.byId('listItemDataLogHeading'), 'display', 'none');
        style.set(dom.byId('listItemDataLogMenu'),    'display', 'none');
      }
    },  
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    loadForms: function(){

      var load01 = window.app.loadView('ExistingUser',                  'viewExistingUser'                    );
      var load02 = window.app.loadView('AnonymousUser',                 'viewAnonymousUser'                   );
      var load03 = window.app.loadView('Logout',                        'viewLogout'                          );
      var load04 = window.app.loadView('ResetPassword',                 'viewResetPassword'                   );
                                                                                                
      var load05 = window.app.loadView('WeeklyFoodSummaries',           'viewWeeklyFoodSummaries'             );
      var load06 = window.app.loadView('WeeklyMeasurementSummaries',    'viewWeeklyMeasurementSummaries'      );

      var load07 = window.app.loadView('DailyFoodEntries',              'viewDailyFoodEntries'                );
      var load08 = window.app.loadView('DailyMeasurementEntries',       'viewDailyMeasurementEntries'         );

      var load09 = window.app.loadView('NewFoodEntryOptions',           'viewNewFoodEntryOptions'             );
      var load10 = window.app.loadView('NewMeasurementEntryOptions',    'viewNewMeasurementEntryOptions'      );

      var load11 = window.app.loadView('NewFoodEntrySource',            'viewNewFoodEntrySource'              );
      var load12 = window.app.loadView('SearchFood',                    'viewSearchFood'                      );
      var load13 = window.app.loadView('NewFoodEntryAmount',            'viewNewFoodEntryAmount'              );
      var load14 = window.app.loadView('FoodDetails',                   'viewFoodDetails'                     );
        
      var load15 = window.app.loadView('FoodEntryHistory',              'viewFoodEntryHistory'                );
        
      var load16 = window.app.loadView('NewMeasurementEntryOptions',    'viewNewMeasurementEntryOptions'      );
      var load17 = window.app.loadView('NewMeasurementEntryAmount',     'viewNewMeasurementEntryAmount'       );
        
      var load18 = window.app.loadView('UpdateFoodEntry',               'viewUpdateFoodEntry'                 );
      var load19 = window.app.loadView('UpdateMeasurementEntry',        'viewUpdateMeasurementEntry'          );
                                                                                                       
      //var load20 = window.app.loadView('FoodCharts',                    'viewFoodCharts'                      );
      //var load21 = window.app.loadView('MeasurementCharts',             'viewMeasurementCharts'               );
        
      var load22 = window.app.loadView('ChangeEMail',                    'viewChangeEMail'                    );
      var load23 = window.app.loadView('ChangePassword',                 'viewChangePassword'                 );

      all([
        load01,load02,load03,load04,load05,load06,load07,load08,load09,load10,
        load11,load12,load13,load14,load15,load16,load17,load18,load19, 
        //,load20,load21 
        load22, load23 
      ]).then( window.app.prepairUI );   

      window.app.data.retreveVersion(). then( function(){

        var target = dom.byId('divServerInfo'); if (target) { target.innerHTML = 'Version ' + window.app.data.server.versionInformation + ' ' + window.app.data.server.serverName;    }
      });
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    storeLocaly:   function(name, value){
      if (window.localStorage !== null) {return window.localStorage.setItem(name, value);}
    },
    retreveLocaly:   function(name){
      if (window.localStorage !== null) {return window.localStorage.getItem(name);}
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    prepairUI: function(){

      var app            = window.app;
      var data           = window.app.data;
      
      var target;
      var userName;
      var sessionGuid;
      var authorizationExpires;
      var now;
      var expires;

      var password = '';

      userName             = app.retreveLocaly('userName');
      sessionGuid          = app.retreveLocaly('sessionGuid'); 
      authorizationExpires = app.retreveLocaly('authorizationExpires');

      if (sessionGuid){

        now     = new Date();
        expires = new Date(authorizationExpires);

        if(now > expires){

          sessionGuid          = undefined;
          authorizationExpires = undefined;

        }
      }

      if ((userName    === null) || (userName    === undefined)  ) { userName = '';           } 
      if ((sessionGuid === null) || (sessionGuid === ''       )  ) { sessionGuid = undefined; } 

      if (window.app.showDebug) {
        userName    = 'test.user.1@keldan.co.uk';
        password    = 'aaa';
        sessionGuid = undefined;
      }

      data.currentUser.userEmail     = userName;
      data.currentUser.sessionGuid   = sessionGuid;
      data.currentUser.authorization = sessionGuid;

      dom.byId('inputUserEmail').value = userName;
      dom.byId('inputPassword').value  = password;

      target = registry.byId('valuePickerNewFoodUnit'          ); if (target) { target.watch( 'value', window.app.display.adjustValuePicker );    }
      target = registry.byId('valuePickerUpdateFoodUnit'       ); if (target) { target.watch( 'value', window.app.display.adjustValuePicker );    }
      target = registry.byId('valuePickerNewMeasurementUnit'   ); if (target) { target.watch( 'value', window.app.display.adjustValuePicker );    }
      target = registry.byId('valuePickerUpdateMeasurementUnit'); if (target) { target.watch( 'value', window.app.display.adjustValuePicker );    }
 
      window.app.display.resize();

      style.set('divSplashScreen', 'display', 'none');

      if (sessionGuid !== undefined){

        app.actions.reConnect();
        app.displayView('viewWeeklyFoodSummaries');
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    checkBeforeUnload: function(e) {
      
      var data = window.app.data;
     
      if ( (data) && (data.currentUser) && (data.currentUser.sessionGuid) ){

        var message = 'The back button moves to the previous webpage'; 

        if (! e) {
          
          e = window.event;
        }

        e.returnValue = message;

        // IE
        e.cancelBubble = true;

        //e.stopPropagation works in Firefox.
        if (e.stopPropagation) {
            e.stopPropagation();
            e.preventDefault();
        }

        // Chrome
        return message;
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    displayView: function(viewName, transition){

      var displayView  = registry.byId(viewName);
      var showingview  = displayView.getShowingView();

      if (transition === undefined) {
        
        transition = 'slide'; 
      }

      if (showingview !== displayView) {
        
        showingview.performTransition('#' + viewName, 1, transition);
      }
    }, 
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    loadView: function(sourceName, targetName){ 
      //
      var sourceUrl = './views/' + sourceName + '.htm';
      //
      return xhr(sourceUrl, { 
        method:      'GET', 
        handleAs:    'text', 
        preventCache: false 
      }).then( function(response){
        //
        var container = registry.byId(targetName).containerNode;
        var target;
        //
        if (container === undefined){
          //
          window.alert(targetName + ' missing');
        }
        //
        container.innerHTML = response;
        //
        parser.parse(container);
        //
        if (window.app.showDebug) {

         target = registry.byId(targetName);

         if (target){

          arrayManager.forEach(target.getChildren(), function(child){ 
            
            if( child.baseClass ===	'mblHeading'){

              child.set('label', child.get('label') + ' [' + targetName + ']');
            }
          });         
         }
        }
      }, function(error, ioArgs){
         window.alert(error + ":" + ioArgs);
      });
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    showDialog: function (Dialog, goToView) {
      
      var dialog = registry.byId(Dialog);

      dialog.goToView = goToView;
       
      dialog.show();   
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    hideDialog: function (Dialog) {
      
      var dialog = registry.byId(Dialog);

      dialog.hide();  
      
      if (dialog.goToView !== undefined){ 

        window.app.displayView(dialog.goToView, 'fade');
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    trace: function(Message){

       if (this.showDebug && dom.byId('divTrace')) {

         construct.place('<div>' + Message + '</div>', 'divTrace', 'last');
       }
    }, 
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    actionOnEnterKey: function(input, event, action, viewName){

       var key = event.keyIdentifier;

       if (! key) {key = event.key;}

       if ( (input) && (event) && (action) && (key === "Enter") ) {
         
         input.blur();

         action();

         if (viewName) {
         
           window.app.displayView(viewName);
         }
       }
    }, 
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    focusOnEnterKey: function(input, event, elementID){

       var key  = event.keyIdentifier;   
       var item = dom.byId(elementID);

       if (! key) {key = event.key;} 

       if ( (input) && (event) && (elementID) && (item) && (key === "Enter") ) {
         
         input.blur();
           
         item.focus();
       }
    } 
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
  };
 
  return window.app;
});



  


