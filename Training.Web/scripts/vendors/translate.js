/**
 * @ngdoc overview
 * @name pascalprecht.translate
 *
 * @description
 * The main module which holds everything together.
 */
angular.module('pascalprecht.translate', ['ng'])

.run(['$translate', function ($translate) {

  var key = $translate.storageKey(),
      storage = $translate.storage();

  if (storage) {
    if (!storage.get(key)) {

      if (angular.isString($translate.preferredLanguage())) {
        $translate.use($translate.preferredLanguage());
        // $translate.use() will also remember the language.
        // So, we don't need to call storage.set() here.
      } else {
        storage.set(key, $translate.use());
      }

    } else {
      $translate.use(storage.get(key));
    }
  } else if (angular.isString($translate.preferredLanguage())) {
    $translate.use($translate.preferredLanguage());
  }
}]);

angular.module('pascalprecht.translate')
/**
 * @ngdoc directive
 * @name pascalprecht.translate.directive:translateCloak
 * @requires $rootScope
 * @requires $translate
 * @restrict A
 *
 * $description
 * Adds a `translate-cloak` class name to the given element where this directive
 * is applied initially and removes it, once a loader has finished loading.
 *
 * This directive can be used to prevent initial flickering when loading translation
 * data asynchronously.
 *
 * @param {string=} translate-cloak No string required
 */
.directive('translateCloak', ['$rootScope', '$translate', function ($rootScope, $translate) {

  return {
    compile: function (tElement) {
      $rootScope.$on('$translateLoadingSuccess', function () {
        tElement.removeClass($translate.cloakClassName());
      });
      tElement.addClass($translate.cloakClassName());
    }
  };
}]);

angular.module('pascalprecht.translate')
/**
 * @ngdoc directive
 * @name pascalprecht.translate.directive:translate
 * @requires $compile
 * @requires $filter
 * @requires $interpolate
 * @restrict A
 *
 * @description
 * Translates given translation id either through attribute or DOM content.
 * Internally it uses `translate` filter to translate translation id. It possible to
 * pass an optional `translate-values` object literal as string into translation id.
 *
 * @param {string=} translate Translation id which could be either string or interpolated string.
 * @param {string=} translate-values Values to pass into translation id. Can be passed as object literal string or interpolated object.
 *
 * @example
   <example module="ngView">
    <file name="index.html">
      <div ng-controller="TranslateCtrl">

        <pre translate="TRANSLATION_ID"></pre>
        <pre translate>TRANSLATION_ID</pre>
        <pre translate="{{translationId}}"></pre>
        <pre translate>{{translationId}}</pre>
        <pre translate="WITH_VALUES" translate-values="{value: 5}"></pre>
        <pre translate translate-values="{value: 5}">WITH_VALUES</pre>
        <pre translate="WITH_VALUES" translate-values="{{values}}"></pre>
        <pre translate translate-values="{{values}}">WITH_VALUES</pre>

      </div>
    </file>
    <file name="script.js">
      angular.module('ngView', ['pascalprecht.translate'])

      .config(function ($translateProvider) {

        $translateProvider.translations({
          'TRANSLATION_ID': 'Hello there!',
          'WITH_VALUES': 'The following value is dynamic: {{value}}'
        });

      });

      angular.module('ngView').controller('TranslateCtrl', function ($scope) {
        $scope.translationId = 'TRANSLATION_ID';

        $scope.values = {
          value: 78
        };
      });
    </file>
    <file name="scenario.js">
      it('should translate', function () {
        inject(function ($rootScope, $compile) {
          $rootScope.translationId = 'TRANSLATION_ID';

          element = $compile('<p translate="TRANSLATION_ID"></p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p translate="{{translationId}}"></p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p translate>TRANSLATION_ID</p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p translate>{{translationId}}</p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');
        });
      });
    </file>
   </example>
 */
.directive('translate', ['$translate', '$q', '$interpolate', '$compile', '$parse', '$rootScope', function ($translate, $q, $interpolate, $compile, $parse, $rootScope) {

  return {
    restrict: 'AE',
    scope: true,
    compile: function (tElement, tAttr) {

      var translateValuesExist = (tAttr.translateValues) ?
        tAttr.translateValues : undefined;

      var translateInterpolation = (tAttr.translateInterpolation) ?
        tAttr.translateInterpolation : undefined;

      var translateValueExist = tElement[0].outerHTML.match(/translate-value-+/i);

      return function linkFn(scope, iElement, iAttr) {

        scope.interpolateParams = {};

        // Ensures any change of the attribute "translate" containing the id will
        // be re-stored to the scope's "translationId".
        // If the attribute has no content, the element's text value (white spaces trimmed off) will be used.
        iAttr.$observe('translate', function (translationId) {
          if (angular.equals(translationId , '') || !angular.isDefined(translationId)) {
            scope.translationId = $interpolate(iElement.text().replace(/^\s+|\s+$/g,''))(scope.$parent);
          } else {
            scope.translationId = translationId;
          }
        });

        iAttr.$observe('translateDefault', function (value) {
          scope.defaultText = value;
        });

        if (translateValuesExist) {
          iAttr.$observe('translateValues', function (interpolateParams) {
            if (interpolateParams) {
              scope.$parent.$watch(function () {
                angular.extend(scope.interpolateParams, $parse(interpolateParams)(scope.$parent));
              });
            }
          });
        }

        if (translateValueExist) {
          var fn = function (attrName) {
            iAttr.$observe(attrName, function (value) {
              scope.interpolateParams[angular.lowercase(attrName.substr(14, 1)) + attrName.substr(15)] = value;
            });
          };
          for (var attr in iAttr) {
            if (iAttr.hasOwnProperty(attr) && attr.substr(0, 14) === 'translateValue' && attr !== 'translateValues') {
              fn(attr);
            }
          }
        }

        var applyElementContent = function (value, scope, successful) {
          if (!successful && typeof scope.defaultText !== 'undefined') {
            value = scope.defaultText;
          }
          iElement.html(value);
          var globallyEnabled = $translate.isPostCompilingEnabled();
          var locallyDefined = typeof tAttr.translateCompile !== 'undefined';
          var locallyEnabled = locallyDefined && tAttr.translateCompile !== 'false';
          if ((globallyEnabled && !locallyDefined) || locallyEnabled) {
            $compile(iElement.contents())(scope);
          }
        };

        var updateTranslationFn = (function () {
          if (!translateValuesExist && !translateValueExist) {
            return function () {
              var unwatch = scope.$watch('translationId', function (value) {
                if (scope.translationId && value) {
                  $translate(value, {}, translateInterpolation)
                    .then(function (translation) {
                      applyElementContent(translation, scope, true);
                      unwatch();
                    }, function (translationId) {
                      applyElementContent(translationId, scope, false);
                      unwatch();
                    });
                }
              }, true);
            };
          } else {
            return function () {

              var updateTranslations = function () {
                if (scope.translationId && scope.interpolateParams) {
                  $translate(scope.translationId, scope.interpolateParams, translateInterpolation)
                    .then(function (translation) {
                      applyElementContent(translation, scope, true);
                    }, function (translationId) {
                      applyElementContent(translationId, scope, false);
                    });
                  }
              };

              // watch both interpolateParams and translationId, because watchers are triggered non-deterministic
              scope.$watch('interpolateParams', updateTranslations, true);
              scope.$watch('translationId', updateTranslations);
            };
          }
        }());

        // Ensures the text will be refreshed after the current language was changed
        // w/ $translate.use(...)
        var unbind = $rootScope.$on('$translateChangeSuccess', updateTranslationFn);

        updateTranslationFn();
        scope.$on('$destroy', unbind);
      };
    }
  };
}]);

angular.module('pascalprecht.translate')
/**
 * @ngdoc filter
 * @name pascalprecht.translate.filter:translate
 * @requires $parse
 * @requires pascalprecht.translate.$translate
 * @function
 *
 * @description
 * Uses `$translate` service to translate contents. Accepts interpolate parameters
 * to pass dynamized values though translation.
 *
 * @param {string} translationId A translation id to be translated.
 * @param {*=} interpolateParams Optional object literal (as hash or string) to pass values into translation.
 *
 * @returns {string} Translated text.
 *
 * @example
   <example module="ngView">
    <file name="index.html">
      <div ng-controller="TranslateCtrl">

        <pre>{{ 'TRANSLATION_ID' | translate }}</pre>
        <pre>{{ translationId | translate }}</pre>
        <pre>{{ 'WITH_VALUES' | translate:'{value: 5}' }}</pre>
        <pre>{{ 'WITH_VALUES' | translate:values }}</pre>

      </div>
    </file>
    <file name="script.js">
      angular.module('ngView', ['pascalprecht.translate'])

      .config(function ($translateProvider) {

        $translateProvider.translations({
          'TRANSLATION_ID': 'Hello there!',
          'WITH_VALUES': 'The following value is dynamic: {{value}}'
        });

      });

      angular.module('ngView').controller('TranslateCtrl', function ($scope) {
        $scope.translationId = 'TRANSLATION_ID';

        $scope.values = {
          value: 78
        };
      });
    </file>
   </example>
 */
.filter('translate', ['$parse', '$translate', function ($parse, $translate) {
  return function (translationId, interpolateParams, interpolation) {

    if (!angular.isObject(interpolateParams)) {
      interpolateParams = $parse(interpolateParams)(this);
    }

    return $translate.instant(translationId, interpolateParams, interpolation);
  };
}]);

/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateDefaultInterpolation
 * @requires $interpolate
 *
 * @description
 * Uses angular's `$interpolate` services to interpolate strings against some values.
 *
 * @return {object} $translateInterpolator Interpolator service
 */
angular.module('pascalprecht.translate').factory('$translateDefaultInterpolation', ['$interpolate', function ($interpolate) {

  var $translateInterpolator = {},
      $locale,
      $identifier = 'default',
      $sanitizeValueStrategy = null,
      // map of all sanitize strategies
      sanitizeValueStrategies = {
        escaped: function (params) {
          var result = {};
          for (var key in params) {
            if (params.hasOwnProperty(key)) {
              result[key] = angular.element('<div></div>').text(params[key]).html();
            }
          }
          return result;
        }
      };

  var sanitizeParams = function (params) {
    var result;
    if (angular.isFunction(sanitizeValueStrategies[$sanitizeValueStrategy])) {
      result = sanitizeValueStrategies[$sanitizeValueStrategy](params);
    } else {
      result = params;
    }
    return result;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateDefaultInterpolation#setLocale
   * @methodOf pascalprecht.translate.$translateDefaultInterpolation
   *
   * @description
   * Sets current locale (this is currently not use in this interpolation).
   *
   * @param {string} locale Language key or locale.
   */
  $translateInterpolator.setLocale = function (locale) {
    $locale = locale;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateDefaultInterpolation#getInterpolationIdentifier
   * @methodOf pascalprecht.translate.$translateDefaultInterpolation
   *
   * @description
   * Returns an identifier for this interpolation service.
   *
   * @returns {string} $identifier
   */
  $translateInterpolator.getInterpolationIdentifier = function () {
    return $identifier;
  };

  $translateInterpolator.useSanitizeValueStrategy = function (value) {
    $sanitizeValueStrategy = value;
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateDefaultInterpolation#interpolate
   * @methodOf pascalprecht.translate.$translateDefaultInterpolation
   *
   * @description
   * Interpolates given string agains given interpolate params using angulars
   * `$interpolate` service.
   *
   * @returns {string} interpolated string.
   */
  $translateInterpolator.interpolate = function (string, interpolateParams) {
    if ($sanitizeValueStrategy) {
      interpolateParams = sanitizeParams(interpolateParams);
    }
    return $interpolate(string)(interpolateParams || {});
  };

  return $translateInterpolator;
}]);

angular.module('pascalprecht.translate')

/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateMissingTranslationHandlerLog
 * @requires $log
 *
 * @description
 * Uses angular's `$log` service to give a warning when trying to translate a
 * translation id which doesn't exist.
 *
 * @returns {function} Handler function
 */
.factory('$translateMissingTranslationHandlerLog', ['$log', function ($log) {

  return function (translationId) {
    $log.warn('Translation for ' + translationId + ' doesn\'t exist');
  };
}]);

angular.module('pascalprecht.translate')
/**
 * @ngdoc object
 * @name pascalprecht.translate.$translatePartialLoaderProvider
 *
 * @description
 * By using a $translatePartialLoaderProvider you can configure a list of a needed
 * translation parts directly during the configuration phase of your application's
 * lifetime. All parts you add by using this provider would be loaded by
 * angular-translate at the startup as soon as possible.
 */
.provider('$translatePartialLoader', function() {

  /**
   * @constructor
   * @name Part
   *
   * @description
   * Represents Part object to add and set parts at runtime.
   */
  function Part(name) {
    this.name = name;
    this.isActive = true;
    this.tables = {};
  }

  /**
   * @name parseUrl
   * @method
   *
   * @description
   * Returns a parsed url template string and replaces given target lang
   * and part name it.
   *
   * @param {string} urlTemplate Url pattern to use.
   * @param {string} targetLang Language key for language to be used.
   * @return {string} Parsed url template string
   */
  Part.prototype.parseUrl = function(urlTemplate, targetLang) {
    return urlTemplate.replace(/\{part\}/g, this.name).replace(/\{lang\}/g, targetLang);
  };

  Part.prototype.getTable = function(lang, $q, $http, urlTemplate, errorHandler) {
    var deferred = $q.defer();

    if (!this.tables[lang]) {
      var self = this;

      $http({
        method : 'GET',
        url : this.parseUrl(urlTemplate, lang)
      }).success(function(data){
        self.tables[lang] = data;
        deferred.resolve(data);
      }).error(function() {
        if (errorHandler) {
          errorHandler(self.name, lang).then(function(data) {
            self.tables[lang] = data;
            deferred.resolve(data);
          }, function() {
            deferred.reject(self.name);
          });
        } else {
          deferred.reject(self.name);
        }
      });

    } else {
      deferred.resolve(this.tables[lang]);
    }
    return deferred.promise;
  };

  var parts = {};

  function hasPart(name) {
    return parts.hasOwnProperty(name);
  }

  function isStringValid(str) {
    return angular.isString(str) && str !== '';
  }

  function isPartAvailable(name) {
    if (!isStringValid(name)) {
      throw new TypeError('Invalid type of a first argument, a non-empty string expected.');
    }

    return (hasPart(name) && parts[name].isActive);
  }

  function deepExtend(dst, src) {
    for (var property in src) {
      if (src[property] && src[property].constructor &&
       src[property].constructor === Object) {
        dst[property] = dst[property] || {};
        deepExtend(dst[property], src[property]);
      } else {
        dst[property] = src[property];
      }
    }
    return dst;
  }


  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translatePartialLoaderProvider#addPart
   * @methodOf pascalprecht.translate.$translatePartialLoaderProvider
   *
   * @description
   * Registers a new part of the translation table to be loaded once the
   * `angular-translate` gets into runtime phase. It does not actually load any
   * translation data, but only registers a part to be loaded in the future.
   *
   * @param {string} name A name of the part to add
   * @returns {object} $translatePartialLoaderProvider, so this method is chainable
   * @throws {TypeError} The method could throw a **TypeError** if you pass the param
   * of the wrong type. Please, note that the `name` param has to be a
   * non-empty **string**.
   */
  this.addPart = function(name) {
    if (!isStringValid(name)) {
      throw new TypeError('Couldn\'t add part, part name has to be a string!');
    }

    if (!hasPart(name)) {
      parts[name] = new Part(name);
    }
    parts[name].isActive = true;

    return this;
  };

  /**
   * @ngdocs function
   * @name pascalprecht.translate.$translatePartialLoaderProvider#setPart
   * @methodOf pascalprecht.translate.$translatePartialLoaderProvider
   *
   * @description
   * Sets a translation table to the specified part. This method does not make the
   * specified part available, but only avoids loading this part from the server.
   *
   * @param {string} lang A language of the given translation table
   * @param {string} part A name of the target part
   * @param {object} table A translation table to set to the specified part
   *
   * @return {object} $translatePartialLoaderProvider, so this method is chainable
   * @throws {TypeError} The method could throw a **TypeError** if you pass params
   * of the wrong type. Please, note that the `lang` and `part` params have to be a
   * non-empty **string**s and the `table` param has to be an object.
   */
  this.setPart = function(lang, part, table) {
    if (!isStringValid(lang)) {
      throw new TypeError('Couldn\'t set part.`lang` parameter has to be a string!');
    }
    if (!isStringValid(part)) {
      throw new TypeError('Couldn\'t set part.`part` parameter has to be a string!');
    }
    if (typeof table !== 'object' || table === null) {
      throw new TypeError('Couldn\'t set part. `table` parameter has to be an object!');
    }

    if (!hasPart(part)) {
      parts[part] = new Part(part);
      parts[part].isActive = false;
    }

    parts[part].tables[lang] = table;
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translatePartialLoaderProvider#deletePart
   * @methodOf pascalprecht.translate.$translatePartialLoaderProvider
   *
   * @description
   * Removes the previously added part of the translation data. So, `angular-translate` will not
   * load it at the startup.
   *
   * @param {string} name A name of the part to delete
   *
   * @returns {object} $translatePartialLoaderProvider, so this method is chainable
   *
   * @throws {TypeError} The method could throw a **TypeError** if you pass the param of the wrong
   * type. Please, note that the `name` param has to be a non-empty **string**.
   */
  this.deletePart = function(name) {
    if (!isStringValid(name)) {
      throw new TypeError('Couldn\'t delete part, first arg has to be string.');
    }

    if (hasPart(name)) {
      parts[name].isActive = false;
    }

    return this;
  };


  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translatePartialLoaderProvider#isPartAvailable
   * @methodOf pascalprecht.translate.$translatePartialLoaderProvider
   *
   * @description
   * Checks if the specific part is available. A part becomes available after it was added by the
   * `addPart` method. Available parts would be loaded from the server once the `angular-translate`
   * asks the loader to that.
   *
   * @param {string} name A name of the part to check
   *
   * @returns {boolean} Returns **true** if the part is available now and **false** if not.
   *
   * @throws {TypeError} The method could throw a **TypeError** if you pass the param of the wrong
   * type. Please, note that the `name` param has to be a non-empty **string**.
   */
  this.isPartAvailable = isPartAvailable;

  /**
   * @ngdoc object
   * @name pascalprecht.translate.$translatePartialLoader
   *
   * @requires $q
   * @requires $http
   * @requires $injector
   * @requires $rootScope
   *
   * @description
   *
   * @param {object} options Options object
   *
   * @throws {TypeError}
   */
  this.$get = ['$rootScope', '$injector', '$q', '$http',
  function($rootScope, $injector, $q, $http) {

    /**
     * @ngdoc event
     * @name pascalprecht.translate.$translatePartialLoader#$translatePartialLoaderStructureChanged
     * @eventOf pascalprecht.translate.$translatePartialLoader
     * @eventType broadcast on root scope
     *
     * @description
     * A $translatePartialLoaderStructureChanged event is called when a state of the loader was
     * changed somehow. It could mean either some part is added or some part is deleted. Anyway when
     * you get this event the translation table is not longer current and has to be updated.
     *
     * @param {string} name A name of the part which is a reason why the event was fired
     */

    var service = function(options) {
      if (!isStringValid(options.key)) {
        throw new TypeError('Unable to load data, a key is not a non-empty string.');
      }

      if (!isStringValid(options.urlTemplate)) {
        throw new TypeError('Unable to load data, a urlTemplate is not a non-empty string.');
      }

      var errorHandler = options.loadFailureHandler;
      if (errorHandler !== undefined) {
        if (!angular.isString(errorHandler)) {
          throw new Error('Unable to load data, a loadFailureHandler is not a string.');
        } else errorHandler = $injector.get(errorHandler);
      }

      var loaders = [],
          tables = [],
          deferred = $q.defer();

      function addTablePart(table) {
        tables.push(table);
      }

      for (var part in parts) {
        if (hasPart(part) && parts[part].isActive) {
          loaders.push(
            parts[part]
              .getTable(options.key, $q, $http, options.urlTemplate, errorHandler)
              .then(addTablePart)
          );
        }
      }

      if (loaders.length) {
        $q.all(loaders).then(
          function() {
            var table = {};
            for (var i = 0; i < tables.length; i++) {
              deepExtend(table, tables[i]);
            }
            deferred.resolve(table);
          },
          function() {
            deferred.reject(options.key);
          }
        );
      } else {
        deferred.resolve({});
      }

      return deferred.promise;
    };

    /**
     * @ngdoc function
     * @name pascalprecht.translate.$translatePartialLoader#addPart
     * @methodOf pascalprecht.translate.$translatePartialLoader
     *
     * @description
     * Registers a new part of the translation table. This method does actually not perform any xhr
     * requests to get a translation data. The new parts would be loaded from the server next time
     * `angular-translate` asks to loader to loaded translations.
     *
     * @param {string} name A name of the part to add
     *
     * @returns {object} $translatePartialLoader, so this method is chainable
     *
     * @fires {$translatePartialLoaderStructureChanged} The $translatePartialLoaderStructureChanged
     * event would be fired by this method in case the new part affected somehow on the loaders
     * state. This way it means that there are a new translation data available to be loaded from
     * the server.
     *
     * @throws {TypeError} The method could throw a **TypeError** if you pass the param of the wrong
     * type. Please, note that the `name` param has to be a non-empty **string**.
     */
    service.addPart = function(name) {
      if (!isStringValid(name)) {
        throw new TypeError('Couldn\'t add part, first arg has to be a string');
      }

      if (!hasPart(name)) {
        parts[name] = new Part(name);
        $rootScope.$emit('$translatePartialLoaderStructureChanged', name);
      } else if (!parts[name].isActive) {
        parts[name].isActive = true;
        $rootScope.$emit('$translatePartialLoaderStructureChanged', name);
      }

      return service;
    };

    /**
     * @ngdoc function
     * @name pascalprecht.translate.$translatePartialLoader#deletePart
     * @methodOf pascalprecht.translate.$translatePartialLoader
     *
     * @description
     * Deletes the previously added part of the translation data. The target part could be deleted
     * either logically or physically. When the data is deleted logically it is not actually deleted
     * from the browser, but the loader marks it as not active and prevents it from affecting on the
     * translations. If the deleted in such way part is added again, the loader will use the
     * previously loaded data rather than loading it from the server once more time. But if the data
     * is deleted physically, the loader will completely remove all information about it. So in case
     * of recycling this part will be loaded from the server again.
     *
     * @param {string} name A name of the part to delete
     * @param {boolean=} [removeData=false] An indicator if the loader has to remove a loaded
     * translation data physically. If the `removeData` if set to **false** the loaded data will not be
     * deleted physically and might be reused in the future to prevent an additional xhr requests.
     *
     * @returns {object} $translatePartialLoader, so this method is chainable
     *
     * @fires {$translatePartialLoaderStructureChanged} The $translatePartialLoaderStructureChanged
     * event would be fired by this method in case a part deletion process affects somehow on the
     * loaders state. This way it means that some part of the translation data is now deprecated and
     * the translation table has to be recompiled with the remaining translation parts.
     *
     * @throws {TypeError} The method could throw a **TypeError** if you pass some param of the
     * wrong type. Please, note that the `name` param has to be a non-empty **string** and
     * the `removeData` param has to be either **undefined** or **boolean**.
     */
    service.deletePart = function(name, removeData) {
      if (!isStringValid(name)) {
        throw new TypeError('Couldn\'t delete part, first arg has to be string');
      }

      if (removeData === undefined) {
        removeData = false;
      } else if (typeof removeData !== 'boolean') {
        throw new TypeError('Invalid type of a second argument, a boolean expected.');
      }

      if (hasPart(name)) {
        var wasActive = parts[name].isActive;
        if (removeData) {
          delete parts[name];
        } else {
          parts[name].isActive = false;
        }
        if (wasActive) {
          $rootScope.$emit('$translatePartialLoaderStructureChanged', name);
        }
      }

      return service;
    };

    /**
     * @ngdoc function
     * @name pascalprecht.translate.$translatePartialLoader#isPartAvailable
     * @methodOf pascalprecht.translate.$translatePartialLoader
     *
     * @description
     * Checks if a target translation part is available. The part becomes available just after it was
     * added by the `addPart` method. Part's availability does not mean that it was loaded from the
     * server, but only that it was added to the loader. The available part might be loaded next
     * time the loader is called.
     *
     * @param {string} name A name of the part to delete
     *
     * @returns {boolean} Returns **true** if the part is available now and **false** if not.
     *
     * @throws {TypeError} The method could throw a **TypeError** if you pass the param of the wrong
     * type. Please, note that the `name` param has to be a non-empty **string**.
     */
    service.isPartAvailable = isPartAvailable;

    return service;

  }];

});

angular.module('pascalprecht.translate')
/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateStaticFilesLoader
 * @requires $q
 * @requires $http
 *
 * @description
 * Creates a loading function for a typical static file url pattern:
 * "lang-en_US.json", "lang-de_DE.json", etc. Using this builder,
 * the response of these urls must be an object of key-value pairs.
 *
 * @param {object} options Options object, which gets prefix, suffix and key.
 */
.factory('$translateStaticFilesLoader', ['$q', '$http', function ($q, $http) {

  return function (options) {

    if (!options || (!angular.isString(options.prefix) || !angular.isString(options.suffix))) {
      throw new Error('Couldn\'t load static files, no prefix or suffix specified!');
    }

    var deferred = $q.defer();

    $http({
      url: [
        options.prefix,
        options.key,
        options.suffix
      ].join(''),
      method: 'GET',
      params: ''
    }).success(function (data) {
      deferred.resolve(data);
    }).error(function (data) {
      deferred.reject(options.key);
    });

    return deferred.promise;
  };
}]);

angular.module('pascalprecht.translate')
/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateUrlLoader
 * @requires $q
 * @requires $http
 *
 * @description
 * Creates a loading function for a typical dynamic url pattern:
 * "locale.php?lang=en_US", "locale.php?lang=de_DE", etc. Prefixing the specified
 * url, the current requested, language id will be applied with "?lang={key}".
 * Using this service, the response of these urls must be an object of
 * key-value pairs.
 *
 * @param {object} options Options object, which gets the url and key.
 */
.factory('$translateUrlLoader', ['$q', '$http', function ($q, $http) {

  return function (options) {

    if (!options || !options.url) {
      throw new Error('Couldn\'t use urlLoader since no url is given!');
    }

    var deferred = $q.defer();

    $http({
      url: options.url,
      params: { lang: options.key },
      method: 'GET'
    }).success(function (data) {
      deferred.resolve(data);
    }).error(function (data) {
      deferred.reject(options.key);
    });

    return deferred.promise;
  };
}]);

angular.module('pascalprecht.translate')

.constant('TRANSLATE_MF_INTERPOLATION_CACHE', '$translateMessageFormatInterpolation')

/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateMessageFormatInterpolation
 * @requires TRANSLATE_MF_INTERPOLATION_CACHE
 *
 * @description
 * Uses MessageFormat.js to interpolate strings against some values.
 *
 * @return {object} $translateInterpolator Interpolator service
 */
.factory('$translateMessageFormatInterpolation', function ($cacheFactory, TRANSLATE_MF_INTERPOLATION_CACHE) {

  var $translateInterpolator = {},
      $cache = $cacheFactory.get(TRANSLATE_MF_INTERPOLATION_CACHE),
      // instantiate with default locale (which is 'en')
      $mf = new MessageFormat(),
      $identifier = 'messageformat',
      $sanitizeValueStrategy = null,
      // map of all sanitize strategies
      sanitizeValueStrategies = {
        escaped: function (params) {
          var result = {};
          for (var key in params) {
            if (params.hasOwnProperty(key)) {
              result[key] = angular.element('<div></div>').text(params[key]).html();
            }
          }
          return result;
        }
      };

  var sanitizeParams = function (params) {
    var result;
    if (angular.isFunction(sanitizeValueStrategies[$sanitizeValueStrategy])) {
      result = sanitizeValueStrategies[$sanitizeValueStrategy](params);
    } else {
      result = params;
    }
    return result;
  };

  if (!$cache) {
    // create cache if it doesn't exist already
    $cache = $cacheFactory(TRANSLATE_MF_INTERPOLATION_CACHE);
  }

  $cache.put('en', $mf);

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateMessageFormatInterpolation#setLocale
   * @methodOf pascalprecht.translate.$translateMessageFormatInterpolation
   *
   * @description
   * Sets current locale (this is currently not use in this interpolation).
   *
   * @param {string} locale Language key or locale.
   */
  $translateInterpolator.setLocale = function (locale) {
    $mf = $cache.get(locale);
    if (!$mf) {
      $mf = new MessageFormat(locale);
      $cache.put(locale, $mf);
    }
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateMessageFormatInterpolation#getInterpolationIdentifier
   * @methodOf pascalprecht.translate.$translateMessageFormatInterpolation
   *
   * @description
   * Returns an identifier for this interpolation service.
   *
   * @returns {string} $identifier
   */
  $translateInterpolator.getInterpolationIdentifier = function () {
    return $identifier;
  };

  $translateInterpolator.useSanitizeValueStrategy = function (value) {
    $sanitizeValueStrategy = value;
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateMessageFormatInterpolation#interpolate
   * @methodOf pascalprecht.translate.$translateMessageFormatInterpolation
   *
   * @description
   * Interpolates given string agains given interpolate params using MessageFormat.js.
   *
   * @returns {string} interpolated string.
   */
  $translateInterpolator.interpolate = function (string, interpolateParams) {

    interpolateParams = interpolateParams || {};

    if ($sanitizeValueStrategy) {
      interpolateParams = sanitizeParams(interpolateParams);
    }

    var interpolatedText = $cache.get(string + angular.toJson(interpolateParams));

    // if given string wasn't interpolated yet, we do so now and never have to do it again
    if (!interpolatedText) {
      interpolatedText = $mf.compile(string)(interpolateParams);
      $cache.put(string + angular.toJson(interpolateParams), interpolatedText);
    }
    return interpolatedText;
  };

  return $translateInterpolator;
});

angular.module('pascalprecht.translate')

/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateCookieStorage
 * @requires $cookieStore
 *
 * @description
 * Abstraction layer for cookieStore. This service is used when telling angular-translate
 * to use cookieStore as storage.
 *
 */
.factory('$translateCookieStorage', ['$cookieStore', function ($cookieStore) {

  var $translateCookieStorage = {

    /**
     * @ngdoc function
     * @name pascalprecht.translate.$translateCookieStorage#get
     * @methodOf pascalprecht.translate.$translateCookieStorage
     *
     * @description
     * Returns an item from cookieStorage by given name.
     *
     * @param {string} name Item name
     * @return {string} Value of item name
     */
    get: function (name) {
      return $cookieStore.get(name);
    },

    /**
     * @ngdoc function
     * @name pascalprecht.translate.$translateCookieStorage#set
     * @methodOf pascalprecht.translate.$translateCookieStorage
     *
     * @description
     * Sets an item in cookieStorage by given name.
     *
     * @param {string} name Item name
     * @param {string} value Item value
     */
    set: function (name, value) {
      $cookieStore.put(name, value);
    }
  };

  return $translateCookieStorage;
}]);

angular.module('pascalprecht.translate').constant('$STORAGE_KEY', 'NG_TRANSLATE_LANG_KEY');

angular.module('pascalprecht.translate')

/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateLocalStorage
 * @requires $window
 *
 * @description
 * Abstraction layer for localStorage. This service is used when telling angular-translate
 * to use localStorage as storage.
 *
 */
.factory('$translateLocalStorage', ['$window', '$translateCookieStorage', function ($window, $translateCookieStorage) {

  // Setup adapter
  var localStorageAdapter = (function(){
    var langKey;
    return {
      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translateLocalStorage#get
       * @methodOf pascalprecht.translate.$translateLocalStorage
       *
       * @description
       * Returns an item from localStorage by given name.
       *
       * @param {string} name Item name
       * @return {string} Value of item name
       */
      get: function (name) {
        if(!langKey) {
          langKey = $window.localStorage.getItem(name);
        }

        return langKey;
      },
      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translateLocalStorage#set
       * @methodOf pascalprecht.translate.$translateLocalStorage
       *
       * @description
       * Sets an item in localStorage by given name.
       *
       * @param {string} name Item name
       * @param {string} value Item value
       */
      set: function (name, value) {
        langKey=value;
        $window.localStorage.setItem(name, value);
      }
    };
  }());

  var hasLocalStorageSupport = 'localStorage' in $window && $window.localStorage !== null;
  if (hasLocalStorageSupport) {
    var testKey = 'pascalprecht.translate.storageTest';
    try {
      $window.localStorage.setItem(testKey, 'foo');
      $window.localStorage.removeItem(testKey);
    } catch (e){
      hasLocalStorageSupport = false;
    }
  }
  var $translateLocalStorage = hasLocalStorageSupport ? localStorageAdapter : $translateCookieStorage;
  return $translateLocalStorage;
}]);

/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateProvider
 * @description
 *
 * $translateProvider allows developers to register translation-tables, asynchronous loaders
 * and similar to configure translation behavior directly inside of a module.
 *
 */
angular.module('pascalprecht.translate').provider('$translate', ['$STORAGE_KEY', function ($STORAGE_KEY) {

  var $translationTable = {},
      $preferredLanguage,
      $availableLanguageKeys = [],
      $languageKeyAliases,
      $fallbackLanguage,
      $fallbackWasString,
      $uses,
      $nextLang,
      $storageFactory,
      $storageKey = $STORAGE_KEY,
      $storagePrefix,
      $missingTranslationHandlerFactory,
      $interpolationFactory,
      $interpolatorFactories = [],
      $interpolationSanitizationStrategy = false,
      $loaderFactory,
      $cloakClassName = 'translate-cloak',
      $loaderOptions,
      $notFoundIndicatorLeft,
      $notFoundIndicatorRight,
      $postCompilingEnabled = false,
      NESTED_OBJECT_DELIMITER = '.';


  // tries to determine the browsers locale
  var getLocale = function () {
    var nav = window.navigator;
    return ((
      nav.language ||
      nav.browserLanguage ||
      nav.systemLanguage ||
      nav.userLanguage
    ) || '').split('-').join('_');
  };

  var negotiateLocale = function (preferred) {

    var avail = [],
        locale = angular.lowercase(preferred),
        i = 0,
        n = $availableLanguageKeys.length;

    for (; i < n; i++) {
      avail.push(angular.lowercase($availableLanguageKeys[i]));
    }

    if (avail.indexOf(locale) > -1) {
      return preferred;
    }

    if ($languageKeyAliases) {
      var alias;
      for (var langKeyAlias in $languageKeyAliases) {
        var hasWildcardKey = false;
        var hasExactKey = $languageKeyAliases.hasOwnProperty(langKeyAlias) &&
          angular.lowercase(langKeyAlias) === angular.lowercase(preferred);

        if (langKeyAlias.slice(-1) === '*') {
          hasWildcardKey = langKeyAlias.slice(0, -1) === preferred.slice(0, langKeyAlias.length-1);
        }
        if (hasExactKey || hasWildcardKey) {
          alias = $languageKeyAliases[langKeyAlias];
          if (avail.indexOf(angular.lowercase(alias)) > -1) {
            return alias;
          }
        }
      }
    }

    var parts = preferred.split('_');

    if (parts.length > 1 && avail.indexOf(angular.lowercase(parts[0])) > -1) {
      return parts[0];
    }

    // If everything fails, just return the preferred, unchanged.
    return preferred;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#translations
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Registers a new translation table for specific language key.
   *
   * To register a translation table for specific language, pass a defined language
   * key as first parameter.
   *
   * <pre>
   *  // register translation table for language: 'de_DE'
   *  $translateProvider.translations('de_DE', {
   *    'GREETING': 'Hallo Welt!'
   *  });
   *
   *  // register another one
   *  $translateProvider.translations('en_US', {
   *    'GREETING': 'Hello world!'
   *  });
   * </pre>
   *
   * When registering multiple translation tables for for the same language key,
   * the actual translation table gets extended. This allows you to define module
   * specific translation which only get added, once a specific module is loaded in
   * your app.
   *
   * Invoking this method with no arguments returns the translation table which was
   * registered with no language key. Invoking it with a language key returns the
   * related translation table.
   *
   * @param {string} key A language key.
   * @param {object} translationTable A plain old JavaScript object that represents a translation table.
   *
   */
  var translations = function (langKey, translationTable) {

    if (!langKey && !translationTable) {
      return $translationTable;
    }

    if (langKey && !translationTable) {
      if (angular.isString(langKey)) {
        return $translationTable[langKey];
      }
    } else {
      if (!angular.isObject($translationTable[langKey])) {
        $translationTable[langKey] = {};
      }
      angular.extend($translationTable[langKey], flatObject(translationTable));
    }
    return this;
  };

  this.translations = translations;

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#cloakClassName
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   *
   * Let's you change the class name for `translate-cloak` directive.
   * Default class name is `translate-cloak`.
   *
   * @param {string} name translate-cloak class name
   */
  this.cloakClassName = function (name) {
    if (!name) {
      return $cloakClassName;
    }
    $cloakClassName = name;
    return this;
  };

  /**
   * @name flatObject
   * @private
   *
   * @description
   * Flats an object. This function is used to flatten given translation data with
   * namespaces, so they are later accessible via dot notation.
   */
  var flatObject = function (data, path, result, prevKey) {
    var key, keyWithPath, keyWithShortPath, val;

    if (!path) {
      path = [];
    }
    if (!result) {
      result = {};
    }
    for (key in data) {
      if (!data.hasOwnProperty(key)) {
        continue;
      }
      val = data[key];
      if (angular.isObject(val)) {
        flatObject(val, path.concat(key), result, key);
      } else {
        keyWithPath = path.length ? ('' + path.join(NESTED_OBJECT_DELIMITER) + NESTED_OBJECT_DELIMITER + key) : key;
        if(path.length && key === prevKey){
          // Create shortcut path (foo.bar == foo.bar.bar)
          keyWithShortPath = '' + path.join(NESTED_OBJECT_DELIMITER);
          // Link it to original path
          result[keyWithShortPath] = '@:' + keyWithPath;
        }
        result[keyWithPath] = val;
      }
    }
    return result;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#addInterpolation
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Adds interpolation services to angular-translate, so it can manage them.
   *
   * @param {object} factory Interpolation service factory
   */
  this.addInterpolation = function (factory) {
    $interpolatorFactories.push(factory);
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useMessageFormatInterpolation
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use interpolation functionality of messageformat.js.
   * This is useful when having high level pluralization and gender selection.
   */
  this.useMessageFormatInterpolation = function () {
    return this.useInterpolation('$translateMessageFormatInterpolation');
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useInterpolation
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells angular-translate which interpolation style to use as default, application-wide.
   * Simply pass a factory/service name. The interpolation service has to implement
   * the correct interface.
   *
   * @param {string} factory Interpolation service name.
   */
  this.useInterpolation = function (factory) {
    $interpolationFactory = factory;
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useSanitizeStrategy
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Simply sets a sanitation strategy type.
   *
   * @param {string} value Strategy type.
   */
  this.useSanitizeValueStrategy = function (value) {
    $interpolationSanitizationStrategy = value;
    return this;
  };

 /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#preferredLanguage
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells the module which of the registered translation tables to use for translation
   * at initial startup by passing a language key. Similar to `$translateProvider#use`
   * only that it says which language to **prefer**.
   *
   * @param {string} langKey A language key.
   *
   */
  this.preferredLanguage = function(langKey) {
    if (langKey) {
      $preferredLanguage = langKey;
      return this;
    }
    return $preferredLanguage;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#translationNotFoundIndicator
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Sets an indicator which is used when a translation isn't found. E.g. when
   * setting the indicator as 'X' and one tries to translate a translation id
   * called `NOT_FOUND`, this will result in `X NOT_FOUND X`.
   *
   * Internally this methods sets a left indicator and a right indicator using
   * `$translateProvider.translationNotFoundIndicatorLeft()` and
   * `$translateProvider.translationNotFoundIndicatorRight()`.
   *
   * **Note**: These methods automatically add a whitespace between the indicators
   * and the translation id.
   *
   * @param {string} indicator An indicator, could be any string.
   */
  this.translationNotFoundIndicator = function (indicator) {
    this.translationNotFoundIndicatorLeft(indicator);
    this.translationNotFoundIndicatorRight(indicator);
    return this;
  };

  /**
   * ngdoc function
   * @name pascalprecht.translate.$translateProvider#translationNotFoundIndicatorLeft
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Sets an indicator which is used when a translation isn't found left to the
   * translation id.
   *
   * @param {string} indicator An indicator.
   */
  this.translationNotFoundIndicatorLeft = function (indicator) {
    if (!indicator) {
      return $notFoundIndicatorLeft;
    }
    $notFoundIndicatorLeft = indicator;
    return this;
  };

  /**
   * ngdoc function
   * @name pascalprecht.translate.$translateProvider#translationNotFoundIndicatorLeft
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Sets an indicator which is used when a translation isn't found right to the
   * translation id.
   *
   * @param {string} indicator An indicator.
   */
  this.translationNotFoundIndicatorRight = function (indicator) {
    if (!indicator) {
      return $notFoundIndicatorRight;
    }
    $notFoundIndicatorRight = indicator;
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#fallbackLanguage
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells the module which of the registered translation tables to use when missing translations
   * at initial startup by passing a language key. Similar to `$translateProvider#use`
   * only that it says which language to **fallback**.
   *
   * @param {string||array} langKey A language key.
   *
   */
  this.fallbackLanguage = function (langKey) {
    fallbackStack(langKey);
    return this;
  };

  var fallbackStack = function (langKey) {
    if (langKey) {
      if (angular.isString(langKey)) {
        $fallbackWasString = true;
        $fallbackLanguage = [ langKey ];
      } else if (angular.isArray(langKey)) {
        $fallbackWasString = false;
        $fallbackLanguage = langKey;
      }
      if (angular.isString($preferredLanguage)) {
        $fallbackLanguage.push($preferredLanguage);
      }

      return this;
    } else {
      if ($fallbackWasString) {
        return $fallbackLanguage[0];
      } else {
        return $fallbackLanguage;
      }
    }
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#use
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Set which translation table to use for translation by given language key. When
   * trying to 'use' a language which isn't provided, it'll throw an error.
   *
   * You actually don't have to use this method since `$translateProvider#preferredLanguage`
   * does the job too.
   *
   * @param {string} langKey A language key.
   */
  this.use = function (langKey) {
    if (langKey) {
      if (!$translationTable[langKey] && (!$loaderFactory)) {
        // only throw an error, when not loading translation data asynchronously
        throw new Error("$translateProvider couldn't find translationTable for langKey: '" + langKey + "'");
      }
      $uses = langKey;
      return this;
    }
    return $uses;
  };

 /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#storageKey
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells the module which key must represent the choosed language by a user in the storage.
   *
   * @param {string} key A key for the storage.
   */
  var storageKey = function(key) {
    if (!key) {
      if ($storagePrefix) {
        return $storagePrefix + $storageKey;
      }
      return $storageKey;
    }
    $storageKey = key;
  };

  this.storageKey = storageKey;

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useUrlLoader
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use `$translateUrlLoader` extension service as loader.
   *
   * @param {string} url Url
   */
  this.useUrlLoader = function (url) {
    return this.useLoader('$translateUrlLoader', { url: url });
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useStaticFilesLoader
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use `$translateStaticFilesLoader` extension service as loader.
   *
   * @param {Object=} options Optional configuration object
   */
  this.useStaticFilesLoader = function (options) {
    return this.useLoader('$translateStaticFilesLoader', options);
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useLoader
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use any other service as loader.
   *
   * @param {string} loaderFactory Factory name to use
   * @param {Object=} options Optional configuration object
   */
  this.useLoader = function (loaderFactory, options) {
    $loaderFactory = loaderFactory;
    $loaderOptions = options || {};
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useLocalStorage
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use `$translateLocalStorage` service as storage layer.
   *
   */
  this.useLocalStorage = function () {
    return this.useStorage('$translateLocalStorage');
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useCookieStorage
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use `$translateCookieStorage` service as storage layer.
   */
  this.useCookieStorage = function () {
    return this.useStorage('$translateCookieStorage');
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useStorage
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use custom service as storage layer.
   */
  this.useStorage = function (storageFactory) {
    $storageFactory = storageFactory;
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#storagePrefix
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Sets prefix for storage key.
   *
   * @param {string} prefix Storage key prefix
   */
  this.storagePrefix = function (prefix) {
    if (!prefix) {
      return prefix;
    }
    $storagePrefix = prefix;
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useMissingTranslationHandlerLog
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use built-in log handler when trying to translate
   * a translation Id which doesn't exist.
   *
   * This is actually a shortcut method for `useMissingTranslationHandler()`.
   *
   */
  this.useMissingTranslationHandlerLog = function () {
    return this.useMissingTranslationHandler('$translateMissingTranslationHandlerLog');
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useMissingTranslationHandler
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Expects a factory name which later gets instantiated with `$injector`.
   * This method can be used to tell angular-translate to use a custom
   * missingTranslationHandler. Just build a factory which returns a function
   * and expects a translation id as argument.
   *
   * Example:
   * <pre>
   *  app.config(function ($translateProvider) {
   *    $translateProvider.useMissingTranslationHandler('customHandler');
   *  });
   *
   *  app.factory('customHandler', function (dep1, dep2) {
   *    return function (translationId) {
   *      // something with translationId and dep1 and dep2
   *    };
   *  });
   * </pre>
   *
   * @param {string} factory Factory name
   */
  this.useMissingTranslationHandler = function (factory) {
    $missingTranslationHandlerFactory = factory;
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#usePostCompiling
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * If post compiling is enabled, all translated values will be processed
   * again with AngularJS' $compile.
   *
   * Example:
   * <pre>
   *  app.config(function ($translateProvider) {
   *    $translateProvider.usePostCompiling(true);
   *  });
   * </pre>
   *
   * @param {string} factory Factory name
   */
  this.usePostCompiling = function (value) {
    $postCompilingEnabled = !(!value);
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#determinePreferredLanguage
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells angular-translate to try to determine on its own which language key
   * to set as preferred language. When `fn` is given, angular-translate uses it
   * to determine a language key, otherwise it uses the built-in `getLocale()`
   * method.
   *
   * The `getLocale()` returns a language key in the format `[lang]_[country]` or
   * `[lang]` depending on what the browser provides.
   *
   * Use this method at your own risk, since not all browsers return a valid
   * locale.
   *
   * @param {object=} fn Function to determine a browser's locale
   */
  this.determinePreferredLanguage = function (fn) {

    var locale = (fn && angular.isFunction(fn)) ? fn() : getLocale();

    if (!$availableLanguageKeys.length) {
      $preferredLanguage = locale;
    } else {
      $preferredLanguage = negotiateLocale(locale);
    }

    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#registerAvailableLanguageKeys
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Registers a set of language keys the app will work with. Use this method in
   * combination with
   * {@link pascalprecht.translate.$translateProvider#determinePreferredLanguage determinePreferredLanguage}.
   * When available languages keys are registered, angular-translate
   * tries to find the best fitting language key depending on the browsers locale,
   * considering your language key convention.
   *
   * @param {object} languageKeys Array of language keys the your app will use
   * @param {object=} aliases Alias map.
   */
  this.registerAvailableLanguageKeys = function (languageKeys, aliases) {
    if (languageKeys) {
      $availableLanguageKeys = languageKeys;
      if (aliases) {
        $languageKeyAliases = aliases;
      }
      return this;
    }
    return $availableLanguageKeys;
  };

  /**
   * @ngdoc object
   * @name pascalprecht.translate.$translate
   * @requires $interpolate
   * @requires $log
   * @requires $rootScope
   * @requires $q
   *
   * @description
   * The `$translate` service is the actual core of angular-translate. It expects a translation id
   * and optional interpolate parameters to translate contents.
   *
   * <pre>
   *  $translate('HEADLINE_TEXT').then(function (translation) {
   *    $scope.translatedText = translation;
   *  });
   * </pre>
   *
   * @param {string|array} translationId A token which represents a translation id
   *                                     This can be optionally an array of translation ids which
   *                                     results that the function returns an object where each key
   *                                     is the translation id and the value the translation.
   * @param {object=} interpolateParams An object hash for dynamic values
   * @returns {object} promise
   */
  this.$get = [
    '$log',
    '$injector',
    '$rootScope',
    '$q',
    function ($log, $injector, $rootScope, $q) {

      var Storage,
          defaultInterpolator = $injector.get($interpolationFactory || '$translateDefaultInterpolation'),
          pendingLoader = false,
          interpolatorHashMap = {},
          langPromises = {},
          fallbackIndex,
          startFallbackIteration;

      var $translate = function (translationId, interpolateParams, interpolationId) {

        // Duck detection: If the first argument is an array, a bunch of translations was requested.
        // The result is an object.
        if (angular.isArray(translationId)) {
          // Inspired by Q.allSettled by Kris Kowal
          // https://github.com/kriskowal/q/blob/b0fa72980717dc202ffc3cbf03b936e10ebbb9d7/q.js#L1553-1563
          // This transforms all promises regardless resolved or rejected
          var translateAll = function (translationIds) {
            var results = {}; // storing the actual results
            var promises = []; // promises to wait for
            // Wraps the promise a) being always resolved and b) storing the link id->value
            var translate = function (translationId) {
              var deferred = $q.defer();
              var regardless = function (value) {
                results[translationId] = value;
                deferred.resolve([translationId, value]);
              };
              // we don't care whether the promise was resolved or rejected; just store the values
              $translate(translationId, interpolateParams, interpolationId).then(regardless, regardless);
              return deferred.promise;
            };
            for (var i = 0, c = translationIds.length; i < c; i++) {
              promises.push(translate(translationIds[i]));
            }
            // wait for all (including storing to results)
            return $q.all(promises).then(function () {
              // return the results
              return results;
            });
          };
          return translateAll(translationId);
        }

        var deferred = $q.defer();

        // trim off any whitespace
        if (translationId) {
          translationId = translationId.trim();
        }

        var promiseToWaitFor = (function () {
          var promise = $preferredLanguage ?
            langPromises[$preferredLanguage] :
            langPromises[$uses];

          fallbackIndex = 0;

          if ($storageFactory && !promise) {
            // looks like there's no pending promise for $preferredLanguage or
            // $uses. Maybe there's one pending for a language that comes from
            // storage.
            var langKey = Storage.get($storageKey);
            promise = langPromises[langKey];

            if ($fallbackLanguage && $fallbackLanguage.length) {
                var index = indexOf($fallbackLanguage, langKey);
                // maybe the language from storage is also defined as fallback language
                // we increase the fallback language index to not search in that language
                // as fallback, since it's probably the first used language
                fallbackIndex = (index > -1) ? index+=1 : 0;
                // but we can make sure to ALWAYS fallback to preferred language at least
                $fallbackLanguage.push($preferredLanguage);
            }
          }
          return promise;
        }());

        if (!promiseToWaitFor) {
          // no promise to wait for? okay. Then there's no loader registered
          // nor is a one pending for language that comes from storage.
          // We can just translate.
          determineTranslation(translationId, interpolateParams, interpolationId).then(deferred.resolve, deferred.reject);
        } else {
          promiseToWaitFor.then(function () {
            determineTranslation(translationId, interpolateParams, interpolationId).then(deferred.resolve, deferred.reject);
          }, deferred.reject);
        }
        return deferred.promise;
      };

      /**
       * @name indexOf
       * @private
       *
       * @description
       * indexOf polyfill. Kinda sorta.
       *
       * @param {array} array Array to search in.
       * @param {string} searchElement Element to search for.
       *
       * @returns {int} Index of search element.
       */
      var indexOf = function(array, searchElement) {
        for (var i = 0, len = array.length; i < len; i++) {
          if (array[i] === searchElement) {
            return i;
          }
        }
        return -1;
      };

      /**
       * @name applyNotFoundIndicators
       * @private
       *
       * @description
       * Applies not fount indicators to given translation id, if needed.
       * This function gets only executed, if a translation id doesn't exist,
       * which is why a translation id is expected as argument.
       *
       * @param {string} translationId Translation id.
       * @returns {string} Same as given translation id but applied with not found
       * indicators.
       */
      var applyNotFoundIndicators = function (translationId) {
        // applying notFoundIndicators
        if ($notFoundIndicatorLeft) {
          translationId = [$notFoundIndicatorLeft, translationId].join(' ');
        }
        if ($notFoundIndicatorRight) {
          translationId = [translationId, $notFoundIndicatorRight].join(' ');
        }
        return translationId;
      };

      /**
       * @name useLanguage
       * @private
       *
       * @description
       * Makes actual use of a language by setting a given language key as used
       * language and informs registered interpolators to also use the given
       * key as locale.
       *
       * @param {key} Locale key.
       */
      var useLanguage = function (key) {
        $uses = key;
        $rootScope.$emit('$translateChangeSuccess');

        if ($storageFactory) {
          Storage.set($translate.storageKey(), $uses);
        }
        // inform default interpolator
        defaultInterpolator.setLocale($uses);
        // inform all others to!
        angular.forEach(interpolatorHashMap, function (interpolator, id) {
          interpolatorHashMap[id].setLocale($uses);
        });
        $rootScope.$emit('$translateChangeEnd');
      };

      /**
       * @name loadAsync
       * @private
       *
       * @description
       * Kicks of registered async loader using `$injector` and applies existing
       * loader options. When resolved, it updates translation tables accordingly
       * or rejects with given language key.
       *
       * @param {string} key Language key.
       * @return {Promise} A promise.
       */
      var loadAsync = function (key) {
        if (!key) {
          throw 'No language key specified for loading.';
        }

        var deferred = $q.defer();

        $rootScope.$emit('$translateLoadingStart');
        pendingLoader = true;

        $injector.get($loaderFactory)(angular.extend($loaderOptions, {
          key: key
        })).then(function (data) {
          var translationTable = {};
          $rootScope.$emit('$translateLoadingSuccess');

          if (angular.isArray(data)) {
            angular.forEach(data, function (table) {
              angular.extend(translationTable, flatObject(table));
            });
          } else {
            angular.extend(translationTable, flatObject(data));
          }
          pendingLoader = false;
          deferred.resolve({
            key: key,
            table: translationTable
          });
          $rootScope.$emit('$translateLoadingEnd');
        }, function (key) {
          $rootScope.$emit('$translateLoadingError');
          deferred.reject(key);
          $rootScope.$emit('$translateLoadingEnd');
        });
        return deferred.promise;
      };

      if ($storageFactory) {
        Storage = $injector.get($storageFactory);

        if (!Storage.get || !Storage.set) {
          throw new Error('Couldn\'t use storage \'' + $storageFactory + '\', missing get() or set() method!');
        }
      }

      // apply additional settings
      if (angular.isFunction(defaultInterpolator.useSanitizeValueStrategy)) {
        defaultInterpolator.useSanitizeValueStrategy($interpolationSanitizationStrategy);
      }

      // if we have additional interpolations that were added via
      // $translateProvider.addInterpolation(), we have to map'em
      if ($interpolatorFactories.length) {
        angular.forEach($interpolatorFactories, function (interpolatorFactory) {
          var interpolator = $injector.get(interpolatorFactory);
          // setting initial locale for each interpolation service
          interpolator.setLocale($preferredLanguage || $uses);
          // apply additional settings
          if (angular.isFunction(interpolator.useSanitizeValueStrategy)) {
            interpolator.useSanitizeValueStrategy($interpolationSanitizationStrategy);
          }
          // make'em recognizable through id
          interpolatorHashMap[interpolator.getInterpolationIdentifier()] = interpolator;
        });
      }

      /**
       * @name getTranslationTable
       * @private
       *
       * @description
       * Returns a promise that resolves to the translation table
       * or is rejected if an error occurred.
       *
       * @param langKey
       * @returns {Q.promise}
       */
      var getTranslationTable = function (langKey) {
        var deferred = $q.defer();
        if ($translationTable.hasOwnProperty(langKey)) {
          deferred.resolve($translationTable[langKey]);
          return deferred.promise;
        } else {
          langPromises[langKey].then(function (data) {
            translations(data.key, data.table);
            deferred.resolve(data.table);
          }, deferred.reject);
        }
        return deferred.promise;
      };

      /**
       * @name getFallbackTranslation
       * @private
       *
       * @description
       * Returns a promise that will resolve to the translation
       * or be rejected if no translation was found for the language.
       * This function is currently only used for fallback language translation.
       *
       * @param langKey The language to translate to.
       * @param translationId
       * @param interpolateParams
       * @param Interpolator
       * @returns {Q.promise}
       */
      var getFallbackTranslation = function (langKey, translationId, interpolateParams, Interpolator) {
        var deferred = $q.defer();

        getTranslationTable(langKey).then(function (translationTable) {
          if (translationTable.hasOwnProperty(translationId)) {
            Interpolator.setLocale(langKey);
            deferred.resolve(Interpolator.interpolate(translationTable[translationId], interpolateParams));
            Interpolator.setLocale($uses);
          } else {
            deferred.reject();
          }
        }, deferred.reject);

        return deferred.promise;
      };

      /**
       * @name getFallbackTranslationInstant
       * @private
       *
       * @description
       * Returns a translation
       * This function is currently only used for fallback language translation.
       *
       * @param langKey The language to translate to.
       * @param translationId
       * @param interpolateParams
       * @param Interpolator
       * @returns {string} translation
       */
      var getFallbackTranslationInstant = function (langKey, translationId, interpolateParams, Interpolator) {
        var result, translationTable = $translationTable[langKey];

        if (translationTable.hasOwnProperty(translationId)) {
          Interpolator.setLocale(langKey);
          result = Interpolator.interpolate(translationTable[translationId], interpolateParams);
          Interpolator.setLocale($uses);
        }

        return result;
      };

      /**
       * @name resolveForFallbackLanguage
       * @private
       *
       * Recursive helper function for fallbackTranslation that will sequentially look
       * for a translation in the fallbackLanguages starting with fallbackLanguageIndex.
       *
       * @param fallbackLanguageIndex
       * @param translationId
       * @param interpolateParams
       * @param Interpolator
       * @returns {Q.promise} Promise that will resolve to the translation.
       */
      var resolveForFallbackLanguage = function (fallbackLanguageIndex, translationId, interpolateParams, Interpolator) {
        var deferred = $q.defer();

        if (fallbackLanguageIndex < $fallbackLanguage.length) {
          var langKey = $fallbackLanguage[fallbackLanguageIndex];
          getFallbackTranslation(langKey, translationId, interpolateParams, Interpolator).then(
            function (translation) {
              deferred.resolve(translation);
            },
            function () {
              // Look in the next fallback language for a translation.
              // It delays the resolving by passing another promise to resolve.
              var nextFallbackLanguagePromise = resolveForFallbackLanguage(fallbackLanguageIndex + 1, translationId, interpolateParams, Interpolator);
              deferred.resolve(nextFallbackLanguagePromise);
            }
          );
        } else {
          // No translation found in any fallback language

          // If we have a handler factory - we might also call it here to determine if it provides
          // a default text for a translationid that can't be found anywhere in our tables
          if ($missingTranslationHandlerFactory) {
            var resultString = $injector.get($missingTranslationHandlerFactory)(translationId, $uses);
            if (resultString !== undefined) {
              deferred.resolve(resultString);
            } else {
              deferred.resolve(translationId);
            }
          } else {
            deferred.resolve(translationId);
          }
        }
        return deferred.promise;
      };

      /**
       * @name resolveForFallbackLanguageInstant
       * @private
       *
       * Recursive helper function for fallbackTranslation that will sequentially look
       * for a translation in the fallbackLanguages starting with fallbackLanguageIndex.
       *
       * @param fallbackLanguageIndex
       * @param translationId
       * @param interpolateParams
       * @param Interpolator
       * @returns {string} translation
       */
      var resolveForFallbackLanguageInstant = function (fallbackLanguageIndex, translationId, interpolateParams, Interpolator) {
        var result;

        if (fallbackLanguageIndex < $fallbackLanguage.length) {
          var langKey = $fallbackLanguage[fallbackLanguageIndex];
          result = getFallbackTranslationInstant(langKey, translationId, interpolateParams, Interpolator);
          if (!result) {
            result = resolveForFallbackLanguageInstant(fallbackLanguageIndex + 1, translationId, interpolateParams, Interpolator);
          }
        }
        return result;
      };

      /**
       * Translates with the usage of the fallback languages.
       *
       * @param translationId
       * @param interpolateParams
       * @param Interpolator
       * @returns {Q.promise} Promise, that resolves to the translation.
       */
      var fallbackTranslation = function (translationId, interpolateParams, Interpolator) {
        // Start with the fallbackLanguage with index 0
        return resolveForFallbackLanguage((startFallbackIteration>0 ? startFallbackIteration : fallbackIndex), translationId, interpolateParams, Interpolator);
      };

      /**
       * Translates with the usage of the fallback languages.
       *
       * @param translationId
       * @param interpolateParams
       * @param Interpolator
       * @returns {String} translation
       */
      var fallbackTranslationInstant = function (translationId, interpolateParams, Interpolator) {
        // Start with the fallbackLanguage with index 0
        return resolveForFallbackLanguageInstant((startFallbackIteration>0 ? startFallbackIteration : fallbackIndex), translationId, interpolateParams, Interpolator);
      };

      var determineTranslation = function (translationId, interpolateParams, interpolationId) {

        var deferred = $q.defer();

        var table = $uses ? $translationTable[$uses] : $translationTable,
            Interpolator = (interpolationId) ? interpolatorHashMap[interpolationId] : defaultInterpolator;

        // if the translation id exists, we can just interpolate it
        if (table && table.hasOwnProperty(translationId)) {
          var translation = table[translationId];

          // If using link, rerun $translate with linked translationId and return it
          if (translation.substr(0, 2) === '@:') {

            $translate(translation.substr(2), interpolateParams, interpolationId)
              .then(deferred.resolve, deferred.reject);
          } else {
            deferred.resolve(Interpolator.interpolate(translation, interpolateParams));
          }
        } else {
          // looks like the requested translation id doesn't exists.
          // Now, if there is a registered handler for missing translations and no
          // asyncLoader is pending, we execute the handler
          if ($missingTranslationHandlerFactory && !pendingLoader) {
            $injector.get($missingTranslationHandlerFactory)(translationId, $uses);
          }

          // since we couldn't translate the inital requested translation id,
          // we try it now with one or more fallback languages, if fallback language(s) is
          // configured.
          if ($uses && $fallbackLanguage && $fallbackLanguage.length) {
            fallbackTranslation(translationId, interpolateParams, Interpolator)
              .then(function (translation) {
                deferred.resolve(translation);
              }, function (_translationId) {
                deferred.reject(applyNotFoundIndicators(_translationId));
              });

          } else {
            deferred.reject(applyNotFoundIndicators(translationId));
          }
        }
        return deferred.promise;
      };

      var determineTranslationInstant = function (translationId, interpolateParams, interpolationId) {

        var result, table = $uses ? $translationTable[$uses] : $translationTable,
            Interpolator = (interpolationId) ? interpolatorHashMap[interpolationId] : defaultInterpolator;

        // if the translation id exists, we can just interpolate it
        if (table && table.hasOwnProperty(translationId)) {
          var translation = table[translationId];

          // If using link, rerun $translate with linked translationId and return it
          if (translation.substr(0, 2) === '@:') {
            result = determineTranslationInstant(translation.substr(2), interpolateParams, interpolationId);
          } else {
            result = Interpolator.interpolate(translation, interpolateParams);
          }
        } else {
          // looks like the requested translation id doesn't exists.
          // Now, if there is a registered handler for missing translations and no
          // asyncLoader is pending, we execute the handler
          if ($missingTranslationHandlerFactory && !pendingLoader) {
            $injector.get($missingTranslationHandlerFactory)(translationId, $uses);
          }

          // since we couldn't translate the inital requested translation id,
          // we try it now with one or more fallback languages, if fallback language(s) is
          // configured.
          if ($uses && $fallbackLanguage && $fallbackLanguage.length) {
            fallbackIndex = 0;
            result = fallbackTranslationInstant(translationId, interpolateParams, Interpolator);
          } else {
            result = applyNotFoundIndicators(translationId);
          }
        }

        return result;
      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#preferredLanguage
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Returns the language key for the preferred language.
       *
       * @return {string} preferred language key
       */
      $translate.preferredLanguage = function () {
        return $preferredLanguage;
      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#cloakClassName
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Returns the configured class name for `translate-cloak` directive.
       *
       * @return {string} cloakClassName
       */
      $translate.cloakClassName = function () {
        return $cloakClassName;
      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#fallbackLanguage
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Returns the language key for the fallback languages or sets a new fallback stack.
       *
       * @param {string=} langKey language String or Array of fallback languages to be used (to change stack at runtime)
       *
       * @return {string||array} fallback language key
       */
      $translate.fallbackLanguage = function (langKey) {
        if (langKey !== undefined && langKey !== null) {
          fallbackStack(langKey);

          // as we might have an async loader initiated and a new translation language might have been defined
          // we need to add the promise to the stack also. So - iterate.
          if ($loaderFactory) {
            if ($fallbackLanguage && $fallbackLanguage.length) {
              for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
                if (!langPromises[$fallbackLanguage[i]]) {
                  langPromises[$fallbackLanguage[i]] = loadAsync($fallbackLanguage[i]);
                }
              }
            }
          }
          $translate.use($translate.use());
        }
        if ($fallbackWasString) {
          return $fallbackLanguage[0];
        } else {
          return $fallbackLanguage;
        }

      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#useFallbackLanguage
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Sets the first key of the fallback language stack to be used for translation.
       * Therefore all languages in the fallback array BEFORE this key will be skipped!
       *
       * @param {string=} langKey Contains the langKey the iteration shall start with. Set to false if you want to
       * get back to the whole stack
       */
      $translate.useFallbackLanguage = function (langKey) {
        if (langKey !== undefined && langKey !== null) {
          if (!langKey) {
            startFallbackIteration = 0;
          } else {
            var langKeyPosition = indexOf($fallbackLanguage, langKey);
            if (langKeyPosition > -1) {
              startFallbackIteration = langKeyPosition;
            }
          }

        }

      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#proposedLanguage
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Returns the language key of language that is currently loaded asynchronously.
       *
       * @return {string} language key
       */
      $translate.proposedLanguage = function () {
        return $nextLang;
      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#storage
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Returns registered storage.
       *
       * @return {object} Storage
       */
      $translate.storage = function () {
        return Storage;
      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#use
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Tells angular-translate which language to use by given language key. This method is
       * used to change language at runtime. It also takes care of storing the language
       * key in a configured store to let your app remember the choosed language.
       *
       * When trying to 'use' a language which isn't available it tries to load it
       * asynchronously with registered loaders.
       *
       * Returns promise object with loaded language file data
       * @example
       * $translate.use("en_US").then(function(data){
       *   $scope.text = $translate("HELLO");
       * });
       *
       * @param {string} key Language key
       * @return {string} Language key
       */
      $translate.use = function (key) {
        if (!key) {
          return $uses;
        }

        var deferred = $q.defer();

        $rootScope.$emit('$translateChangeStart');

        // Try to get the aliased language key
        var aliasedKey = negotiateLocale(key);
        if (aliasedKey) {
          key = aliasedKey;
        }

        // if there isn't a translation table for the language we've requested,
        // we load it asynchronously
        if (!$translationTable[key] && $loaderFactory) {
          $nextLang = key;
          langPromises[key] = loadAsync(key).then(function (translation) {
            translations(translation.key, translation.table);
            deferred.resolve(translation.key);

            if ($nextLang === key) {
              useLanguage(translation.key);
              $nextLang = undefined;
            }
          }, function (key) {
            $nextLang = undefined;
            $rootScope.$emit('$translateChangeError');
            deferred.reject(key);
            $rootScope.$emit('$translateChangeEnd');
          });
        } else {
          deferred.resolve(key);
          useLanguage(key);
        }

        return deferred.promise;
      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#storageKey
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Returns the key for the storage.
       *
       * @return {string} storage key
       */
      $translate.storageKey = function () {
        return storageKey();
      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#isPostCompilingEnabled
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Returns whether post compiling is enabled or not
       *
       * @return {bool} storage key
       */
      $translate.isPostCompilingEnabled = function () {
        return $postCompilingEnabled;
      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#refresh
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Refreshes a translation table pointed by the given langKey. If langKey is not specified,
       * the module will drop all existent translation tables and load new version of those which
       * are currently in use.
       *
       * Refresh means that the module will drop target translation table and try to load it again.
       *
       * In case there are no loaders registered the refresh() method will throw an Error.
       *
       * If the module is able to refresh translation tables refresh() method will broadcast
       * $translateRefreshStart and $translateRefreshEnd events.
       *
       * @example
       * // this will drop all currently existent translation tables and reload those which are
       * // currently in use
       * $translate.refresh();
       * // this will refresh a translation table for the en_US language
       * $translate.refresh('en_US');
       *
       * @param {string} langKey A language key of the table, which has to be refreshed
       *
       * @return {promise} Promise, which will be resolved in case a translation tables refreshing
       * process is finished successfully, and reject if not.
       */
      $translate.refresh = function (langKey) {
        if (!$loaderFactory) {
          throw new Error('Couldn\'t refresh translation table, no loader registered!');
        }

        var deferred = $q.defer();

        function resolve() {
          deferred.resolve();
          $rootScope.$emit('$translateRefreshEnd');
        }

        function reject() {
          deferred.reject();
          $rootScope.$emit('$translateRefreshEnd');
        }

        $rootScope.$emit('$translateRefreshStart');

        if (!langKey) {
          // if there's no language key specified we refresh ALL THE THINGS!
          var tables = [];

          // reload registered fallback languages
          if ($fallbackLanguage && $fallbackLanguage.length) {
            for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
              tables.push(loadAsync($fallbackLanguage[i]));
            }
          }

          // reload currently used language
          if ($uses) {
            tables.push(loadAsync($uses));
          }

          $q.all(tables).then(function (tableData) {
            angular.forEach(tableData, function (data) {
              if ($translationTable[data.key]) {
                delete $translationTable[data.key];
              }
              translations(data.key, data.table);
            });
            if ($uses) {
              useLanguage($uses);
            }
            resolve();
          });

        } else if ($translationTable[langKey]) {

          loadAsync(langKey).then(function (data) {
            translations(data.key, data.table);
            if (langKey === $uses) {
              useLanguage($uses);
            }
            resolve();
          }, reject);

        } else {
          reject();
        }
        return deferred.promise;
      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#instant
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Returns a translation instantly from the internal state of loaded translation. All rules
       * regarding the current language, the preferred language of even fallback languages will be
       * used except any promise handling. If a language was not found, an asynchronous loading
       * will be invoked in the background.
       *
       * @param {string|array} translationId A token which represents a translation id
       *                                     This can be optionally an array of translation ids which
       *                                     results that the function's promise returns an object where
       *                                     each key is the translation id and the value the translation.
       * @param {object} interpolateParams Params
       *
       * @return {string} translation
       */
      $translate.instant = function (translationId, interpolateParams, interpolationId) {

        // Detect undefined and null values to shorten the execution and prevent exceptions
        if (translationId === null || angular.isUndefined(translationId)) {
          return translationId;
        }

        // Duck detection: If the first argument is an array, a bunch of translations was requested.
        // The result is an object.
        if (angular.isArray(translationId)) {
          var results = {};
          for (var i = 0, c = translationId.length; i < c; i++) {
            results[translationId[i]] = $translate.instant(translationId[i], interpolateParams, interpolationId);
          }
          return results;
        }

        // We discarded unacceptable values. So we just need to verify if translationId is empty String
        if (angular.isString(translationId) && translationId.length < 1) {
          return translationId;
        }

        // trim off any whitespace
        if (translationId) {
          translationId = translationId.trim();
        }

        var result, possibleLangKeys = [];
        if ($preferredLanguage) {
          possibleLangKeys.push($preferredLanguage);
        }
        if ($uses) {
          possibleLangKeys.push($uses);
        }
        if ($fallbackLanguage && $fallbackLanguage.length) {
          possibleLangKeys = possibleLangKeys.concat($fallbackLanguage);
        }
        for (var j = 0, d = possibleLangKeys.length; j < d; j++) {
          var possibleLangKey = possibleLangKeys[j];
          if ($translationTable[possibleLangKey]) {
            if (typeof $translationTable[possibleLangKey][translationId] !== 'undefined') {
              result = determineTranslationInstant(translationId, interpolateParams, interpolationId);
            }
          }
          if (typeof result !== 'undefined') {
            break;
          }
        }

        if (!result && result !== '') {
          // Return translation if not found anything.
          result = translationId;
          if ($missingTranslationHandlerFactory && !pendingLoader) {
            $injector.get($missingTranslationHandlerFactory)(translationId, $uses);
          }
        }

        return result;
      };

      if ($loaderFactory) {

        // If at least one async loader is defined and there are no
        // (default) translations available we should try to load them.
        if (angular.equals($translationTable, {})) {
          $translate.use($translate.use());
        }

        // Also, if there are any fallback language registered, we start
        // loading them asynchronously as soon as we can.
        if ($fallbackLanguage && $fallbackLanguage.length) {

          for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
            langPromises[$fallbackLanguage[i]] = loadAsync($fallbackLanguage[i]);
          }
        }
      }

      return $translate;
    }];
}]);
