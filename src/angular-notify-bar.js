angular.module('angular-notify-bar', []).factory('NotifyBar', ["$document", "$compile", "$rootScope", "$controller", "$timeout",
  function ($document, $compile, $rootScope, $controller, $timeout) {
    var defaults = {
      id: null,
      template: null,
      templateUrl: null,
      backdrop: true,
      controller: null, //just like route controller declaration
      backdropClass: "-backdrop",
      backdropCancel: true,
      modalClass: "modal",
      timeout: 5,
      message: false
    };
    var body = $document.find('body');

    return function Dialog(templateUrl/*optional*/, options, passedInLocals) {

      // Handle arguments if optional template isn't provided.
      if(angular.isObject(templateUrl)){
        passedInLocals = options;
        options = templateUrl;
      } else {
        options.templateUrl = templateUrl;
      }

      options = angular.extend({}, defaults, options); //options defined in constructor

      var idAttr = options.id ? ' id="' + options.id + '" ' : '';
      var modalBody = (function(){
         if(!options.template && !options.templateUrl)
         {
             return '';
         }

        if(options.template){
          if(angular.isString(options.template)){
            // Simple string template
            return '<div class="' + options.modalClass + '-body">' + options.template + '</div>';
          } else {
            // jQuery/JQlite wrapped object
            return '<div class="' + options.modalClass + '-body">' + options.template.html() + '</div>';
          }
        } else {
          // Template url
          return '<div class="' + options.modalClass + '-body" ng-include="\'' + options.templateUrl + '\'"></div>'
        }
      })();
      //We don't have the scope we're gonna use yet, so just get a compile function for modal
      var modalEl = angular.element(
                '<div class="' + options.modalClass + '"' + idAttr + '>' +
                    '  <div class="' + options.modalClass + '-dialog" ng-click="$modalClose()">' +
                    '    <div class="' + options.modalClass + '-content">' +
                    '        <button type="button" class="close" ng-click="$modalClose()">&times;</button>' +
                              modalBody + options.message +
                    '    </div>' +
                    '  </div>' +
                    '</div>');

      var divHTML = "<div ";
      if(options.backdropCancel){
        divHTML+='ng-click="$modalClose()"';
      }
      divHTML+=">";
      var backdropEl = angular.element(divHTML);
      backdropEl.addClass(options.modalClass + options.backdropClass);

      var handleEscPressed = function (event) {
        if (event.keyCode === 27) {
            scope.$modalClose();
        }
      };

      var closeFn = function () {
          if(options.backdrop)
          {
            body.unbind('keydown', handleEscPressed);
          }

        modalEl.remove();
        if (options.backdrop) {
          backdropEl.remove();
        }
      };

       if(options.backdrop)
       {
        body.bind('keydown', handleEscPressed);
       }

      var ctrl, locals,
        scope = options.scope || $rootScope.$new();

      scope.$modalClose = closeFn;

      if (options.controller) {
        locals = angular.extend({$scope: scope}, passedInLocals);
        ctrl = $controller(options.controller, locals);
        // Yes, ngControllerController is not a typo
        modalEl.contents().data('$ngControllerController', ctrl);
      }

      $compile(modalEl)(scope);
      $compile(backdropEl)(scope);
      body.append(modalEl);
      if (options.backdrop) body.append(backdropEl);

        if(options.timeout)
        {
            var ctrl = this, timeoutId;
            ctrl.tickCount = options.timeout;

            function tick() {
                timeoutId = $timeout(function() {
                    ctrl.tickCount -= 1;
                    if (ctrl.tickCount <= 0) {
                        scope.$modalClose();
                    } else {
                        tick();
                    }
                }, 1000);
            }

            function cancelTick() {
                $timeout.cancel(timeoutId);
            }

            scope.$on('$destroy', cancelTick);

            tick()
        }
    };
  }]);