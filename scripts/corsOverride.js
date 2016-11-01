/*global define, window, XDomainRequest, ActiveXObject: true */

define([
    "dojo/Deferred",
    "dojo/request/registry",
    "dojo/request/xhr",
    "dojo/_base/array"
], function( Deferred, request, xhr, arrayManager) {
  //
  "use strict"; 
 
   var self = {
   
    xdr: function (url, options) {
        
        var def = new Deferred();
        var xdr = new XDomainRequest();

        if (xdr) {

            if (options.preventCache) {

              var postScript = 'request.preventCache=' + Math.random().toString().replace('0.', ''); 

              if (url.indexOf('?') === -1){

                postScript = '?' + postScript;
              } else {

                postScript = '&' + postScript;
              }

              url = url + postScript;
            }

            try
            {
              //var status = 
              xdr.open(options.method || "GET", url); 

              xdr.onload = function() {

                if (options.handleAs.toLowerCase() === 'text') { 

                    def.resolve( xdr.responseText );

                } else if (options.handleAs.toLowerCase() === 'json')  { 

                    var result;

                    if  ((xdr.responseText) && (xdr.responseText !== '')) {
                      result = JSON.parse(xdr.responseText);
                    }

                    def.resolve( result );

                } else if (options.handleAs.toLowerCase() === 'xml')  { 

                    var response; 

                    if (window.DOMParser) { 
                        var parser = new window.DOMParser(); 
                        response = parser.parseFromString(xdr.responseText, "text/xml");
                    } else { 
                        response = new ActiveXObject("Microsoft.XMLDOM"); 
                        response.async = false; 
                        response.loadXML(xdr.responseText); 
                    } 

                    def.resolve(response); 

                } else {

                  def.resolve( xdr.responseText );
                }    
              };

              xdr.onerror = function(e) {
                  def.reject(new Error(e));
              };

              xdr.ontimeout = function(e){
                  def.reject(new Error(e));
              };

              xdr.onprogress = function() {
              };

              arrayManager.forEach(options.query, function(queryParam){
                  url += (url.indexOf('?') !== -1) ? '&' : '?'; 
                  url += queryParam + '=' + options.query[queryParam]; 
              }); 

              if (options.preventCache) { 
                  url += (url.indexOf('?') !== -1) ? '&' : '?'; 
                  url += '_cb=' + new Date().getTime(); 
              } 

              xdr.timeout = 50000;//1000000;

              xdr.send(); 
              //delay for setup may help
              //setTimeout(function(){
              //    xdr.send();
              //}, 200);

            }
            catch(err)
            {
               window.alert(err);
            }

            return def;
        }

        def.reject(new Error('XDomainRequest not supported.'));
        return def;
    },
  
    corsProvider: function (url, options) {
           
        if(window.XDomainRequest) {
            
            return self.xdr(url, options);
        }
        
        return xhr(url, options);
    },

    corsRegester: function(filter){
        return request.register(filter, self.corsProvider);
    }
  
  };

  return self.corsRegester;
    
});