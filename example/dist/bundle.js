(function (React, ReactDOM) {
  'use strict';

  var React__default = 'default' in React ? React['default'] : React;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var RootCompId = 'root';
  var RootFtrId = 'root';
  function Root(props) {
    return React.createElement("div", {
      style: {
        width: '100%',
        height: '100%'
      }
    }, props.children);
  }

  var HandlerRole;

  (function (HandlerRole) {
    HandlerRole["SOURCE"] = "SOURCE";
    HandlerRole["TARGET"] = "TARGET";
  })(HandlerRole || (HandlerRole = {}));

  function symbolObservablePonyfill(root) {
    var result;
    var _Symbol = root.Symbol;

    if (typeof _Symbol === 'function') {
      if (_Symbol.observable) {
        result = _Symbol.observable;
      } else {
        result = _Symbol('observable');
        _Symbol.observable = result;
      }
    } else {
      result = '@@observable';
    }

    return result;
  }

  var root;

  if (typeof self !== 'undefined') {
    root = self;
  } else if (typeof window !== 'undefined') {
    root = window;
  } else if (typeof global !== 'undefined') {
    root = global;
  } else if (typeof module !== 'undefined') {
    root = module;
  } else {
    root = Function('return this')();
  }

  var result = symbolObservablePonyfill(root);

  var randomString = function randomString() {
    return Math.random().toString(36).substring(7).split('').join('.');
  };

  var ActionTypes = {
    INIT: "@@redux/INIT" + randomString(),
    REPLACE: "@@redux/REPLACE" + randomString(),
    PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
      return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
    }
  };

  function isPlainObject(obj) {
    if (_typeof(obj) !== 'object' || obj === null) return false;
    var proto = obj;

    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }

    return Object.getPrototypeOf(obj) === proto;
  }

  function createStore(reducer, preloadedState, enhancer) {
    var _ref2;

    if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
      throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function.');
    }

    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
      enhancer = preloadedState;
      preloadedState = undefined;
    }

    if (typeof enhancer !== 'undefined') {
      if (typeof enhancer !== 'function') {
        throw new Error('Expected the enhancer to be a function.');
      }

      return enhancer(createStore)(reducer, preloadedState);
    }

    if (typeof reducer !== 'function') {
      throw new Error('Expected the reducer to be a function.');
    }

    var currentReducer = reducer;
    var currentState = preloadedState;
    var currentListeners = [];
    var nextListeners = currentListeners;
    var isDispatching = false;

    function ensureCanMutateNextListeners() {
      if (nextListeners === currentListeners) {
        nextListeners = currentListeners.slice();
      }
    }

    function getState() {
      if (isDispatching) {
        throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
      }

      return currentState;
    }

    function subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new Error('Expected the listener to be a function.');
      }

      if (isDispatching) {
        throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
      }

      var isSubscribed = true;
      ensureCanMutateNextListeners();
      nextListeners.push(listener);
      return function unsubscribe() {
        if (!isSubscribed) {
          return;
        }

        if (isDispatching) {
          throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
        }

        isSubscribed = false;
        ensureCanMutateNextListeners();
        var index = nextListeners.indexOf(listener);
        nextListeners.splice(index, 1);
        currentListeners = null;
      };
    }

    function dispatch(action) {
      if (!isPlainObject(action)) {
        throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
      }

      if (typeof action.type === 'undefined') {
        throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
      }

      if (isDispatching) {
        throw new Error('Reducers may not dispatch actions.');
      }

      try {
        isDispatching = true;
        currentState = currentReducer(currentState, action);
      } finally {
        isDispatching = false;
      }

      var listeners = currentListeners = nextListeners;

      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        listener();
      }

      return action;
    }

    function replaceReducer(nextReducer) {
      if (typeof nextReducer !== 'function') {
        throw new Error('Expected the nextReducer to be a function.');
      }

      currentReducer = nextReducer;
      dispatch({
        type: ActionTypes.REPLACE
      });
    }

    function observable() {
      var _ref;

      var outerSubscribe = subscribe;
      return _ref = {
        subscribe: function subscribe(observer) {
          if (_typeof(observer) !== 'object' || observer === null) {
            throw new TypeError('Expected the observer to be an object.');
          }

          function observeState() {
            if (observer.next) {
              observer.next(getState());
            }
          }

          observeState();
          var unsubscribe = outerSubscribe(observeState);
          return {
            unsubscribe: unsubscribe
          };
        }
      }, _ref[result] = function () {
        return this;
      }, _ref;
    }

    dispatch({
      type: ActionTypes.INIT
    });
    return _ref2 = {
      dispatch: dispatch,
      subscribe: subscribe,
      getState: getState,
      replaceReducer: replaceReducer
    }, _ref2[result] = observable, _ref2;
  }

  function warning(message) {
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
      console.error(message);
    }

    try {
      throw new Error(message);
    } catch (e) {}
  }

  function isCrushed() {}

  if ( typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
    warning('You are currently using minified code outside of NODE_ENV === "production". ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) ' + 'to ensure you have the correct code for your production build.');
  }

  function invariant(condition, format) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    {
      if (format === undefined) {
        throw new Error('invariant requires an error message argument');
      }
    }

    if (!condition) {
      var error;

      if (format === undefined) {
        error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
      } else {
        var argIndex = 0;
        error = new Error(format.replace(/%s/g, function () {
          return args[argIndex++];
        }));
        error.name = 'Invariant Violation';
      }

      error.framesToPop = 1;
      throw error;
    }
  }

  var INIT_COORDS = 'dnd-core/INIT_COORDS';
  var BEGIN_DRAG = 'dnd-core/BEGIN_DRAG';
  var PUBLISH_DRAG_SOURCE = 'dnd-core/PUBLISH_DRAG_SOURCE';
  var HOVER = 'dnd-core/HOVER';
  var DROP = 'dnd-core/DROP';
  var END_DRAG = 'dnd-core/END_DRAG';

  function setClientOffset(clientOffset, sourceClientOffset) {
    return {
      type: INIT_COORDS,
      payload: {
        sourceClientOffset: sourceClientOffset || null,
        clientOffset: clientOffset || null
      }
    };
  }

  function _typeof$1(obj) {
    if (typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol") {
      _typeof$1 = function _typeof$1(obj) {
        return _typeof(obj);
      };
    } else {
      _typeof$1 = function _typeof$1(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof(obj);
      };
    }

    return _typeof$1(obj);
  }

  function get(obj, path, defaultValue) {
    return path.split('.').reduce(function (a, c) {
      return a && a[c] ? a[c] : defaultValue || null;
    }, obj);
  }
  function without(items, item) {
    return items.filter(function (i) {
      return i !== item;
    });
  }
  function isObject(input) {
    return _typeof$1(input) === 'object';
  }
  function xor(itemsA, itemsB) {
    var map = new Map();

    var insertItem = function insertItem(item) {
      return map.set(item, map.has(item) ? map.get(item) + 1 : 1);
    };

    itemsA.forEach(insertItem);
    itemsB.forEach(insertItem);
    var result = [];
    map.forEach(function (count, key) {
      if (count === 1) {
        result.push(key);
      }
    });
    return result;
  }
  function intersection(itemsA, itemsB) {
    return itemsA.filter(function (t) {
      return itemsB.indexOf(t) > -1;
    });
  }

  var ResetCoordinatesAction = {
    type: INIT_COORDS,
    payload: {
      clientOffset: null,
      sourceClientOffset: null
    }
  };
  function createBeginDrag(manager) {
    return function beginDrag() {
      var sourceIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        publishSource: true
      };
      var _options$publishSourc = options.publishSource,
          publishSource = _options$publishSourc === void 0 ? true : _options$publishSourc,
          clientOffset = options.clientOffset,
          getSourceClientOffset = options.getSourceClientOffset;
      var monitor = manager.getMonitor();
      var registry = manager.getRegistry();
      manager.dispatch(setClientOffset(clientOffset));
      verifyInvariants(sourceIds, monitor, registry);
      var sourceId = getDraggableSource(sourceIds, monitor);

      if (sourceId === null) {
        manager.dispatch(ResetCoordinatesAction);
        return;
      }

      var sourceClientOffset = null;

      if (clientOffset) {
        verifyGetSourceClientOffsetIsFunction(getSourceClientOffset);
        sourceClientOffset = getSourceClientOffset(sourceId);
      }

      manager.dispatch(setClientOffset(clientOffset, sourceClientOffset));
      var source = registry.getSource(sourceId);
      var item = source.beginDrag(monitor, sourceId);
      verifyItemIsObject(item);
      registry.pinSource(sourceId);
      var itemType = registry.getSourceType(sourceId);
      return {
        type: BEGIN_DRAG,
        payload: {
          itemType: itemType,
          item: item,
          sourceId: sourceId,
          clientOffset: clientOffset || null,
          sourceClientOffset: sourceClientOffset || null,
          isSourcePublic: !!publishSource
        }
      };
    };
  }

  function verifyInvariants(sourceIds, monitor, registry) {
    invariant(!monitor.isDragging(), 'Cannot call beginDrag while dragging.');
    sourceIds.forEach(function (sourceId) {
      invariant(registry.getSource(sourceId), 'Expected sourceIds to be registered.');
    });
  }

  function verifyGetSourceClientOffsetIsFunction(getSourceClientOffset) {
    invariant(typeof getSourceClientOffset === 'function', 'When clientOffset is provided, getSourceClientOffset must be a function.');
  }

  function verifyItemIsObject(item) {
    invariant(isObject(item), 'Item must be an object.');
  }

  function getDraggableSource(sourceIds, monitor) {
    var sourceId = null;

    for (var i = sourceIds.length - 1; i >= 0; i--) {
      if (monitor.canDragSource(sourceIds[i])) {
        sourceId = sourceIds[i];
        break;
      }
    }

    return sourceId;
  }

  function createPublishDragSource(manager) {
    return function publishDragSource() {
      var monitor = manager.getMonitor();

      if (monitor.isDragging()) {
        return {
          type: PUBLISH_DRAG_SOURCE
        };
      }
    };
  }

  function matchesType(targetType, draggedItemType) {
    if (draggedItemType === null) {
      return targetType === null;
    }

    return Array.isArray(targetType) ? targetType.some(function (t) {
      return t === draggedItemType;
    }) : targetType === draggedItemType;
  }

  function createHover(manager) {
    return function hover(targetIdsArg) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          clientOffset = _ref.clientOffset;

      verifyTargetIdsIsArray(targetIdsArg);
      var targetIds = targetIdsArg.slice(0);
      var monitor = manager.getMonitor();
      var registry = manager.getRegistry();
      checkInvariants(targetIds, monitor, registry);
      var draggedItemType = monitor.getItemType();
      removeNonMatchingTargetIds(targetIds, registry, draggedItemType);
      hoverAllTargets(targetIds, monitor, registry);
      return {
        type: HOVER,
        payload: {
          targetIds: targetIds,
          clientOffset: clientOffset || null
        }
      };
    };
  }

  function verifyTargetIdsIsArray(targetIdsArg) {
    invariant(Array.isArray(targetIdsArg), 'Expected targetIds to be an array.');
  }

  function checkInvariants(targetIds, monitor, registry) {
    invariant(monitor.isDragging(), 'Cannot call hover while not dragging.');
    invariant(!monitor.didDrop(), 'Cannot call hover after drop.');

    for (var i = 0; i < targetIds.length; i++) {
      var targetId = targetIds[i];
      invariant(targetIds.lastIndexOf(targetId) === i, 'Expected targetIds to be unique in the passed array.');
      var target = registry.getTarget(targetId);
      invariant(target, 'Expected targetIds to be registered.');
    }
  }

  function removeNonMatchingTargetIds(targetIds, registry, draggedItemType) {
    for (var i = targetIds.length - 1; i >= 0; i--) {
      var targetId = targetIds[i];
      var targetType = registry.getTargetType(targetId);

      if (!matchesType(targetType, draggedItemType)) {
        targetIds.splice(i, 1);
      }
    }
  }

  function hoverAllTargets(targetIds, monitor, registry) {
    targetIds.forEach(function (targetId) {
      var target = registry.getTarget(targetId);
      target.hover(monitor, targetId);
    });
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty$1(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _defineProperty$1(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }
  function createDrop(manager) {
    return function drop() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var monitor = manager.getMonitor();
      var registry = manager.getRegistry();
      verifyInvariants$1(monitor);
      var targetIds = getDroppableTargets(monitor);
      targetIds.forEach(function (targetId, index) {
        var dropResult = determineDropResult(targetId, index, registry, monitor);
        var action = {
          type: DROP,
          payload: {
            dropResult: _objectSpread({}, options, {}, dropResult)
          }
        };
        manager.dispatch(action);
      });
    };
  }

  function verifyInvariants$1(monitor) {
    invariant(monitor.isDragging(), 'Cannot call drop while not dragging.');
    invariant(!monitor.didDrop(), 'Cannot call drop twice during one drag operation.');
  }

  function determineDropResult(targetId, index, registry, monitor) {
    var target = registry.getTarget(targetId);
    var dropResult = target ? target.drop(monitor, targetId) : undefined;
    verifyDropResultType(dropResult);

    if (typeof dropResult === 'undefined') {
      dropResult = index === 0 ? {} : monitor.getDropResult();
    }

    return dropResult;
  }

  function verifyDropResultType(dropResult) {
    invariant(typeof dropResult === 'undefined' || isObject(dropResult), 'Drop result must either be an object or undefined.');
  }

  function getDroppableTargets(monitor) {
    var targetIds = monitor.getTargetIds().filter(monitor.canDropOnTarget, monitor);
    targetIds.reverse();
    return targetIds;
  }

  function createEndDrag(manager) {
    return function endDrag() {
      var monitor = manager.getMonitor();
      var registry = manager.getRegistry();
      verifyIsDragging(monitor);
      var sourceId = monitor.getSourceId();
      var source = registry.getSource(sourceId, true);
      source.endDrag(monitor, sourceId);
      registry.unpinSource();
      return {
        type: END_DRAG
      };
    };
  }

  function verifyIsDragging(monitor) {
    invariant(monitor.isDragging(), 'Cannot call endDrag while not dragging.');
  }

  function createDragDropActions(manager) {
    return {
      beginDrag: createBeginDrag(manager),
      publishDragSource: createPublishDragSource(manager),
      hover: createHover(manager),
      drop: createDrop(manager),
      endDrag: createEndDrag(manager)
    };
  }

  var strictEquality = function strictEquality(a, b) {
    return a === b;
  };
  function areCoordsEqual(offsetA, offsetB) {
    if (!offsetA && !offsetB) {
      return true;
    } else if (!offsetA || !offsetB) {
      return false;
    } else {
      return offsetA.x === offsetB.x && offsetA.y === offsetB.y;
    }
  }
  function areArraysEqual(a, b) {
    var isEqual = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : strictEquality;

    if (a.length !== b.length) {
      return false;
    }

    for (var i = 0; i < a.length; ++i) {
      if (!isEqual(a[i], b[i])) {
        return false;
      }
    }

    return true;
  }

  function ownKeys$1(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread$1(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys$1(Object(source), true).forEach(function (key) {
          _defineProperty$2(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys$1(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _defineProperty$2(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }
  var initialState = {
    initialSourceClientOffset: null,
    initialClientOffset: null,
    clientOffset: null
  };
  function dragOffset() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var payload = action.payload;

    switch (action.type) {
      case INIT_COORDS:
      case BEGIN_DRAG:
        return {
          initialSourceClientOffset: payload.sourceClientOffset,
          initialClientOffset: payload.clientOffset,
          clientOffset: payload.clientOffset
        };

      case HOVER:
        if (areCoordsEqual(state.clientOffset, payload.clientOffset)) {
          return state;
        }

        return _objectSpread$1({}, state, {
          clientOffset: payload.clientOffset
        });

      case END_DRAG:
      case DROP:
        return initialState;

      default:
        return state;
    }
  }

  var ADD_SOURCE = 'dnd-core/ADD_SOURCE';
  var ADD_TARGET = 'dnd-core/ADD_TARGET';
  var REMOVE_SOURCE = 'dnd-core/REMOVE_SOURCE';
  var REMOVE_TARGET = 'dnd-core/REMOVE_TARGET';
  function addSource(sourceId) {
    return {
      type: ADD_SOURCE,
      payload: {
        sourceId: sourceId
      }
    };
  }
  function addTarget(targetId) {
    return {
      type: ADD_TARGET,
      payload: {
        targetId: targetId
      }
    };
  }
  function removeSource(sourceId) {
    return {
      type: REMOVE_SOURCE,
      payload: {
        sourceId: sourceId
      }
    };
  }
  function removeTarget(targetId) {
    return {
      type: REMOVE_TARGET,
      payload: {
        targetId: targetId
      }
    };
  }

  function ownKeys$2(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread$2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys$2(Object(source), true).forEach(function (key) {
          _defineProperty$3(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys$2(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _defineProperty$3(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }
  var initialState$1 = {
    itemType: null,
    item: null,
    sourceId: null,
    targetIds: [],
    dropResult: null,
    didDrop: false,
    isSourcePublic: null
  };
  function dragOperation() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState$1;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var payload = action.payload;

    switch (action.type) {
      case BEGIN_DRAG:
        return _objectSpread$2({}, state, {
          itemType: payload.itemType,
          item: payload.item,
          sourceId: payload.sourceId,
          isSourcePublic: payload.isSourcePublic,
          dropResult: null,
          didDrop: false
        });

      case PUBLISH_DRAG_SOURCE:
        return _objectSpread$2({}, state, {
          isSourcePublic: true
        });

      case HOVER:
        return _objectSpread$2({}, state, {
          targetIds: payload.targetIds
        });

      case REMOVE_TARGET:
        if (state.targetIds.indexOf(payload.targetId) === -1) {
          return state;
        }

        return _objectSpread$2({}, state, {
          targetIds: without(state.targetIds, payload.targetId)
        });

      case DROP:
        return _objectSpread$2({}, state, {
          dropResult: payload.dropResult,
          didDrop: true,
          targetIds: []
        });

      case END_DRAG:
        return _objectSpread$2({}, state, {
          itemType: null,
          item: null,
          sourceId: null,
          dropResult: null,
          didDrop: false,
          isSourcePublic: null,
          targetIds: []
        });

      default:
        return state;
    }
  }

  function refCount() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    switch (action.type) {
      case ADD_SOURCE:
      case ADD_TARGET:
        return state + 1;

      case REMOVE_SOURCE:
      case REMOVE_TARGET:
        return state - 1;

      default:
        return state;
    }
  }

  var NONE = [];
  var ALL = [];
  NONE.__IS_NONE__ = true;
  ALL.__IS_ALL__ = true;
  function areDirty(dirtyIds, handlerIds) {
    if (dirtyIds === NONE) {
      return false;
    }

    if (dirtyIds === ALL || typeof handlerIds === 'undefined') {
      return true;
    }

    var commonIds = intersection(handlerIds, dirtyIds);
    return commonIds.length > 0;
  }

  function dirtyHandlerIds() {
    var action = arguments.length > 1 ? arguments[1] : undefined;

    switch (action.type) {
      case HOVER:
        break;

      case ADD_SOURCE:
      case ADD_TARGET:
      case REMOVE_TARGET:
      case REMOVE_SOURCE:
        return NONE;

      case BEGIN_DRAG:
      case PUBLISH_DRAG_SOURCE:
      case END_DRAG:
      case DROP:
      default:
        return ALL;
    }

    var _action$payload = action.payload,
        _action$payload$targe = _action$payload.targetIds,
        targetIds = _action$payload$targe === void 0 ? [] : _action$payload$targe,
        _action$payload$prevT = _action$payload.prevTargetIds,
        prevTargetIds = _action$payload$prevT === void 0 ? [] : _action$payload$prevT;
    var result = xor(targetIds, prevTargetIds);
    var didChange = result.length > 0 || !areArraysEqual(targetIds, prevTargetIds);

    if (!didChange) {
      return NONE;
    }

    var prevInnermostTargetId = prevTargetIds[prevTargetIds.length - 1];
    var innermostTargetId = targetIds[targetIds.length - 1];

    if (prevInnermostTargetId !== innermostTargetId) {
      if (prevInnermostTargetId) {
        result.push(prevInnermostTargetId);
      }

      if (innermostTargetId) {
        result.push(innermostTargetId);
      }
    }

    return result;
  }

  function stateId() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return state + 1;
  }

  function ownKeys$3(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread$3(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys$3(Object(source), true).forEach(function (key) {
          _defineProperty$4(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys$3(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _defineProperty$4(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }
  function reduce() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments.length > 1 ? arguments[1] : undefined;
    return {
      dirtyHandlerIds: dirtyHandlerIds(state.dirtyHandlerIds, {
        type: action.type,
        payload: _objectSpread$3({}, action.payload, {
          prevTargetIds: get(state, 'dragOperation.targetIds', [])
        })
      }),
      dragOffset: dragOffset(state.dragOffset, action),
      refCount: refCount(state.refCount, action),
      dragOperation: dragOperation(state.dragOperation, action),
      stateId: stateId(state.stateId)
    };
  }

  function add(a, b) {
    return {
      x: a.x + b.x,
      y: a.y + b.y
    };
  }
  function subtract(a, b) {
    return {
      x: a.x - b.x,
      y: a.y - b.y
    };
  }
  function getSourceClientOffset(state) {
    var clientOffset = state.clientOffset,
        initialClientOffset = state.initialClientOffset,
        initialSourceClientOffset = state.initialSourceClientOffset;

    if (!clientOffset || !initialClientOffset || !initialSourceClientOffset) {
      return null;
    }

    return subtract(add(clientOffset, initialSourceClientOffset), initialClientOffset);
  }
  function getDifferenceFromInitialOffset(state) {
    var clientOffset = state.clientOffset,
        initialClientOffset = state.initialClientOffset;

    if (!clientOffset || !initialClientOffset) {
      return null;
    }

    return subtract(clientOffset, initialClientOffset);
  }

  function _classCallCheck$1(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties$1(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$1(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$1(Constructor, staticProps);
    return Constructor;
  }

  var DragDropMonitorImpl = function () {
    function DragDropMonitorImpl(store, registry) {
      _classCallCheck$1(this, DragDropMonitorImpl);

      this.store = store;
      this.registry = registry;
    }

    _createClass$1(DragDropMonitorImpl, [{
      key: "subscribeToStateChange",
      value: function subscribeToStateChange(listener) {
        var _this = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
          handlerIds: undefined
        };
        var handlerIds = options.handlerIds;
        invariant(typeof listener === 'function', 'listener must be a function.');
        invariant(typeof handlerIds === 'undefined' || Array.isArray(handlerIds), 'handlerIds, when specified, must be an array of strings.');
        var prevStateId = this.store.getState().stateId;

        var handleChange = function handleChange() {
          var state = _this.store.getState();

          var currentStateId = state.stateId;

          try {
            var canSkipListener = currentStateId === prevStateId || currentStateId === prevStateId + 1 && !areDirty(state.dirtyHandlerIds, handlerIds);

            if (!canSkipListener) {
              listener();
            }
          } finally {
            prevStateId = currentStateId;
          }
        };

        return this.store.subscribe(handleChange);
      }
    }, {
      key: "subscribeToOffsetChange",
      value: function subscribeToOffsetChange(listener) {
        var _this2 = this;

        invariant(typeof listener === 'function', 'listener must be a function.');
        var previousState = this.store.getState().dragOffset;

        var handleChange = function handleChange() {
          var nextState = _this2.store.getState().dragOffset;

          if (nextState === previousState) {
            return;
          }

          previousState = nextState;
          listener();
        };

        return this.store.subscribe(handleChange);
      }
    }, {
      key: "canDragSource",
      value: function canDragSource(sourceId) {
        if (!sourceId) {
          return false;
        }

        var source = this.registry.getSource(sourceId);
        invariant(source, 'Expected to find a valid source.');

        if (this.isDragging()) {
          return false;
        }

        return source.canDrag(this, sourceId);
      }
    }, {
      key: "canDropOnTarget",
      value: function canDropOnTarget(targetId) {
        if (!targetId) {
          return false;
        }

        var target = this.registry.getTarget(targetId);
        invariant(target, 'Expected to find a valid target.');

        if (!this.isDragging() || this.didDrop()) {
          return false;
        }

        var targetType = this.registry.getTargetType(targetId);
        var draggedItemType = this.getItemType();
        return matchesType(targetType, draggedItemType) && target.canDrop(this, targetId);
      }
    }, {
      key: "isDragging",
      value: function isDragging() {
        return Boolean(this.getItemType());
      }
    }, {
      key: "isDraggingSource",
      value: function isDraggingSource(sourceId) {
        if (!sourceId) {
          return false;
        }

        var source = this.registry.getSource(sourceId, true);
        invariant(source, 'Expected to find a valid source.');

        if (!this.isDragging() || !this.isSourcePublic()) {
          return false;
        }

        var sourceType = this.registry.getSourceType(sourceId);
        var draggedItemType = this.getItemType();

        if (sourceType !== draggedItemType) {
          return false;
        }

        return source.isDragging(this, sourceId);
      }
    }, {
      key: "isOverTarget",
      value: function isOverTarget(targetId) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
          shallow: false
        };

        if (!targetId) {
          return false;
        }

        var shallow = options.shallow;

        if (!this.isDragging()) {
          return false;
        }

        var targetType = this.registry.getTargetType(targetId);
        var draggedItemType = this.getItemType();

        if (draggedItemType && !matchesType(targetType, draggedItemType)) {
          return false;
        }

        var targetIds = this.getTargetIds();

        if (!targetIds.length) {
          return false;
        }

        var index = targetIds.indexOf(targetId);

        if (shallow) {
          return index === targetIds.length - 1;
        } else {
          return index > -1;
        }
      }
    }, {
      key: "getItemType",
      value: function getItemType() {
        return this.store.getState().dragOperation.itemType;
      }
    }, {
      key: "getItem",
      value: function getItem() {
        return this.store.getState().dragOperation.item;
      }
    }, {
      key: "getSourceId",
      value: function getSourceId() {
        return this.store.getState().dragOperation.sourceId;
      }
    }, {
      key: "getTargetIds",
      value: function getTargetIds() {
        return this.store.getState().dragOperation.targetIds;
      }
    }, {
      key: "getDropResult",
      value: function getDropResult() {
        return this.store.getState().dragOperation.dropResult;
      }
    }, {
      key: "didDrop",
      value: function didDrop() {
        return this.store.getState().dragOperation.didDrop;
      }
    }, {
      key: "isSourcePublic",
      value: function isSourcePublic() {
        return this.store.getState().dragOperation.isSourcePublic;
      }
    }, {
      key: "getInitialClientOffset",
      value: function getInitialClientOffset() {
        return this.store.getState().dragOffset.initialClientOffset;
      }
    }, {
      key: "getInitialSourceClientOffset",
      value: function getInitialSourceClientOffset() {
        return this.store.getState().dragOffset.initialSourceClientOffset;
      }
    }, {
      key: "getClientOffset",
      value: function getClientOffset() {
        return this.store.getState().dragOffset.clientOffset;
      }
    }, {
      key: "getSourceClientOffset",
      value: function getSourceClientOffset$1() {
        return getSourceClientOffset(this.store.getState().dragOffset);
      }
    }, {
      key: "getDifferenceFromInitialOffset",
      value: function getDifferenceFromInitialOffset$1() {
        return getDifferenceFromInitialOffset(this.store.getState().dragOffset);
      }
    }]);

    return DragDropMonitorImpl;
  }();

  var nextUniqueId = 0;
  function getNextUniqueId() {
    return nextUniqueId++;
  }

  function _typeof$2(obj) {
    if (typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol") {
      _typeof$2 = function _typeof$1(obj) {
        return _typeof(obj);
      };
    } else {
      _typeof$2 = function _typeof$1(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof(obj);
      };
    }

    return _typeof$2(obj);
  }
  function validateSourceContract(source) {
    invariant(typeof source.canDrag === 'function', 'Expected canDrag to be a function.');
    invariant(typeof source.beginDrag === 'function', 'Expected beginDrag to be a function.');
    invariant(typeof source.endDrag === 'function', 'Expected endDrag to be a function.');
  }
  function validateTargetContract(target) {
    invariant(typeof target.canDrop === 'function', 'Expected canDrop to be a function.');
    invariant(typeof target.hover === 'function', 'Expected hover to be a function.');
    invariant(typeof target.drop === 'function', 'Expected beginDrag to be a function.');
  }
  function validateType(type, allowArray) {
    if (allowArray && Array.isArray(type)) {
      type.forEach(function (t) {
        return validateType(t, false);
      });
      return;
    }

    invariant(typeof type === 'string' || _typeof$2(type) === 'symbol', allowArray ? 'Type can only be a string, a symbol, or an array of either.' : 'Type can only be a string or a symbol.');
  }

  function rawAsap(task) {
    if (!queue.length) {
      requestFlush();
    }

    queue[queue.length] = task;
  }
  var queue = [];
  var requestFlush;
  var index = 0;
  var capacity = 1024;

  function flush() {
    while (index < queue.length) {
      var currentIndex = index;
      index = index + 1;
      queue[currentIndex].call();

      if (index > capacity) {
        for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
          queue[scan] = queue[scan + index];
        }

        queue.length -= index;
        index = 0;
      }
    }

    queue.length = 0;
    index = 0;
  }

  var scope = typeof global !== 'undefined' ? global : self;
  var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;

  if (typeof BrowserMutationObserver === 'function') {
    requestFlush = makeRequestCallFromMutationObserver(flush);
  } else {
    requestFlush = makeRequestCallFromTimer(flush);
  }

  rawAsap.requestFlush = requestFlush;

  function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode('');
    observer.observe(node, {
      characterData: true
    });
    return function requestCall() {
      toggle = -toggle;
      node.data = toggle;
    };
  }

  function makeRequestCallFromTimer(callback) {
    return function requestCall() {
      var timeoutHandle = setTimeout(handleTimer, 0);
      var intervalHandle = setInterval(handleTimer, 50);

      function handleTimer() {
        clearTimeout(timeoutHandle);
        clearInterval(intervalHandle);
        callback();
      }
    };
  }

  rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

  var freeTasks = [];
  var pendingErrors = [];
  var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

  function throwFirstError() {
    if (pendingErrors.length) {
      throw pendingErrors.shift();
    }
  }

  function asap(task) {
    var rawTask;

    if (freeTasks.length) {
      rawTask = freeTasks.pop();
    } else {
      rawTask = new RawTask();
    }

    rawTask.task = task;
    rawAsap(rawTask);
  }

  var RawTask = function () {
    function RawTask() {}

    RawTask.prototype.call = function () {
      try {
        this.task.call();
      } catch (error) {
        if (asap.onerror) {
          asap.onerror(error);
        } else {
          pendingErrors.push(error);
          requestErrorThrow();
        }
      } finally {
        this.task = null;
        freeTasks[freeTasks.length] = this;
      }
    };

    return RawTask;
  }();

  function _classCallCheck$2(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties$2(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$2(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$2(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$2(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray$1(arr, i) {
    return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _nonIterableRest$1();
  }

  function _nonIterableRest$1() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function _iterableToArrayLimit$1(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayWithHoles$1(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function getNextHandlerId(role) {
    var id = getNextUniqueId().toString();

    switch (role) {
      case HandlerRole.SOURCE:
        return "S".concat(id);

      case HandlerRole.TARGET:
        return "T".concat(id);

      default:
        throw new Error("Unknown Handler Role: ".concat(role));
    }
  }

  function parseRoleFromHandlerId(handlerId) {
    switch (handlerId[0]) {
      case 'S':
        return HandlerRole.SOURCE;

      case 'T':
        return HandlerRole.TARGET;

      default:
        invariant(false, "Cannot parse handler ID: ".concat(handlerId));
    }
  }

  function mapContainsValue(map, searchValue) {
    var entries = map.entries();
    var isDone = false;

    do {
      var _entries$next = entries.next(),
          done = _entries$next.done,
          _entries$next$value = _slicedToArray$1(_entries$next.value, 2),
          value = _entries$next$value[1];

      if (value === searchValue) {
        return true;
      }

      isDone = !!done;
    } while (!isDone);

    return false;
  }

  var HandlerRegistryImpl = function () {
    function HandlerRegistryImpl(store) {
      _classCallCheck$2(this, HandlerRegistryImpl);

      this.types = new Map();
      this.dragSources = new Map();
      this.dropTargets = new Map();
      this.pinnedSourceId = null;
      this.pinnedSource = null;
      this.store = store;
    }

    _createClass$2(HandlerRegistryImpl, [{
      key: "addSource",
      value: function addSource$1(type, source) {
        validateType(type);
        validateSourceContract(source);
        var sourceId = this.addHandler(HandlerRole.SOURCE, type, source);
        this.store.dispatch(addSource(sourceId));
        return sourceId;
      }
    }, {
      key: "addTarget",
      value: function addTarget$1(type, target) {
        validateType(type, true);
        validateTargetContract(target);
        var targetId = this.addHandler(HandlerRole.TARGET, type, target);
        this.store.dispatch(addTarget(targetId));
        return targetId;
      }
    }, {
      key: "containsHandler",
      value: function containsHandler(handler) {
        return mapContainsValue(this.dragSources, handler) || mapContainsValue(this.dropTargets, handler);
      }
    }, {
      key: "getSource",
      value: function getSource(sourceId) {
        var includePinned = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        invariant(this.isSourceId(sourceId), 'Expected a valid source ID.');
        var isPinned = includePinned && sourceId === this.pinnedSourceId;
        var source = isPinned ? this.pinnedSource : this.dragSources.get(sourceId);
        return source;
      }
    }, {
      key: "getTarget",
      value: function getTarget(targetId) {
        invariant(this.isTargetId(targetId), 'Expected a valid target ID.');
        return this.dropTargets.get(targetId);
      }
    }, {
      key: "getSourceType",
      value: function getSourceType(sourceId) {
        invariant(this.isSourceId(sourceId), 'Expected a valid source ID.');
        return this.types.get(sourceId);
      }
    }, {
      key: "getTargetType",
      value: function getTargetType(targetId) {
        invariant(this.isTargetId(targetId), 'Expected a valid target ID.');
        return this.types.get(targetId);
      }
    }, {
      key: "isSourceId",
      value: function isSourceId(handlerId) {
        var role = parseRoleFromHandlerId(handlerId);
        return role === HandlerRole.SOURCE;
      }
    }, {
      key: "isTargetId",
      value: function isTargetId(handlerId) {
        var role = parseRoleFromHandlerId(handlerId);
        return role === HandlerRole.TARGET;
      }
    }, {
      key: "removeSource",
      value: function removeSource$1(sourceId) {
        var _this = this;

        invariant(this.getSource(sourceId), 'Expected an existing source.');
        this.store.dispatch(removeSource(sourceId));
        asap(function () {
          _this.dragSources.delete(sourceId);

          _this.types.delete(sourceId);
        });
      }
    }, {
      key: "removeTarget",
      value: function removeTarget$1(targetId) {
        invariant(this.getTarget(targetId), 'Expected an existing target.');
        this.store.dispatch(removeTarget(targetId));
        this.dropTargets.delete(targetId);
        this.types.delete(targetId);
      }
    }, {
      key: "pinSource",
      value: function pinSource(sourceId) {
        var source = this.getSource(sourceId);
        invariant(source, 'Expected an existing source.');
        this.pinnedSourceId = sourceId;
        this.pinnedSource = source;
      }
    }, {
      key: "unpinSource",
      value: function unpinSource() {
        invariant(this.pinnedSource, 'No source is pinned at the time.');
        this.pinnedSourceId = null;
        this.pinnedSource = null;
      }
    }, {
      key: "addHandler",
      value: function addHandler(role, type, handler) {
        var id = getNextHandlerId(role);
        this.types.set(id, type);

        if (role === HandlerRole.SOURCE) {
          this.dragSources.set(id, handler);
        } else if (role === HandlerRole.TARGET) {
          this.dropTargets.set(id, handler);
        }

        return id;
      }
    }]);

    return HandlerRegistryImpl;
  }();

  function _classCallCheck$3(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties$3(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$3(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$3(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$3(Constructor, staticProps);
    return Constructor;
  }

  function makeStoreInstance(debugMode) {
    var reduxDevTools = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__;
    return createStore(reduce, debugMode && reduxDevTools && reduxDevTools({
      name: 'dnd-core',
      instanceId: 'dnd-core'
    }));
  }

  var DragDropManagerImpl = function () {
    function DragDropManagerImpl() {
      var _this = this;

      var debugMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      _classCallCheck$3(this, DragDropManagerImpl);

      this.isSetUp = false;

      this.handleRefCountChange = function () {
        var shouldSetUp = _this.store.getState().refCount > 0;

        if (_this.backend) {
          if (shouldSetUp && !_this.isSetUp) {
            _this.backend.setup();

            _this.isSetUp = true;
          } else if (!shouldSetUp && _this.isSetUp) {
            _this.backend.teardown();

            _this.isSetUp = false;
          }
        }
      };

      var store = makeStoreInstance(debugMode);
      this.store = store;
      this.monitor = new DragDropMonitorImpl(store, new HandlerRegistryImpl(store));
      store.subscribe(this.handleRefCountChange);
    }

    _createClass$3(DragDropManagerImpl, [{
      key: "receiveBackend",
      value: function receiveBackend(backend) {
        this.backend = backend;
      }
    }, {
      key: "getMonitor",
      value: function getMonitor() {
        return this.monitor;
      }
    }, {
      key: "getBackend",
      value: function getBackend() {
        return this.backend;
      }
    }, {
      key: "getRegistry",
      value: function getRegistry() {
        return this.monitor.registry;
      }
    }, {
      key: "getActions",
      value: function getActions() {
        var manager = this;
        var dispatch = this.store.dispatch;

        function bindActionCreator(actionCreator) {
          return function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            var action = actionCreator.apply(manager, args);

            if (typeof action !== 'undefined') {
              dispatch(action);
            }
          };
        }

        var actions = createDragDropActions(this);
        return Object.keys(actions).reduce(function (boundActions, key) {
          var action = actions[key];
          boundActions[key] = bindActionCreator(action);
          return boundActions;
        }, {});
      }
    }, {
      key: "dispatch",
      value: function dispatch(action) {
        this.store.dispatch(action);
      }
    }]);

    return DragDropManagerImpl;
  }();

  function createDragDropManager(backendFactory, globalContext, backendOptions, debugMode) {
    var manager = new DragDropManagerImpl(debugMode);
    var backend = backendFactory(manager, globalContext, backendOptions);
    manager.receiveBackend(backend);
    return manager;
  }

  var DndContext = React.createContext({
    dragDropManager: undefined
  });
  function createDndContext(backend, context, options, debugMode) {
    return {
      dragDropManager: createDragDropManager(backend, context, options, debugMode)
    };
  }

  function _slicedToArray$2(arr, i) {
    return _arrayWithHoles$2(arr) || _iterableToArrayLimit$2(arr, i) || _nonIterableRest$2();
  }

  function _nonIterableRest$2() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function _iterableToArrayLimit$2(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayWithHoles$2(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }
  var refCount$1 = 0;
  var DndProvider = React.memo(function (_ref) {
    var children = _ref.children,
        props = _objectWithoutProperties(_ref, ["children"]);

    var _getDndContextValue = getDndContextValue(props),
        _getDndContextValue2 = _slicedToArray$2(_getDndContextValue, 2),
        manager = _getDndContextValue2[0],
        isGlobalInstance = _getDndContextValue2[1];

    React.useEffect(function () {
      if (isGlobalInstance) {
        refCount$1++;
      }

      return function () {
        if (isGlobalInstance) {
          refCount$1--;

          if (refCount$1 === 0) {
            var context = getGlobalContext();
            context[instanceSymbol] = null;
          }
        }
      };
    }, []);
    return React.createElement(DndContext.Provider, {
      value: manager
    }, children);
  });
  DndProvider.displayName = 'DndProvider';

  function getDndContextValue(props) {
    if ('manager' in props) {
      var _manager = {
        dragDropManager: props.manager
      };
      return [_manager, false];
    }

    var manager = createSingletonDndContext(props.backend, props.context, props.options, props.debugMode);
    var isGlobalInstance = !props.context;
    return [manager, isGlobalInstance];
  }

  var instanceSymbol = Symbol.for('__REACT_DND_CONTEXT_INSTANCE__');

  function createSingletonDndContext(backend) {
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getGlobalContext();
    var options = arguments.length > 2 ? arguments[2] : undefined;
    var debugMode = arguments.length > 3 ? arguments[3] : undefined;
    var ctx = context;

    if (!ctx[instanceSymbol]) {
      ctx[instanceSymbol] = createDndContext(backend, context, options, debugMode);
    }

    return ctx[instanceSymbol];
  }

  function getGlobalContext() {
    return typeof global !== 'undefined' ? global : window;
  }

  var useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

  function shallowEqual(objA, objB, compare, compareContext) {
    var compareResult = compare ? compare.call(compareContext, objA, objB) : void 0;

    if (compareResult !== void 0) {
      return !!compareResult;
    }

    if (objA === objB) {
      return true;
    }

    if (_typeof(objA) !== 'object' || !objA || _typeof(objB) !== 'object' || !objB) {
      return false;
    }

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
      return false;
    }

    var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

    for (var idx = 0; idx < keysA.length; idx++) {
      var key = keysA[idx];

      if (!bHasOwnProperty(key)) {
        return false;
      }

      var valueA = objA[key];
      var valueB = objB[key];
      compareResult = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;

      if (compareResult === false || compareResult === void 0 && valueA !== valueB) {
        return false;
      }
    }

    return true;
  }

  function _slicedToArray$3(arr, i) {
    return _arrayWithHoles$3(arr) || _iterableToArrayLimit$3(arr, i) || _nonIterableRest$3();
  }

  function _nonIterableRest$3() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function _iterableToArrayLimit$3(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayWithHoles$3(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function useCollector(monitor, collect, onUpdate) {
    var _useState = React.useState(function () {
      return collect(monitor);
    }),
        _useState2 = _slicedToArray$3(_useState, 2),
        collected = _useState2[0],
        setCollected = _useState2[1];

    var updateCollected = React.useCallback(function () {
      var nextValue = collect(monitor);

      if (!shallowEqual(collected, nextValue)) {
        setCollected(nextValue);

        if (onUpdate) {
          onUpdate();
        }
      }
    }, [collected, monitor, onUpdate]);
    useIsomorphicLayoutEffect(updateCollected, []);
    return [collected, updateCollected];
  }

  function _slicedToArray$4(arr, i) {
    return _arrayWithHoles$4(arr) || _iterableToArrayLimit$4(arr, i) || _nonIterableRest$4();
  }

  function _nonIterableRest$4() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function _iterableToArrayLimit$4(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayWithHoles$4(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function useMonitorOutput(monitor, collect, onCollect) {
    var _useCollector = useCollector(monitor, collect, onCollect),
        _useCollector2 = _slicedToArray$4(_useCollector, 2),
        collected = _useCollector2[0],
        updateCollected = _useCollector2[1];

    useIsomorphicLayoutEffect(function subscribeToMonitorStateChange() {
      var handlerId = monitor.getHandlerId();

      if (handlerId == null) {
        return undefined;
      }

      return monitor.subscribeToStateChange(updateCollected, {
        handlerIds: [handlerId]
      });
    }, [monitor, updateCollected]);
    return collected;
  }

  function registerTarget(type, target, manager) {
    var registry = manager.getRegistry();
    var targetId = registry.addTarget(type, target);
    return [targetId, function () {
      return registry.removeTarget(targetId);
    }];
  }
  function registerSource(type, source, manager) {
    var registry = manager.getRegistry();
    var sourceId = registry.addSource(type, source);
    return [sourceId, function () {
      return registry.removeSource(sourceId);
    }];
  }

  function useDragDropManager() {
    var _useContext = React.useContext(DndContext),
        dragDropManager = _useContext.dragDropManager;

    invariant(dragDropManager != null, 'Expected drag drop context');
    return dragDropManager;
  }

  function _classCallCheck$4(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties$4(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$4(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$4(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$4(Constructor, staticProps);
    return Constructor;
  }
  var isCallingCanDrag = false;
  var isCallingIsDragging = false;
  var DragSourceMonitorImpl = function () {
    function DragSourceMonitorImpl(manager) {
      _classCallCheck$4(this, DragSourceMonitorImpl);

      this.sourceId = null;
      this.internalMonitor = manager.getMonitor();
    }

    _createClass$4(DragSourceMonitorImpl, [{
      key: "receiveHandlerId",
      value: function receiveHandlerId(sourceId) {
        this.sourceId = sourceId;
      }
    }, {
      key: "getHandlerId",
      value: function getHandlerId() {
        return this.sourceId;
      }
    }, {
      key: "canDrag",
      value: function canDrag() {
        invariant(!isCallingCanDrag, 'You may not call monitor.canDrag() inside your canDrag() implementation. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor');

        try {
          isCallingCanDrag = true;
          return this.internalMonitor.canDragSource(this.sourceId);
        } finally {
          isCallingCanDrag = false;
        }
      }
    }, {
      key: "isDragging",
      value: function isDragging() {
        if (!this.sourceId) {
          return false;
        }

        invariant(!isCallingIsDragging, 'You may not call monitor.isDragging() inside your isDragging() implementation. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor');

        try {
          isCallingIsDragging = true;
          return this.internalMonitor.isDraggingSource(this.sourceId);
        } finally {
          isCallingIsDragging = false;
        }
      }
    }, {
      key: "subscribeToStateChange",
      value: function subscribeToStateChange(listener, options) {
        return this.internalMonitor.subscribeToStateChange(listener, options);
      }
    }, {
      key: "isDraggingSource",
      value: function isDraggingSource(sourceId) {
        return this.internalMonitor.isDraggingSource(sourceId);
      }
    }, {
      key: "isOverTarget",
      value: function isOverTarget(targetId, options) {
        return this.internalMonitor.isOverTarget(targetId, options);
      }
    }, {
      key: "getTargetIds",
      value: function getTargetIds() {
        return this.internalMonitor.getTargetIds();
      }
    }, {
      key: "isSourcePublic",
      value: function isSourcePublic() {
        return this.internalMonitor.isSourcePublic();
      }
    }, {
      key: "getSourceId",
      value: function getSourceId() {
        return this.internalMonitor.getSourceId();
      }
    }, {
      key: "subscribeToOffsetChange",
      value: function subscribeToOffsetChange(listener) {
        return this.internalMonitor.subscribeToOffsetChange(listener);
      }
    }, {
      key: "canDragSource",
      value: function canDragSource(sourceId) {
        return this.internalMonitor.canDragSource(sourceId);
      }
    }, {
      key: "canDropOnTarget",
      value: function canDropOnTarget(targetId) {
        return this.internalMonitor.canDropOnTarget(targetId);
      }
    }, {
      key: "getItemType",
      value: function getItemType() {
        return this.internalMonitor.getItemType();
      }
    }, {
      key: "getItem",
      value: function getItem() {
        return this.internalMonitor.getItem();
      }
    }, {
      key: "getDropResult",
      value: function getDropResult() {
        return this.internalMonitor.getDropResult();
      }
    }, {
      key: "didDrop",
      value: function didDrop() {
        return this.internalMonitor.didDrop();
      }
    }, {
      key: "getInitialClientOffset",
      value: function getInitialClientOffset() {
        return this.internalMonitor.getInitialClientOffset();
      }
    }, {
      key: "getInitialSourceClientOffset",
      value: function getInitialSourceClientOffset() {
        return this.internalMonitor.getInitialSourceClientOffset();
      }
    }, {
      key: "getSourceClientOffset",
      value: function getSourceClientOffset() {
        return this.internalMonitor.getSourceClientOffset();
      }
    }, {
      key: "getClientOffset",
      value: function getClientOffset() {
        return this.internalMonitor.getClientOffset();
      }
    }, {
      key: "getDifferenceFromInitialOffset",
      value: function getDifferenceFromInitialOffset() {
        return this.internalMonitor.getDifferenceFromInitialOffset();
      }
    }]);

    return DragSourceMonitorImpl;
  }();

  function setRef(ref, node) {
    if (typeof ref === 'function') {
      ref(node);
    } else {
      ref.current = node;
    }
  }

  function cloneWithRef(element, newRef) {
    var previousRef = element.ref;
    invariant(typeof previousRef !== 'string', 'Cannot connect React DnD to an element with an existing string ref. ' + 'Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. ' + 'Read more: https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute');

    if (!previousRef) {
      return React.cloneElement(element, {
        ref: newRef
      });
    } else {
      return React.cloneElement(element, {
        ref: function ref(node) {
          setRef(previousRef, node);
          setRef(newRef, node);
        }
      });
    }
  }

  function throwIfCompositeComponentElement(element) {
    if (typeof element.type === 'string') {
      return;
    }

    var displayName = element.type.displayName || element.type.name || 'the component';
    throw new Error('Only native element nodes can now be passed to React DnD connectors.' + "You can either wrap ".concat(displayName, " into a <div>, or turn it into a ") + 'drag source or a drop target itself.');
  }

  function wrapHookToRecognizeElement(hook) {
    return function () {
      var elementOrNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (!React.isValidElement(elementOrNode)) {
        var node = elementOrNode;
        hook(node, options);
        return node;
      }

      var element = elementOrNode;
      throwIfCompositeComponentElement(element);
      var ref = options ? function (node) {
        return hook(node, options);
      } : hook;
      return cloneWithRef(element, ref);
    };
  }

  function wrapConnectorHooks(hooks) {
    var wrappedHooks = {};
    Object.keys(hooks).forEach(function (key) {
      var hook = hooks[key];

      if (key.endsWith('Ref')) {
        wrappedHooks[key] = hooks[key];
      } else {
        var wrappedHook = wrapHookToRecognizeElement(hook);

        wrappedHooks[key] = function () {
          return wrappedHook;
        };
      }
    });
    return wrappedHooks;
  }

  function _typeof$3(obj) {
    if (typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol") {
      _typeof$3 = function _typeof$1(obj) {
        return _typeof(obj);
      };
    } else {
      _typeof$3 = function _typeof$1(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof(obj);
      };
    }

    return _typeof$3(obj);
  }

  function isRef(obj) {
    return obj !== null && _typeof$3(obj) === 'object' && obj.hasOwnProperty('current');
  }

  function _classCallCheck$5(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties$5(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$5(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$5(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$5(Constructor, staticProps);
    return Constructor;
  }
  var SourceConnector = function () {
    function SourceConnector(backend) {
      var _this = this;

      _classCallCheck$5(this, SourceConnector);

      this.hooks = wrapConnectorHooks({
        dragSource: function dragSource(node, options) {
          _this.clearDragSource();

          _this.dragSourceOptions = options || null;

          if (isRef(node)) {
            _this.dragSourceRef = node;
          } else {
            _this.dragSourceNode = node;
          }

          _this.reconnectDragSource();
        },
        dragPreview: function dragPreview(node, options) {
          _this.clearDragPreview();

          _this.dragPreviewOptions = options || null;

          if (isRef(node)) {
            _this.dragPreviewRef = node;
          } else {
            _this.dragPreviewNode = node;
          }

          _this.reconnectDragPreview();
        }
      });
      this.handlerId = null;
      this.dragSourceRef = null;
      this.dragSourceOptionsInternal = null;
      this.dragPreviewRef = null;
      this.dragPreviewOptionsInternal = null;
      this.lastConnectedHandlerId = null;
      this.lastConnectedDragSource = null;
      this.lastConnectedDragSourceOptions = null;
      this.lastConnectedDragPreview = null;
      this.lastConnectedDragPreviewOptions = null;
      this.backend = backend;
    }

    _createClass$5(SourceConnector, [{
      key: "receiveHandlerId",
      value: function receiveHandlerId(newHandlerId) {
        if (this.handlerId === newHandlerId) {
          return;
        }

        this.handlerId = newHandlerId;
        this.reconnect();
      }
    }, {
      key: "reconnect",
      value: function reconnect() {
        this.reconnectDragSource();
        this.reconnectDragPreview();
      }
    }, {
      key: "reconnectDragSource",
      value: function reconnectDragSource() {
        var dragSource = this.dragSource;
        var didChange = this.didHandlerIdChange() || this.didConnectedDragSourceChange() || this.didDragSourceOptionsChange();

        if (didChange) {
          this.disconnectDragSource();
        }

        if (!this.handlerId) {
          return;
        }

        if (!dragSource) {
          this.lastConnectedDragSource = dragSource;
          return;
        }

        if (didChange) {
          this.lastConnectedHandlerId = this.handlerId;
          this.lastConnectedDragSource = dragSource;
          this.lastConnectedDragSourceOptions = this.dragSourceOptions;
          this.dragSourceUnsubscribe = this.backend.connectDragSource(this.handlerId, dragSource, this.dragSourceOptions);
        }
      }
    }, {
      key: "reconnectDragPreview",
      value: function reconnectDragPreview() {
        var dragPreview = this.dragPreview;
        var didChange = this.didHandlerIdChange() || this.didConnectedDragPreviewChange() || this.didDragPreviewOptionsChange();

        if (!this.handlerId) {
          this.disconnectDragPreview();
        } else if (this.dragPreview && didChange) {
          this.lastConnectedHandlerId = this.handlerId;
          this.lastConnectedDragPreview = dragPreview;
          this.lastConnectedDragPreviewOptions = this.dragPreviewOptions;
          this.disconnectDragPreview();
          this.dragPreviewUnsubscribe = this.backend.connectDragPreview(this.handlerId, dragPreview, this.dragPreviewOptions);
        }
      }
    }, {
      key: "didHandlerIdChange",
      value: function didHandlerIdChange() {
        return this.lastConnectedHandlerId !== this.handlerId;
      }
    }, {
      key: "didConnectedDragSourceChange",
      value: function didConnectedDragSourceChange() {
        return this.lastConnectedDragSource !== this.dragSource;
      }
    }, {
      key: "didConnectedDragPreviewChange",
      value: function didConnectedDragPreviewChange() {
        return this.lastConnectedDragPreview !== this.dragPreview;
      }
    }, {
      key: "didDragSourceOptionsChange",
      value: function didDragSourceOptionsChange() {
        return !shallowEqual(this.lastConnectedDragSourceOptions, this.dragSourceOptions);
      }
    }, {
      key: "didDragPreviewOptionsChange",
      value: function didDragPreviewOptionsChange() {
        return !shallowEqual(this.lastConnectedDragPreviewOptions, this.dragPreviewOptions);
      }
    }, {
      key: "disconnectDragSource",
      value: function disconnectDragSource() {
        if (this.dragSourceUnsubscribe) {
          this.dragSourceUnsubscribe();
          this.dragSourceUnsubscribe = undefined;
        }
      }
    }, {
      key: "disconnectDragPreview",
      value: function disconnectDragPreview() {
        if (this.dragPreviewUnsubscribe) {
          this.dragPreviewUnsubscribe();
          this.dragPreviewUnsubscribe = undefined;
          this.dragPreviewNode = null;
          this.dragPreviewRef = null;
        }
      }
    }, {
      key: "clearDragSource",
      value: function clearDragSource() {
        this.dragSourceNode = null;
        this.dragSourceRef = null;
      }
    }, {
      key: "clearDragPreview",
      value: function clearDragPreview() {
        this.dragPreviewNode = null;
        this.dragPreviewRef = null;
      }
    }, {
      key: "connectTarget",
      get: function get() {
        return this.dragSource;
      }
    }, {
      key: "dragSourceOptions",
      get: function get() {
        return this.dragSourceOptionsInternal;
      },
      set: function set(options) {
        this.dragSourceOptionsInternal = options;
      }
    }, {
      key: "dragPreviewOptions",
      get: function get() {
        return this.dragPreviewOptionsInternal;
      },
      set: function set(options) {
        this.dragPreviewOptionsInternal = options;
      }
    }, {
      key: "dragSource",
      get: function get() {
        return this.dragSourceNode || this.dragSourceRef && this.dragSourceRef.current;
      }
    }, {
      key: "dragPreview",
      get: function get() {
        return this.dragPreviewNode || this.dragPreviewRef && this.dragPreviewRef.current;
      }
    }]);

    return SourceConnector;
  }();

  function _slicedToArray$5(arr, i) {
    return _arrayWithHoles$5(arr) || _iterableToArrayLimit$5(arr, i) || _nonIterableRest$5();
  }

  function _nonIterableRest$5() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function _iterableToArrayLimit$5(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayWithHoles$5(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _typeof$4(obj) {
    if (typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol") {
      _typeof$4 = function _typeof$1(obj) {
        return _typeof(obj);
      };
    } else {
      _typeof$4 = function _typeof$1(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof(obj);
      };
    }

    return _typeof$4(obj);
  }
  function useDragSourceMonitor() {
    var manager = useDragDropManager();
    var monitor = React.useMemo(function () {
      return new DragSourceMonitorImpl(manager);
    }, [manager]);
    var connector = React.useMemo(function () {
      return new SourceConnector(manager.getBackend());
    }, [manager]);
    return [monitor, connector];
  }
  function useDragHandler(spec, monitor, connector) {
    var manager = useDragDropManager();
    var handler = React.useMemo(function () {
      return {
        beginDrag: function beginDrag() {
          var _spec$current = spec.current,
              begin = _spec$current.begin,
              item = _spec$current.item;

          if (begin) {
            var beginResult = begin(monitor);
            invariant(beginResult == null || _typeof$4(beginResult) === 'object', 'dragSpec.begin() must either return an object, undefined, or null');
            return beginResult || item || {};
          }

          return item || {};
        },
        canDrag: function canDrag() {
          if (typeof spec.current.canDrag === 'boolean') {
            return spec.current.canDrag;
          } else if (typeof spec.current.canDrag === 'function') {
            return spec.current.canDrag(monitor);
          } else {
            return true;
          }
        },
        isDragging: function isDragging(globalMonitor, target) {
          var isDragging = spec.current.isDragging;
          return isDragging ? isDragging(monitor) : target === globalMonitor.getSourceId();
        },
        endDrag: function endDrag() {
          var end = spec.current.end;

          if (end) {
            end(monitor.getItem(), monitor);
          }

          connector.reconnect();
        }
      };
    }, []);
    useIsomorphicLayoutEffect(function registerHandler() {
      var _registerSource = registerSource(spec.current.item.type, handler, manager),
          _registerSource2 = _slicedToArray$5(_registerSource, 2),
          handlerId = _registerSource2[0],
          unregister = _registerSource2[1];

      monitor.receiveHandlerId(handlerId);
      connector.receiveHandlerId(handlerId);
      return unregister;
    }, []);
  }

  function _slicedToArray$6(arr, i) {
    return _arrayWithHoles$6(arr) || _iterableToArrayLimit$6(arr, i) || _nonIterableRest$6();
  }

  function _nonIterableRest$6() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function _iterableToArrayLimit$6(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayWithHoles$6(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function useDrag(spec) {
    var specRef = React.useRef(spec);
    specRef.current = spec;
    invariant(spec.item != null, 'item must be defined');
    invariant(spec.item.type != null, 'item type must be defined');

    var _useDragSourceMonitor = useDragSourceMonitor(),
        _useDragSourceMonitor2 = _slicedToArray$6(_useDragSourceMonitor, 2),
        monitor = _useDragSourceMonitor2[0],
        connector = _useDragSourceMonitor2[1];

    useDragHandler(specRef, monitor, connector);
    var result = useMonitorOutput(monitor, specRef.current.collect || function () {
      return {};
    }, function () {
      return connector.reconnect();
    });
    var connectDragSource = React.useMemo(function () {
      return connector.hooks.dragSource();
    }, [connector]);
    var connectDragPreview = React.useMemo(function () {
      return connector.hooks.dragPreview();
    }, [connector]);
    useIsomorphicLayoutEffect(function () {
      connector.dragSourceOptions = specRef.current.options || null;
      connector.reconnect();
    }, [connector]);
    useIsomorphicLayoutEffect(function () {
      connector.dragPreviewOptions = specRef.current.previewOptions || null;
      connector.reconnect();
    }, [connector]);
    return [result, connectDragSource, connectDragPreview];
  }

  function _classCallCheck$6(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties$6(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$6(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$6(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$6(Constructor, staticProps);
    return Constructor;
  }
  var TargetConnector = function () {
    function TargetConnector(backend) {
      var _this = this;

      _classCallCheck$6(this, TargetConnector);

      this.hooks = wrapConnectorHooks({
        dropTarget: function dropTarget(node, options) {
          _this.clearDropTarget();

          _this.dropTargetOptions = options;

          if (isRef(node)) {
            _this.dropTargetRef = node;
          } else {
            _this.dropTargetNode = node;
          }

          _this.reconnect();
        }
      });
      this.handlerId = null;
      this.dropTargetRef = null;
      this.dropTargetOptionsInternal = null;
      this.lastConnectedHandlerId = null;
      this.lastConnectedDropTarget = null;
      this.lastConnectedDropTargetOptions = null;
      this.backend = backend;
    }

    _createClass$6(TargetConnector, [{
      key: "reconnect",
      value: function reconnect() {
        var didChange = this.didHandlerIdChange() || this.didDropTargetChange() || this.didOptionsChange();

        if (didChange) {
          this.disconnectDropTarget();
        }

        var dropTarget = this.dropTarget;

        if (!this.handlerId) {
          return;
        }

        if (!dropTarget) {
          this.lastConnectedDropTarget = dropTarget;
          return;
        }

        if (didChange) {
          this.lastConnectedHandlerId = this.handlerId;
          this.lastConnectedDropTarget = dropTarget;
          this.lastConnectedDropTargetOptions = this.dropTargetOptions;
          this.unsubscribeDropTarget = this.backend.connectDropTarget(this.handlerId, dropTarget, this.dropTargetOptions);
        }
      }
    }, {
      key: "receiveHandlerId",
      value: function receiveHandlerId(newHandlerId) {
        if (newHandlerId === this.handlerId) {
          return;
        }

        this.handlerId = newHandlerId;
        this.reconnect();
      }
    }, {
      key: "didHandlerIdChange",
      value: function didHandlerIdChange() {
        return this.lastConnectedHandlerId !== this.handlerId;
      }
    }, {
      key: "didDropTargetChange",
      value: function didDropTargetChange() {
        return this.lastConnectedDropTarget !== this.dropTarget;
      }
    }, {
      key: "didOptionsChange",
      value: function didOptionsChange() {
        return !shallowEqual(this.lastConnectedDropTargetOptions, this.dropTargetOptions);
      }
    }, {
      key: "disconnectDropTarget",
      value: function disconnectDropTarget() {
        if (this.unsubscribeDropTarget) {
          this.unsubscribeDropTarget();
          this.unsubscribeDropTarget = undefined;
        }
      }
    }, {
      key: "clearDropTarget",
      value: function clearDropTarget() {
        this.dropTargetRef = null;
        this.dropTargetNode = null;
      }
    }, {
      key: "connectTarget",
      get: function get() {
        return this.dropTarget;
      }
    }, {
      key: "dropTargetOptions",
      get: function get() {
        return this.dropTargetOptionsInternal;
      },
      set: function set(options) {
        this.dropTargetOptionsInternal = options;
      }
    }, {
      key: "dropTarget",
      get: function get() {
        return this.dropTargetNode || this.dropTargetRef && this.dropTargetRef.current;
      }
    }]);

    return TargetConnector;
  }();

  function _classCallCheck$7(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties$7(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$7(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$7(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$7(Constructor, staticProps);
    return Constructor;
  }
  var isCallingCanDrop = false;
  var DropTargetMonitorImpl = function () {
    function DropTargetMonitorImpl(manager) {
      _classCallCheck$7(this, DropTargetMonitorImpl);

      this.targetId = null;
      this.internalMonitor = manager.getMonitor();
    }

    _createClass$7(DropTargetMonitorImpl, [{
      key: "receiveHandlerId",
      value: function receiveHandlerId(targetId) {
        this.targetId = targetId;
      }
    }, {
      key: "getHandlerId",
      value: function getHandlerId() {
        return this.targetId;
      }
    }, {
      key: "subscribeToStateChange",
      value: function subscribeToStateChange(listener, options) {
        return this.internalMonitor.subscribeToStateChange(listener, options);
      }
    }, {
      key: "canDrop",
      value: function canDrop() {
        if (!this.targetId) {
          return false;
        }

        invariant(!isCallingCanDrop, 'You may not call monitor.canDrop() inside your canDrop() implementation. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target-monitor');

        try {
          isCallingCanDrop = true;
          return this.internalMonitor.canDropOnTarget(this.targetId);
        } finally {
          isCallingCanDrop = false;
        }
      }
    }, {
      key: "isOver",
      value: function isOver(options) {
        if (!this.targetId) {
          return false;
        }

        return this.internalMonitor.isOverTarget(this.targetId, options);
      }
    }, {
      key: "getItemType",
      value: function getItemType() {
        return this.internalMonitor.getItemType();
      }
    }, {
      key: "getItem",
      value: function getItem() {
        return this.internalMonitor.getItem();
      }
    }, {
      key: "getDropResult",
      value: function getDropResult() {
        return this.internalMonitor.getDropResult();
      }
    }, {
      key: "didDrop",
      value: function didDrop() {
        return this.internalMonitor.didDrop();
      }
    }, {
      key: "getInitialClientOffset",
      value: function getInitialClientOffset() {
        return this.internalMonitor.getInitialClientOffset();
      }
    }, {
      key: "getInitialSourceClientOffset",
      value: function getInitialSourceClientOffset() {
        return this.internalMonitor.getInitialSourceClientOffset();
      }
    }, {
      key: "getSourceClientOffset",
      value: function getSourceClientOffset() {
        return this.internalMonitor.getSourceClientOffset();
      }
    }, {
      key: "getClientOffset",
      value: function getClientOffset() {
        return this.internalMonitor.getClientOffset();
      }
    }, {
      key: "getDifferenceFromInitialOffset",
      value: function getDifferenceFromInitialOffset() {
        return this.internalMonitor.getDifferenceFromInitialOffset();
      }
    }]);

    return DropTargetMonitorImpl;
  }();

  function _slicedToArray$7(arr, i) {
    return _arrayWithHoles$7(arr) || _iterableToArrayLimit$7(arr, i) || _nonIterableRest$7();
  }

  function _nonIterableRest$7() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function _iterableToArrayLimit$7(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayWithHoles$7(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function useDropTargetMonitor() {
    var manager = useDragDropManager();
    var monitor = React.useMemo(function () {
      return new DropTargetMonitorImpl(manager);
    }, [manager]);
    var connector = React.useMemo(function () {
      return new TargetConnector(manager.getBackend());
    }, [manager]);
    return [monitor, connector];
  }
  function useDropHandler(spec, monitor, connector) {
    var manager = useDragDropManager();
    var handler = React.useMemo(function () {
      return {
        canDrop: function canDrop() {
          var canDrop = spec.current.canDrop;
          return canDrop ? canDrop(monitor.getItem(), monitor) : true;
        },
        hover: function hover() {
          var hover = spec.current.hover;

          if (hover) {
            hover(monitor.getItem(), monitor);
          }
        },
        drop: function drop() {
          var drop = spec.current.drop;

          if (drop) {
            return drop(monitor.getItem(), monitor);
          }
        }
      };
    }, [monitor]);
    useIsomorphicLayoutEffect(function registerHandler() {
      var _registerTarget = registerTarget(spec.current.accept, handler, manager),
          _registerTarget2 = _slicedToArray$7(_registerTarget, 2),
          handlerId = _registerTarget2[0],
          unregister = _registerTarget2[1];

      monitor.receiveHandlerId(handlerId);
      connector.receiveHandlerId(handlerId);
      return unregister;
    }, [monitor, connector]);
  }

  function _slicedToArray$8(arr, i) {
    return _arrayWithHoles$8(arr) || _iterableToArrayLimit$8(arr, i) || _nonIterableRest$8();
  }

  function _nonIterableRest$8() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function _iterableToArrayLimit$8(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayWithHoles$8(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function useDrop(spec) {
    var specRef = React.useRef(spec);
    specRef.current = spec;
    invariant(spec.accept != null, 'accept must be defined');

    var _useDropTargetMonitor = useDropTargetMonitor(),
        _useDropTargetMonitor2 = _slicedToArray$8(_useDropTargetMonitor, 2),
        monitor = _useDropTargetMonitor2[0],
        connector = _useDropTargetMonitor2[1];

    useDropHandler(specRef, monitor, connector);
    var result = useMonitorOutput(monitor, specRef.current.collect || function () {
      return {};
    }, function () {
      return connector.reconnect();
    });
    var connectDropTarget = React.useMemo(function () {
      return connector.hooks.dropTarget();
    }, [connector]);
    useIsomorphicLayoutEffect(function () {
      connector.dropTargetOptions = spec.options || null;
      connector.reconnect();
    }, [spec.options]);
    return [result, connectDropTarget];
  }

  function memoize(fn) {
    var result = null;

    var memoized = function memoized() {
      if (result == null) {
        result = fn();
      }

      return result;
    };

    return memoized;
  }
  function without$1(items, item) {
    return items.filter(function (i) {
      return i !== item;
    });
  }
  function union(itemsA, itemsB) {
    var set = new Set();

    var insertItem = function insertItem(item) {
      return set.add(item);
    };

    itemsA.forEach(insertItem);
    itemsB.forEach(insertItem);
    var result = [];
    set.forEach(function (key) {
      return result.push(key);
    });
    return result;
  }

  function _classCallCheck$8(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties$8(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$8(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$8(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$8(Constructor, staticProps);
    return Constructor;
  }

  var EnterLeaveCounter = function () {
    function EnterLeaveCounter(isNodeInDocument) {
      _classCallCheck$8(this, EnterLeaveCounter);

      this.entered = [];
      this.isNodeInDocument = isNodeInDocument;
    }

    _createClass$8(EnterLeaveCounter, [{
      key: "enter",
      value: function enter(enteringNode) {
        var _this = this;

        var previousLength = this.entered.length;

        var isNodeEntered = function isNodeEntered(node) {
          return _this.isNodeInDocument(node) && (!node.contains || node.contains(enteringNode));
        };

        this.entered = union(this.entered.filter(isNodeEntered), [enteringNode]);
        return previousLength === 0 && this.entered.length > 0;
      }
    }, {
      key: "leave",
      value: function leave(leavingNode) {
        var previousLength = this.entered.length;
        this.entered = without$1(this.entered.filter(this.isNodeInDocument), leavingNode);
        return previousLength > 0 && this.entered.length === 0;
      }
    }, {
      key: "reset",
      value: function reset() {
        this.entered = [];
      }
    }]);

    return EnterLeaveCounter;
  }();

  var isFirefox = memoize(function () {
    return /firefox/i.test(navigator.userAgent);
  });
  var isSafari = memoize(function () {
    return Boolean(window.safari);
  });

  function _classCallCheck$9(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties$9(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$9(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$9(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$9(Constructor, staticProps);
    return Constructor;
  }

  var MonotonicInterpolant = function () {
    function MonotonicInterpolant(xs, ys) {
      _classCallCheck$9(this, MonotonicInterpolant);

      var length = xs.length;
      var indexes = [];

      for (var i = 0; i < length; i++) {
        indexes.push(i);
      }

      indexes.sort(function (a, b) {
        return xs[a] < xs[b] ? -1 : 1;
      });
      var dxs = [];
      var ms = [];
      var dx;
      var dy;

      for (var _i = 0; _i < length - 1; _i++) {
        dx = xs[_i + 1] - xs[_i];
        dy = ys[_i + 1] - ys[_i];
        dxs.push(dx);
        ms.push(dy / dx);
      }

      var c1s = [ms[0]];

      for (var _i2 = 0; _i2 < dxs.length - 1; _i2++) {
        var m2 = ms[_i2];
        var mNext = ms[_i2 + 1];

        if (m2 * mNext <= 0) {
          c1s.push(0);
        } else {
          dx = dxs[_i2];
          var dxNext = dxs[_i2 + 1];
          var common = dx + dxNext;
          c1s.push(3 * common / ((common + dxNext) / m2 + (common + dx) / mNext));
        }
      }

      c1s.push(ms[ms.length - 1]);
      var c2s = [];
      var c3s = [];
      var m;

      for (var _i3 = 0; _i3 < c1s.length - 1; _i3++) {
        m = ms[_i3];
        var c1 = c1s[_i3];
        var invDx = 1 / dxs[_i3];

        var _common = c1 + c1s[_i3 + 1] - m - m;

        c2s.push((m - c1 - _common) * invDx);
        c3s.push(_common * invDx * invDx);
      }

      this.xs = xs;
      this.ys = ys;
      this.c1s = c1s;
      this.c2s = c2s;
      this.c3s = c3s;
    }

    _createClass$9(MonotonicInterpolant, [{
      key: "interpolate",
      value: function interpolate(x) {
        var xs = this.xs,
            ys = this.ys,
            c1s = this.c1s,
            c2s = this.c2s,
            c3s = this.c3s;
        var i = xs.length - 1;

        if (x === xs[i]) {
          return ys[i];
        }

        var low = 0;
        var high = c3s.length - 1;
        var mid;

        while (low <= high) {
          mid = Math.floor(0.5 * (low + high));
          var xHere = xs[mid];

          if (xHere < x) {
            low = mid + 1;
          } else if (xHere > x) {
            high = mid - 1;
          } else {
            return ys[mid];
          }
        }

        i = Math.max(0, high);
        var diff = x - xs[i];
        var diffSq = diff * diff;
        return ys[i] + c1s[i] * diff + c2s[i] * diffSq + c3s[i] * diff * diffSq;
      }
    }]);

    return MonotonicInterpolant;
  }();

  var ELEMENT_NODE = 1;
  function getNodeClientOffset(node) {
    var el = node.nodeType === ELEMENT_NODE ? node : node.parentElement;

    if (!el) {
      return null;
    }

    var _el$getBoundingClient = el.getBoundingClientRect(),
        top = _el$getBoundingClient.top,
        left = _el$getBoundingClient.left;

    return {
      x: left,
      y: top
    };
  }
  function getEventClientOffset(e) {
    return {
      x: e.clientX,
      y: e.clientY
    };
  }

  function isImageNode(node) {
    return node.nodeName === 'IMG' && (isFirefox() || !document.documentElement.contains(node));
  }

  function getDragPreviewSize(isImage, dragPreview, sourceWidth, sourceHeight) {
    var dragPreviewWidth = isImage ? dragPreview.width : sourceWidth;
    var dragPreviewHeight = isImage ? dragPreview.height : sourceHeight;

    if (isSafari() && isImage) {
      dragPreviewHeight /= window.devicePixelRatio;
      dragPreviewWidth /= window.devicePixelRatio;
    }

    return {
      dragPreviewWidth: dragPreviewWidth,
      dragPreviewHeight: dragPreviewHeight
    };
  }

  function getDragPreviewOffset(sourceNode, dragPreview, clientOffset, anchorPoint, offsetPoint) {
    var isImage = isImageNode(dragPreview);
    var dragPreviewNode = isImage ? sourceNode : dragPreview;
    var dragPreviewNodeOffsetFromClient = getNodeClientOffset(dragPreviewNode);
    var offsetFromDragPreview = {
      x: clientOffset.x - dragPreviewNodeOffsetFromClient.x,
      y: clientOffset.y - dragPreviewNodeOffsetFromClient.y
    };
    var sourceWidth = sourceNode.offsetWidth,
        sourceHeight = sourceNode.offsetHeight;
    var anchorX = anchorPoint.anchorX,
        anchorY = anchorPoint.anchorY;

    var _getDragPreviewSize = getDragPreviewSize(isImage, dragPreview, sourceWidth, sourceHeight),
        dragPreviewWidth = _getDragPreviewSize.dragPreviewWidth,
        dragPreviewHeight = _getDragPreviewSize.dragPreviewHeight;

    var calculateYOffset = function calculateYOffset() {
      var interpolantY = new MonotonicInterpolant([0, 0.5, 1], [offsetFromDragPreview.y, offsetFromDragPreview.y / sourceHeight * dragPreviewHeight, offsetFromDragPreview.y + dragPreviewHeight - sourceHeight]);
      var y = interpolantY.interpolate(anchorY);

      if (isSafari() && isImage) {
        y += (window.devicePixelRatio - 1) * dragPreviewHeight;
      }

      return y;
    };

    var calculateXOffset = function calculateXOffset() {
      var interpolantX = new MonotonicInterpolant([0, 0.5, 1], [offsetFromDragPreview.x, offsetFromDragPreview.x / sourceWidth * dragPreviewWidth, offsetFromDragPreview.x + dragPreviewWidth - sourceWidth]);
      return interpolantX.interpolate(anchorX);
    };

    var offsetX = offsetPoint.offsetX,
        offsetY = offsetPoint.offsetY;
    var isManualOffsetX = offsetX === 0 || offsetX;
    var isManualOffsetY = offsetY === 0 || offsetY;
    return {
      x: isManualOffsetX ? offsetX : calculateXOffset(),
      y: isManualOffsetY ? offsetY : calculateYOffset()
    };
  }

  var FILE = '__NATIVE_FILE__';
  var URL = '__NATIVE_URL__';
  var TEXT = '__NATIVE_TEXT__';

  var NativeTypes = /*#__PURE__*/Object.freeze({
    __proto__: null,
    FILE: FILE,
    URL: URL,
    TEXT: TEXT
  });

  function getDataFromDataTransfer(dataTransfer, typesToTry, defaultValue) {
    var result = typesToTry.reduce(function (resultSoFar, typeToTry) {
      return resultSoFar || dataTransfer.getData(typeToTry);
    }, '');
    return result != null ? result : defaultValue;
  }

  var _nativeTypesConfig;

  function _defineProperty$5(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }
  var nativeTypesConfig = (_nativeTypesConfig = {}, _defineProperty$5(_nativeTypesConfig, FILE, {
    exposeProperties: {
      files: function files(dataTransfer) {
        return Array.prototype.slice.call(dataTransfer.files);
      },
      items: function items(dataTransfer) {
        return dataTransfer.items;
      }
    },
    matchesTypes: ['Files']
  }), _defineProperty$5(_nativeTypesConfig, URL, {
    exposeProperties: {
      urls: function urls(dataTransfer, matchesTypes) {
        return getDataFromDataTransfer(dataTransfer, matchesTypes, '').split('\n');
      }
    },
    matchesTypes: ['Url', 'text/uri-list']
  }), _defineProperty$5(_nativeTypesConfig, TEXT, {
    exposeProperties: {
      text: function text(dataTransfer, matchesTypes) {
        return getDataFromDataTransfer(dataTransfer, matchesTypes, '');
      }
    },
    matchesTypes: ['Text', 'text/plain']
  }), _nativeTypesConfig);

  function _classCallCheck$a(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties$a(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$a(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$a(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$a(Constructor, staticProps);
    return Constructor;
  }

  var NativeDragSource = function () {
    function NativeDragSource(config) {
      _classCallCheck$a(this, NativeDragSource);

      this.config = config;
      this.item = {};
      this.initializeExposedProperties();
    }

    _createClass$a(NativeDragSource, [{
      key: "initializeExposedProperties",
      value: function initializeExposedProperties() {
        var _this = this;

        Object.keys(this.config.exposeProperties).forEach(function (property) {
          Object.defineProperty(_this.item, property, {
            configurable: true,
            enumerable: true,
            get: function get() {
              console.warn("Browser doesn't allow reading \"".concat(property, "\" until the drop event."));
              return null;
            }
          });
        });
      }
    }, {
      key: "loadDataTransfer",
      value: function loadDataTransfer(dataTransfer) {
        var _this2 = this;

        if (dataTransfer) {
          var newProperties = {};
          Object.keys(this.config.exposeProperties).forEach(function (property) {
            newProperties[property] = {
              value: _this2.config.exposeProperties[property](dataTransfer, _this2.config.matchesTypes),
              configurable: true,
              enumerable: true
            };
          });
          Object.defineProperties(this.item, newProperties);
        }
      }
    }, {
      key: "canDrag",
      value: function canDrag() {
        return true;
      }
    }, {
      key: "beginDrag",
      value: function beginDrag() {
        return this.item;
      }
    }, {
      key: "isDragging",
      value: function isDragging(monitor, handle) {
        return handle === monitor.getSourceId();
      }
    }, {
      key: "endDrag",
      value: function endDrag() {}
    }]);

    return NativeDragSource;
  }();

  function createNativeDragSource(type, dataTransfer) {
    var result = new NativeDragSource(nativeTypesConfig[type]);
    result.loadDataTransfer(dataTransfer);
    return result;
  }
  function matchNativeItemType(dataTransfer) {
    if (!dataTransfer) {
      return null;
    }

    var dataTransferTypes = Array.prototype.slice.call(dataTransfer.types || []);
    return Object.keys(nativeTypesConfig).filter(function (nativeItemType) {
      var matchesTypes = nativeTypesConfig[nativeItemType].matchesTypes;
      return matchesTypes.some(function (t) {
        return dataTransferTypes.indexOf(t) > -1;
      });
    })[0] || null;
  }

  function _classCallCheck$b(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties$b(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$b(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$b(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$b(Constructor, staticProps);
    return Constructor;
  }

  var OptionsReader = function () {
    function OptionsReader(globalContext) {
      _classCallCheck$b(this, OptionsReader);

      this.globalContext = globalContext;
    }

    _createClass$b(OptionsReader, [{
      key: "window",
      get: function get() {
        if (this.globalContext) {
          return this.globalContext;
        } else if (typeof window !== 'undefined') {
          return window;
        }

        return undefined;
      }
    }, {
      key: "document",
      get: function get() {
        if (this.window) {
          return this.window.document;
        }

        return undefined;
      }
    }]);

    return OptionsReader;
  }();

  function ownKeys$4(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread$4(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys$4(Object(source), true).forEach(function (key) {
          _defineProperty$6(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys$4(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _defineProperty$6(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _classCallCheck$c(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties$c(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$c(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$c(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$c(Constructor, staticProps);
    return Constructor;
  }

  var HTML5Backend = function () {
    function HTML5Backend(manager, globalContext) {
      var _this = this;

      _classCallCheck$c(this, HTML5Backend);

      this.sourcePreviewNodes = new Map();
      this.sourcePreviewNodeOptions = new Map();
      this.sourceNodes = new Map();
      this.sourceNodeOptions = new Map();
      this.dragStartSourceIds = null;
      this.dropTargetIds = [];
      this.dragEnterTargetIds = [];
      this.currentNativeSource = null;
      this.currentNativeHandle = null;
      this.currentDragSourceNode = null;
      this.altKeyPressed = false;
      this.mouseMoveTimeoutTimer = null;
      this.asyncEndDragFrameId = null;
      this.dragOverTargetIds = null;

      this.getSourceClientOffset = function (sourceId) {
        return getNodeClientOffset(_this.sourceNodes.get(sourceId));
      };

      this.endDragNativeItem = function () {
        if (!_this.isDraggingNativeItem()) {
          return;
        }

        _this.actions.endDrag();

        _this.registry.removeSource(_this.currentNativeHandle);

        _this.currentNativeHandle = null;
        _this.currentNativeSource = null;
      };

      this.isNodeInDocument = function (node) {
        return _this.document && _this.document.body && document.body.contains(node);
      };

      this.endDragIfSourceWasRemovedFromDOM = function () {
        var node = _this.currentDragSourceNode;

        if (_this.isNodeInDocument(node)) {
          return;
        }

        if (_this.clearCurrentDragSourceNode()) {
          _this.actions.endDrag();
        }
      };

      this.handleTopDragStartCapture = function () {
        _this.clearCurrentDragSourceNode();

        _this.dragStartSourceIds = [];
      };

      this.handleTopDragStart = function (e) {
        if (e.defaultPrevented) {
          return;
        }

        var dragStartSourceIds = _this.dragStartSourceIds;
        _this.dragStartSourceIds = null;
        var clientOffset = getEventClientOffset(e);

        if (_this.monitor.isDragging()) {
          _this.actions.endDrag();
        }

        _this.actions.beginDrag(dragStartSourceIds || [], {
          publishSource: false,
          getSourceClientOffset: _this.getSourceClientOffset,
          clientOffset: clientOffset
        });

        var dataTransfer = e.dataTransfer;
        var nativeType = matchNativeItemType(dataTransfer);

        if (_this.monitor.isDragging()) {
          if (dataTransfer && typeof dataTransfer.setDragImage === 'function') {
            var sourceId = _this.monitor.getSourceId();

            var sourceNode = _this.sourceNodes.get(sourceId);

            var dragPreview = _this.sourcePreviewNodes.get(sourceId) || sourceNode;

            if (dragPreview) {
              var _this$getCurrentSourc = _this.getCurrentSourcePreviewNodeOptions(),
                  anchorX = _this$getCurrentSourc.anchorX,
                  anchorY = _this$getCurrentSourc.anchorY,
                  offsetX = _this$getCurrentSourc.offsetX,
                  offsetY = _this$getCurrentSourc.offsetY;

              var anchorPoint = {
                anchorX: anchorX,
                anchorY: anchorY
              };
              var offsetPoint = {
                offsetX: offsetX,
                offsetY: offsetY
              };
              var dragPreviewOffset = getDragPreviewOffset(sourceNode, dragPreview, clientOffset, anchorPoint, offsetPoint);
              dataTransfer.setDragImage(dragPreview, dragPreviewOffset.x, dragPreviewOffset.y);
            }
          }

          try {
            dataTransfer.setData('application/json', {});
          } catch (err) {}

          _this.setCurrentDragSourceNode(e.target);

          var _this$getCurrentSourc2 = _this.getCurrentSourcePreviewNodeOptions(),
              captureDraggingState = _this$getCurrentSourc2.captureDraggingState;

          if (!captureDraggingState) {
            setTimeout(function () {
              return _this.actions.publishDragSource();
            }, 0);
          } else {
            _this.actions.publishDragSource();
          }
        } else if (nativeType) {
          _this.beginDragNativeItem(nativeType);
        } else if (dataTransfer && !dataTransfer.types && (e.target && !e.target.hasAttribute || !e.target.hasAttribute('draggable'))) {
          return;
        } else {
          e.preventDefault();
        }
      };

      this.handleTopDragEndCapture = function () {
        if (_this.clearCurrentDragSourceNode()) {
          _this.actions.endDrag();
        }
      };

      this.handleTopDragEnterCapture = function (e) {
        _this.dragEnterTargetIds = [];

        var isFirstEnter = _this.enterLeaveCounter.enter(e.target);

        if (!isFirstEnter || _this.monitor.isDragging()) {
          return;
        }

        var dataTransfer = e.dataTransfer;
        var nativeType = matchNativeItemType(dataTransfer);

        if (nativeType) {
          _this.beginDragNativeItem(nativeType, dataTransfer);
        }
      };

      this.handleTopDragEnter = function (e) {
        var dragEnterTargetIds = _this.dragEnterTargetIds;
        _this.dragEnterTargetIds = [];

        if (!_this.monitor.isDragging()) {
          return;
        }

        _this.altKeyPressed = e.altKey;

        if (!isFirefox()) {
          _this.actions.hover(dragEnterTargetIds, {
            clientOffset: getEventClientOffset(e)
          });
        }

        var canDrop = dragEnterTargetIds.some(function (targetId) {
          return _this.monitor.canDropOnTarget(targetId);
        });

        if (canDrop) {
          e.preventDefault();

          if (e.dataTransfer) {
            e.dataTransfer.dropEffect = _this.getCurrentDropEffect();
          }
        }
      };

      this.handleTopDragOverCapture = function () {
        _this.dragOverTargetIds = [];
      };

      this.handleTopDragOver = function (e) {
        var dragOverTargetIds = _this.dragOverTargetIds;
        _this.dragOverTargetIds = [];

        if (!_this.monitor.isDragging()) {
          e.preventDefault();

          if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'none';
          }

          return;
        }

        _this.altKeyPressed = e.altKey;

        _this.actions.hover(dragOverTargetIds || [], {
          clientOffset: getEventClientOffset(e)
        });

        var canDrop = (dragOverTargetIds || []).some(function (targetId) {
          return _this.monitor.canDropOnTarget(targetId);
        });

        if (canDrop) {
          e.preventDefault();

          if (e.dataTransfer) {
            e.dataTransfer.dropEffect = _this.getCurrentDropEffect();
          }
        } else if (_this.isDraggingNativeItem()) {
          e.preventDefault();
        } else {
          e.preventDefault();

          if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'none';
          }
        }
      };

      this.handleTopDragLeaveCapture = function (e) {
        if (_this.isDraggingNativeItem()) {
          e.preventDefault();
        }

        var isLastLeave = _this.enterLeaveCounter.leave(e.target);

        if (!isLastLeave) {
          return;
        }

        if (_this.isDraggingNativeItem()) {
          _this.endDragNativeItem();
        }
      };

      this.handleTopDropCapture = function (e) {
        _this.dropTargetIds = [];
        e.preventDefault();

        if (_this.isDraggingNativeItem()) {
          _this.currentNativeSource.loadDataTransfer(e.dataTransfer);
        }

        _this.enterLeaveCounter.reset();
      };

      this.handleTopDrop = function (e) {
        var dropTargetIds = _this.dropTargetIds;
        _this.dropTargetIds = [];

        _this.actions.hover(dropTargetIds, {
          clientOffset: getEventClientOffset(e)
        });

        _this.actions.drop({
          dropEffect: _this.getCurrentDropEffect()
        });

        if (_this.isDraggingNativeItem()) {
          _this.endDragNativeItem();
        } else {
          _this.endDragIfSourceWasRemovedFromDOM();
        }
      };

      this.handleSelectStart = function (e) {
        var target = e.target;

        if (typeof target.dragDrop !== 'function') {
          return;
        }

        if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
          return;
        }

        e.preventDefault();
        target.dragDrop();
      };

      this.options = new OptionsReader(globalContext);
      this.actions = manager.getActions();
      this.monitor = manager.getMonitor();
      this.registry = manager.getRegistry();
      this.enterLeaveCounter = new EnterLeaveCounter(this.isNodeInDocument);
    }

    _createClass$c(HTML5Backend, [{
      key: "setup",
      value: function setup() {
        if (this.window === undefined) {
          return;
        }

        if (this.window.__isReactDndBackendSetUp) {
          throw new Error('Cannot have two HTML5 backends at the same time.');
        }

        this.window.__isReactDndBackendSetUp = true;
        this.addEventListeners(this.window);
      }
    }, {
      key: "teardown",
      value: function teardown() {
        if (this.window === undefined) {
          return;
        }

        this.window.__isReactDndBackendSetUp = false;
        this.removeEventListeners(this.window);
        this.clearCurrentDragSourceNode();

        if (this.asyncEndDragFrameId) {
          this.window.cancelAnimationFrame(this.asyncEndDragFrameId);
        }
      }
    }, {
      key: "connectDragPreview",
      value: function connectDragPreview(sourceId, node, options) {
        var _this2 = this;

        this.sourcePreviewNodeOptions.set(sourceId, options);
        this.sourcePreviewNodes.set(sourceId, node);
        return function () {
          _this2.sourcePreviewNodes.delete(sourceId);

          _this2.sourcePreviewNodeOptions.delete(sourceId);
        };
      }
    }, {
      key: "connectDragSource",
      value: function connectDragSource(sourceId, node, options) {
        var _this3 = this;

        this.sourceNodes.set(sourceId, node);
        this.sourceNodeOptions.set(sourceId, options);

        var handleDragStart = function handleDragStart(e) {
          return _this3.handleDragStart(e, sourceId);
        };

        var handleSelectStart = function handleSelectStart(e) {
          return _this3.handleSelectStart(e);
        };

        node.setAttribute('draggable', 'true');
        node.addEventListener('dragstart', handleDragStart);
        node.addEventListener('selectstart', handleSelectStart);
        return function () {
          _this3.sourceNodes.delete(sourceId);

          _this3.sourceNodeOptions.delete(sourceId);

          node.removeEventListener('dragstart', handleDragStart);
          node.removeEventListener('selectstart', handleSelectStart);
          node.setAttribute('draggable', 'false');
        };
      }
    }, {
      key: "connectDropTarget",
      value: function connectDropTarget(targetId, node) {
        var _this4 = this;

        var handleDragEnter = function handleDragEnter(e) {
          return _this4.handleDragEnter(e, targetId);
        };

        var handleDragOver = function handleDragOver(e) {
          return _this4.handleDragOver(e, targetId);
        };

        var handleDrop = function handleDrop(e) {
          return _this4.handleDrop(e, targetId);
        };

        node.addEventListener('dragenter', handleDragEnter);
        node.addEventListener('dragover', handleDragOver);
        node.addEventListener('drop', handleDrop);
        return function () {
          node.removeEventListener('dragenter', handleDragEnter);
          node.removeEventListener('dragover', handleDragOver);
          node.removeEventListener('drop', handleDrop);
        };
      }
    }, {
      key: "addEventListeners",
      value: function addEventListeners(target) {
        if (!target.addEventListener) {
          return;
        }

        target.addEventListener('dragstart', this.handleTopDragStart);
        target.addEventListener('dragstart', this.handleTopDragStartCapture, true);
        target.addEventListener('dragend', this.handleTopDragEndCapture, true);
        target.addEventListener('dragenter', this.handleTopDragEnter);
        target.addEventListener('dragenter', this.handleTopDragEnterCapture, true);
        target.addEventListener('dragleave', this.handleTopDragLeaveCapture, true);
        target.addEventListener('dragover', this.handleTopDragOver);
        target.addEventListener('dragover', this.handleTopDragOverCapture, true);
        target.addEventListener('drop', this.handleTopDrop);
        target.addEventListener('drop', this.handleTopDropCapture, true);
      }
    }, {
      key: "removeEventListeners",
      value: function removeEventListeners(target) {
        if (!target.removeEventListener) {
          return;
        }

        target.removeEventListener('dragstart', this.handleTopDragStart);
        target.removeEventListener('dragstart', this.handleTopDragStartCapture, true);
        target.removeEventListener('dragend', this.handleTopDragEndCapture, true);
        target.removeEventListener('dragenter', this.handleTopDragEnter);
        target.removeEventListener('dragenter', this.handleTopDragEnterCapture, true);
        target.removeEventListener('dragleave', this.handleTopDragLeaveCapture, true);
        target.removeEventListener('dragover', this.handleTopDragOver);
        target.removeEventListener('dragover', this.handleTopDragOverCapture, true);
        target.removeEventListener('drop', this.handleTopDrop);
        target.removeEventListener('drop', this.handleTopDropCapture, true);
      }
    }, {
      key: "getCurrentSourceNodeOptions",
      value: function getCurrentSourceNodeOptions() {
        var sourceId = this.monitor.getSourceId();
        var sourceNodeOptions = this.sourceNodeOptions.get(sourceId);
        return _objectSpread$4({
          dropEffect: this.altKeyPressed ? 'copy' : 'move'
        }, sourceNodeOptions || {});
      }
    }, {
      key: "getCurrentDropEffect",
      value: function getCurrentDropEffect() {
        if (this.isDraggingNativeItem()) {
          return 'copy';
        }

        return this.getCurrentSourceNodeOptions().dropEffect;
      }
    }, {
      key: "getCurrentSourcePreviewNodeOptions",
      value: function getCurrentSourcePreviewNodeOptions() {
        var sourceId = this.monitor.getSourceId();
        var sourcePreviewNodeOptions = this.sourcePreviewNodeOptions.get(sourceId);
        return _objectSpread$4({
          anchorX: 0.5,
          anchorY: 0.5,
          captureDraggingState: false
        }, sourcePreviewNodeOptions || {});
      }
    }, {
      key: "isDraggingNativeItem",
      value: function isDraggingNativeItem() {
        var itemType = this.monitor.getItemType();
        return Object.keys(NativeTypes).some(function (key) {
          return NativeTypes[key] === itemType;
        });
      }
    }, {
      key: "beginDragNativeItem",
      value: function beginDragNativeItem(type, dataTransfer) {
        this.clearCurrentDragSourceNode();
        this.currentNativeSource = createNativeDragSource(type, dataTransfer);
        this.currentNativeHandle = this.registry.addSource(type, this.currentNativeSource);
        this.actions.beginDrag([this.currentNativeHandle]);
      }
    }, {
      key: "setCurrentDragSourceNode",
      value: function setCurrentDragSourceNode(node) {
        var _this5 = this;

        this.clearCurrentDragSourceNode();
        this.currentDragSourceNode = node;
        var MOUSE_MOVE_TIMEOUT = 1000;
        this.mouseMoveTimeoutTimer = setTimeout(function () {
          return _this5.window && _this5.window.addEventListener('mousemove', _this5.endDragIfSourceWasRemovedFromDOM, true);
        }, MOUSE_MOVE_TIMEOUT);
      }
    }, {
      key: "clearCurrentDragSourceNode",
      value: function clearCurrentDragSourceNode() {
        if (this.currentDragSourceNode) {
          this.currentDragSourceNode = null;

          if (this.window) {
            this.window.clearTimeout(this.mouseMoveTimeoutTimer || undefined);
            this.window.removeEventListener('mousemove', this.endDragIfSourceWasRemovedFromDOM, true);
          }

          this.mouseMoveTimeoutTimer = null;
          return true;
        }

        return false;
      }
    }, {
      key: "handleDragStart",
      value: function handleDragStart(e, sourceId) {
        if (e.defaultPrevented) {
          return;
        }

        if (!this.dragStartSourceIds) {
          this.dragStartSourceIds = [];
        }

        this.dragStartSourceIds.unshift(sourceId);
      }
    }, {
      key: "handleDragEnter",
      value: function handleDragEnter(e, targetId) {
        this.dragEnterTargetIds.unshift(targetId);
      }
    }, {
      key: "handleDragOver",
      value: function handleDragOver(e, targetId) {
        if (this.dragOverTargetIds === null) {
          this.dragOverTargetIds = [];
        }

        this.dragOverTargetIds.unshift(targetId);
      }
    }, {
      key: "handleDrop",
      value: function handleDrop(e, targetId) {
        this.dropTargetIds.unshift(targetId);
      }
    }, {
      key: "window",
      get: function get() {
        return this.options.window;
      }
    }, {
      key: "document",
      get: function get() {
        return this.options.document;
      }
    }]);

    return HTML5Backend;
  }();

  var createBackend = function createBackend(manager, context) {
    return new HTML5Backend(manager, context);
  };

  function Provider(props) {
    return React.createElement(DndProvider, {
      backend: createBackend
    }, props.children);
  }

  var Context = React__default.createContext({
    id2CompMap: {}
  });
  function GragProvider(props) {
    var id2CompMap = React__default.useRef(_defineProperty({}, RootCompId, Root));
    return React__default.createElement(Context.Provider, {
      value: {
        id2CompMap: id2CompMap.current
      }
    }, React__default.createElement(Provider, null, props.children));
  }

  function uuid() {
    return 'uuid' + Math.ceil(Math.random() * 100000) + Math.ceil(Math.random() * 100000);
  }

  function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$5(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  var EventMonitor =
  /*#__PURE__*/
  function () {
    function EventMonitor(dispatch) {
      _classCallCheck(this, EventMonitor);

      this.dispatch = dispatch;
      this.emit = this.emit.bind(this);
    }

    _createClass(EventMonitor, [{
      key: "emit",
      value: function emit(evtName, params) {
        this[evtName](params);
      }
    }, {
      key: "canvasMousemove",
      value: function canvasMousemove() {}
    }, {
      key: "ftrDrop",
      value: function ftrDrop(param) {
        this.dispatch('insertFtr', _objectSpread$5({}, param, {
          ftrId: uuid()
        }));
      }
    }, {
      key: "ftrHover",
      value: function ftrHover(param) {
        this.dispatch('updateEnterFtr', param.targetFtrId);
      }
    }]);

    return EventMonitor;
  }();

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function useListener() {
    var lis = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var listeners = React.useRef(lis);
    var subscribe = React.useCallback(function (cb) {
      listeners.current.push(cb);
      return function unSubscribe() {
        var idx = listeners.current.findIndex(function (listener) {
          return listener === cb;
        });

        if (idx >= 0) {
          listeners.current.splice(idx, 1);
        }
      };
    }, [listeners]);
    var notify = React.useCallback(function () {
      for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      var cbs = _toConsumableArray(listeners.current);

      cbs.forEach(function (cb) {
        cb.apply(void 0, params);
      });
    }, [listeners]);
    React.useEffect(function () {
      return function () {
        listeners.current = [];
      };
    }, []);
    return [subscribe, notify];
  }

  function useMount(mount) {
    React.useLayoutEffect(mount, []);
  }

  function CaptureDom(props) {
    var _React$useState = React.useState(props.parentIsMount),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        parentIsMount = _React$useState2[0],
        setParentIsMount = _React$useState2[1];

    var domRef = React.useRef(null);

    var _useListener = useListener(),
        _useListener2 = _slicedToArray(_useListener, 2),
        registerChildDom = _useListener2[0],
        childDomReady = _useListener2[1];

    var _useListener3 = useListener(),
        _useListener4 = _slicedToArray(_useListener3, 2),
        registerMyDomMount = _useListener4[0],
        myDomMount = _useListener4[1];

    var observer = React.useRef(new MutationObserver(function (records) {
      records.forEach(function (_ref) {
        var _domRef$current;

        var addedNodes = _ref.addedNodes;
        var ch = addedNodes[0];
        var idx = Array.prototype.indexOf.call((_domRef$current = domRef.current) === null || _domRef$current === void 0 ? void 0 : _domRef$current.children, ch);
        childDomReady(ch, idx);
      });
    }));
    useMount(function () {
      var unSubscribe = props.registerDom(function (dom, idx) {
        if (!domRef.current && idx === props.idx) {
          domRef.current = dom;
          observer.current.observe(domRef.current, {
            childList: true
          });
          unSubscribe();
          myDomMount(dom);
        }
      });
      return function () {
        unSubscribe();
        observer.current.disconnect();
      };
    });
    useMount(function () {
      var unSubscribe = props.registerParentMount(function () {
        unSubscribe();
        setParentIsMount(true);
      });
      return unSubscribe;
    });
    return parentIsMount ? props.children({
      registerChildDom: registerChildDom,
      parentIsMount: !!domRef.current,
      registerParentMount: registerMyDomMount
    }) : null;
  }

  var ItemTypes = {
    CANVAS: 'canvas'
  };

  function Dropable(props) {
    var domRef = React.useRef(null);

    var _useDrop = useDrop({
      accept: ItemTypes.CANVAS,
      drop: function drop(item, monitor) {
        if (monitor.didDrop()) {
          return;
        }

        props.evtEmit('ftrDrop', {
          compId: item.compId,
          parentFtrId: props.ftrId
        });
      },
      hover: function hover(_item, monitor) {
        if (!monitor.isOver({
          shallow: true
        })) {
          return;
        }

        props.evtEmit('ftrHover', {
          targetFtrId: props.ftrId
        });
      }
    }),
        _useDrop2 = _slicedToArray(_useDrop, 2),
        drop = _useDrop2[1];

    React.useEffect(function () {
      var unSubscribe = props.registerDom(function (dom, idx) {
        if (!domRef.current && idx === props.idx) {
          domRef.current = dom;
          drop(dom);
          unSubscribe();
        }
      });
    }, [props.registerDom]);
    return props.children;
  }

  var Memo = React.memo(function (props) {
    return props.children;
  }, function (pre, next) {
    return pre['x-children'].length === next['x-children'].length;
  });

  function MouseEventCollect(props) {
    var domRef = React.useRef(null);
    useMount(function () {
      function handleClick(e) {
        e.stopPropagation();
      }

      var unSubscribe = props.registerDom(function (dom, idx) {
        if (!domRef.current && props.idx === idx) {
          domRef.current = dom;
          dom.addEventListener('click', handleClick);
          unSubscribe();
        }
      });
      return function () {
        var _domRef$current;

        (_domRef$current = domRef.current) === null || _domRef$current === void 0 ? void 0 : _domRef$current.removeEventListener('click', handleClick);
      };
    });
    return props.children;
  }

  function renderTree(renderTreeparams) {
    var id2CompMap = renderTreeparams.id2CompMap,
        root = renderTreeparams.root,
        ftrCtx = renderTreeparams.ftrCtx,
        captureDomParams = renderTreeparams.captureDomParams;
    return renderNode(root, captureDomParams);

    function renderNode(node, params) {
      if (node === null) {
        return null;
      }

      var compId = node.compId,
          children = node.children,
          ftrId = node.ftrId;
      var Comp = id2CompMap[compId];
      return React.createElement(Memo, {
        key: ftrId,
        "x-children": children
      }, React.createElement(MouseEventCollect, Object.assign({}, ftrCtx, {
        idx: params.idx,
        registerDom: params.registerChildDom
      }), React.createElement(Dropable, Object.assign({}, ftrCtx, {
        ftrId: ftrId,
        idx: params.idx,
        registerDom: params.registerChildDom
      }), React.createElement(CaptureDom, Object.assign({}, ftrCtx, {
        idx: params.idx,
        parentIsMount: params.parentIsMount,
        registerParentMount: params.registerParentMount,
        registerDom: params.registerChildDom
      }), function (_ref) {
        var registerChildDom = _ref.registerChildDom,
            registerParentMount = _ref.registerParentMount,
            parentIsMount = _ref.parentIsMount;
        return React.createElement(Comp, null, children.length ? children.map(function (child, idx) {
          return renderNode(child, {
            registerChildDom: registerChildDom,
            idx: idx,
            registerParentMount: registerParentMount,
            parentIsMount: parentIsMount
          });
        }) : null);
      }))));
    }
  }

  var _a;

  var hasSymbol = typeof Symbol !== "undefined";
  var hasMap = typeof Map !== "undefined";
  var hasSet = typeof Set !== "undefined";
  var NOTHING = hasSymbol ? Symbol("immer-nothing") : (_a = {}, _a["immer-nothing"] = true, _a);
  var DRAFTABLE = hasSymbol ? Symbol("immer-draftable") : "__$immer_draftable";
  var DRAFT_STATE = hasSymbol ? Symbol("immer-state") : "__$immer_state";
  var iteratorSymbol = hasSymbol ? Symbol.iterator : "@@iterator";

  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) {
          d[p] = b[p];
        }
      }
    };

    return _extendStatics(d, b);
  };

  function __extends(d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = (__.prototype = b.prototype, new __());
  }

  var Archtype;

  (function (Archtype) {
    Archtype[Archtype["Object"] = 0] = "Object";
    Archtype[Archtype["Array"] = 1] = "Array";
    Archtype[Archtype["Map"] = 2] = "Map";
    Archtype[Archtype["Set"] = 3] = "Set";
  })(Archtype || (Archtype = {}));

  var ProxyType;

  (function (ProxyType) {
    ProxyType[ProxyType["ProxyObject"] = 0] = "ProxyObject";
    ProxyType[ProxyType["ProxyArray"] = 1] = "ProxyArray";
    ProxyType[ProxyType["ES5Object"] = 2] = "ES5Object";
    ProxyType[ProxyType["ES5Array"] = 3] = "ES5Array";
    ProxyType[ProxyType["Map"] = 4] = "Map";
    ProxyType[ProxyType["Set"] = 5] = "Set";
  })(ProxyType || (ProxyType = {}));

  function isDraft(value) {
    return !!value && !!value[DRAFT_STATE];
  }

  function isDraftable(value) {
    if (!value) {
      return false;
    }

    return isPlainObject$1(value) || Array.isArray(value) || !!value[DRAFTABLE] || !!value.constructor[DRAFTABLE] || isMap(value) || isSet(value);
  }

  function isPlainObject$1(value) {
    if (!value || _typeof(value) !== "object") {
      return false;
    }

    var proto = Object.getPrototypeOf(value);
    return !proto || proto === Object.prototype;
  }

  var ownKeys$6 = typeof Reflect !== "undefined" && Reflect.ownKeys ? Reflect.ownKeys : typeof Object.getOwnPropertySymbols !== "undefined" ? function (obj) {
    return Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));
  } : Object.getOwnPropertyNames;

  function each(obj, iter) {
    if (getArchtype(obj) === Archtype.Object) {
      ownKeys$6(obj).forEach(function (key) {
        return iter(key, obj[key], obj);
      });
    } else {
      obj.forEach(function (entry, index) {
        return iter(index, entry, obj);
      });
    }
  }

  function isEnumerable(base, prop) {
    var desc = Object.getOwnPropertyDescriptor(base, prop);
    return desc && desc.enumerable ? true : false;
  }

  function getArchtype(thing) {
    if (!thing) {
      die();
    }

    if (thing[DRAFT_STATE]) {
      switch (thing[DRAFT_STATE].type) {
        case ProxyType.ES5Object:
        case ProxyType.ProxyObject:
          return Archtype.Object;

        case ProxyType.ES5Array:
        case ProxyType.ProxyArray:
          return Archtype.Array;

        case ProxyType.Map:
          return Archtype.Map;

        case ProxyType.Set:
          return Archtype.Set;
      }
    }

    return Array.isArray(thing) ? Archtype.Array : isMap(thing) ? Archtype.Map : isSet(thing) ? Archtype.Set : Archtype.Object;
  }

  function has(thing, prop) {
    return getArchtype(thing) === Archtype.Map ? thing.has(prop) : Object.prototype.hasOwnProperty.call(thing, prop);
  }

  function get$1(thing, prop) {
    return getArchtype(thing) === Archtype.Map ? thing.get(prop) : thing[prop];
  }

  function set(thing, propOrOldValue, value) {
    switch (getArchtype(thing)) {
      case Archtype.Map:
        thing.set(propOrOldValue, value);
        break;

      case Archtype.Set:
        thing.delete(propOrOldValue);
        thing.add(value);
        break;

      default:
        thing[propOrOldValue] = value;
    }
  }

  function is(x, y) {
    if (x === y) {
      return x !== 0 || 1 / x === 1 / y;
    } else {
      return x !== x && y !== y;
    }
  }

  function isMap(target) {
    return hasMap && target instanceof Map;
  }

  function isSet(target) {
    return hasSet && target instanceof Set;
  }

  function latest(state) {
    return state.copy || state.base;
  }

  function shallowCopy(base, invokeGetters) {
    if (invokeGetters === void 0) {
      invokeGetters = false;
    }

    if (Array.isArray(base)) {
      return base.slice();
    }

    var clone = Object.create(Object.getPrototypeOf(base));
    ownKeys$6(base).forEach(function (key) {
      if (key === DRAFT_STATE) {
        return;
      }

      var desc = Object.getOwnPropertyDescriptor(base, key);
      var value = desc.value;

      if (desc.get) {
        if (!invokeGetters) {
          throw new Error("Immer drafts cannot have computed properties");
        }

        value = desc.get.call(base);
      }

      if (desc.enumerable) {
        clone[key] = value;
      } else {
        Object.defineProperty(clone, key, {
          value: value,
          writable: true,
          configurable: true
        });
      }
    });
    return clone;
  }

  function freeze(obj, deep) {
    if (!isDraftable(obj) || isDraft(obj) || Object.isFrozen(obj)) {
      return;
    }

    var type = getArchtype(obj);

    if (type === Archtype.Set) {
      obj.add = obj.clear = obj.delete = dontMutateFrozenCollections;
    } else if (type === Archtype.Map) {
      obj.set = obj.clear = obj.delete = dontMutateFrozenCollections;
    }

    Object.freeze(obj);

    if (deep) {
      each(obj, function (_, value) {
        return freeze(value, true);
      });
    }
  }

  function dontMutateFrozenCollections() {
    throw new Error("This object has been frozen and should not be mutated");
  }

  function createHiddenProperty(target, prop, value) {
    Object.defineProperty(target, prop, {
      value: value,
      enumerable: false,
      writable: true
    });
  }

  function die() {
    throw new Error("Illegal state, please file a bug");
  }

  var ImmerScope = function () {
    function ImmerScope(parent, immer) {
      this.drafts = [];
      this.parent = parent;
      this.immer = immer;
      this.canAutoFreeze = true;
    }

    ImmerScope.prototype.usePatches = function (patchListener) {
      if (patchListener) {
        this.patches = [];
        this.inversePatches = [];
        this.patchListener = patchListener;
      }
    };

    ImmerScope.prototype.revoke = function () {
      this.leave();
      this.drafts.forEach(revoke);
      this.drafts = null;
    };

    ImmerScope.prototype.leave = function () {
      if (this === ImmerScope.current) {
        ImmerScope.current = this.parent;
      }
    };

    ImmerScope.enter = function (immer) {
      var scope = new ImmerScope(ImmerScope.current, immer);
      ImmerScope.current = scope;
      return scope;
    };

    return ImmerScope;
  }();

  function revoke(draft) {
    var state = draft[DRAFT_STATE];

    if (state.type === ProxyType.ProxyObject || state.type === ProxyType.ProxyArray) {
      state.revoke();
    } else {
      state.revoked = true;
    }
  }

  function processResult(immer, result, scope) {
    var baseDraft = scope.drafts[0];
    var isReplaced = result !== undefined && result !== baseDraft;
    immer.willFinalize(scope, result, isReplaced);

    if (isReplaced) {
      if (baseDraft[DRAFT_STATE].modified) {
        scope.revoke();
        throw new Error("An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.");
      }

      if (isDraftable(result)) {
        result = finalize(immer, result, scope);
        maybeFreeze(immer, result);
      }

      if (scope.patches) {
        scope.patches.push({
          op: "replace",
          path: [],
          value: result
        });
        scope.inversePatches.push({
          op: "replace",
          path: [],
          value: baseDraft[DRAFT_STATE].base
        });
      }
    } else {
      result = finalize(immer, baseDraft, scope, []);
    }

    scope.revoke();

    if (scope.patches) {
      scope.patchListener(scope.patches, scope.inversePatches);
    }

    return result !== NOTHING ? result : undefined;
  }

  function finalize(immer, draft, scope, path) {
    var state = draft[DRAFT_STATE];

    if (!state) {
      if (Object.isFrozen(draft)) {
        return draft;
      }

      return finalizeTree(immer, draft, scope);
    }

    if (state.scope !== scope) {
      return draft;
    }

    if (!state.modified) {
      maybeFreeze(immer, state.base, true);
      return state.base;
    }

    if (!state.finalized) {
      state.finalized = true;
      finalizeTree(immer, state.draft, scope, path);

      if (immer.onDelete && state.type !== ProxyType.Set) {
        if (immer.useProxies) {
          var assigned = state.assigned;
          each(assigned, function (prop, exists) {
            if (!exists) {
              immer.onDelete(state, prop);
            }
          });
        } else {
          var base = state.base,
              copy_1 = state.copy;
          each(base, function (prop) {
            if (!has(copy_1, prop)) {
              immer.onDelete(state, prop);
            }
          });
        }
      }

      if (immer.onCopy) {
        immer.onCopy(state);
      }

      if (immer.autoFreeze && scope.canAutoFreeze) {
        freeze(state.copy, false);
      }

      if (path && scope.patches) {
        generatePatches(state, path, scope.patches, scope.inversePatches);
      }
    }

    return state.copy;
  }

  function finalizeTree(immer, root, scope, rootPath) {
    var state = root[DRAFT_STATE];

    if (state) {
      if (state.type === ProxyType.ES5Object || state.type === ProxyType.ES5Array) {
        state.copy = shallowCopy(state.draft, true);
      }

      root = state.copy;
    }

    each(root, function (key, value) {
      return finalizeProperty(immer, scope, root, state, root, key, value, rootPath);
    });
    return root;
  }

  function finalizeProperty(immer, scope, root, rootState, parentValue, prop, childValue, rootPath) {
    if (childValue === parentValue) {
      throw Error("Immer forbids circular references");
    }

    var isDraftProp = !!rootState && parentValue === root;
    var isSetMember = isSet(parentValue);

    if (isDraft(childValue)) {
      var path = rootPath && isDraftProp && !isSetMember && !has(rootState.assigned, prop) ? rootPath.concat(prop) : undefined;
      childValue = finalize(immer, childValue, scope, path);
      set(parentValue, prop, childValue);

      if (isDraft(childValue)) {
        scope.canAutoFreeze = false;
      }
    } else if (isDraftProp && is(childValue, get$1(rootState.base, prop))) {
      return;
    } else if (isDraftable(childValue) && !Object.isFrozen(childValue)) {
      each(childValue, function (key, grandChild) {
        return finalizeProperty(immer, scope, root, rootState, childValue, key, grandChild, rootPath);
      });
      maybeFreeze(immer, childValue);
    }

    if (isDraftProp && immer.onAssign && !isSetMember) {
      immer.onAssign(rootState, prop, childValue);
    }
  }

  function maybeFreeze(immer, value, deep) {
    if (deep === void 0) {
      deep = false;
    }

    if (immer.autoFreeze && !isDraft(value)) {
      freeze(value, deep);
    }
  }

  function createProxy(base, parent) {
    var isArray = Array.isArray(base);
    var state = {
      type: isArray ? ProxyType.ProxyArray : ProxyType.ProxyObject,
      scope: parent ? parent.scope : ImmerScope.current,
      modified: false,
      finalized: false,
      assigned: {},
      parent: parent,
      base: base,
      draft: null,
      drafts: {},
      copy: null,
      revoke: null,
      isManual: false
    };
    var target = state;
    var traps = objectTraps;

    if (isArray) {
      target = [state];
      traps = arrayTraps;
    }

    var _a = Proxy.revocable(target, traps),
        revoke = _a.revoke,
        proxy = _a.proxy;

    state.draft = proxy;
    state.revoke = revoke;
    return proxy;
  }

  var objectTraps = {
    get: function get(state, prop) {
      if (prop === DRAFT_STATE) {
        return state;
      }

      var drafts = state.drafts;

      if (!state.modified && has(drafts, prop)) {
        return drafts[prop];
      }

      var value = latest(state)[prop];

      if (state.finalized || !isDraftable(value)) {
        return value;
      }

      if (state.modified) {
        if (value !== peek(state.base, prop)) {
          return value;
        }

        drafts = state.copy;
      }

      return drafts[prop] = state.scope.immer.createProxy(value, state);
    },
    has: function has(state, prop) {
      return prop in latest(state);
    },
    ownKeys: function ownKeys(state) {
      return Reflect.ownKeys(latest(state));
    },
    set: function set(state, prop, value) {
      if (!state.modified) {
        var baseValue = peek(state.base, prop);
        var isUnchanged = value ? is(baseValue, value) || value === state.drafts[prop] : is(baseValue, value) && prop in state.base;

        if (isUnchanged) {
          return true;
        }

        prepareCopy(state);
        markChanged(state);
      }

      state.assigned[prop] = true;
      state.copy[prop] = value;
      return true;
    },
    deleteProperty: function deleteProperty(state, prop) {
      if (peek(state.base, prop) !== undefined || prop in state.base) {
        state.assigned[prop] = false;
        prepareCopy(state);
        markChanged(state);
      } else if (state.assigned[prop]) {
        delete state.assigned[prop];
      }

      if (state.copy) {
        delete state.copy[prop];
      }

      return true;
    },
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor(state, prop) {
      var owner = latest(state);
      var desc = Reflect.getOwnPropertyDescriptor(owner, prop);

      if (desc) {
        desc.writable = true;
        desc.configurable = state.type !== ProxyType.ProxyArray || prop !== "length";
      }

      return desc;
    },
    defineProperty: function defineProperty() {
      throw new Error("Object.defineProperty() cannot be used on an Immer draft");
    },
    getPrototypeOf: function getPrototypeOf(state) {
      return Object.getPrototypeOf(state.base);
    },
    setPrototypeOf: function setPrototypeOf() {
      throw new Error("Object.setPrototypeOf() cannot be used on an Immer draft");
    }
  };
  var arrayTraps = {};
  each(objectTraps, function (key, fn) {
    arrayTraps[key] = function () {
      arguments[0] = arguments[0][0];
      return fn.apply(this, arguments);
    };
  });

  arrayTraps.deleteProperty = function (state, prop) {
    if (isNaN(parseInt(prop))) {
      throw new Error("Immer only supports deleting array indices");
    }

    return objectTraps.deleteProperty.call(this, state[0], prop);
  };

  arrayTraps.set = function (state, prop, value) {
    if (prop !== "length" && isNaN(parseInt(prop))) {
      throw new Error("Immer only supports setting array indices and the 'length' property");
    }

    return objectTraps.set.call(this, state[0], prop, value, state[0]);
  };

  function peek(draft, prop) {
    var state = draft[DRAFT_STATE];
    var desc = Reflect.getOwnPropertyDescriptor(state ? latest(state) : draft, prop);
    return desc && desc.value;
  }

  function markChanged(state) {
    if (!state.modified) {
      state.modified = true;

      if (state.type === ProxyType.ProxyObject || state.type === ProxyType.ProxyArray) {
        var copy_1 = state.copy = shallowCopy(state.base);
        each(state.drafts, function (key, value) {
          copy_1[key] = value;
        });
        state.drafts = undefined;
      }

      if (state.parent) {
        markChanged(state.parent);
      }
    }
  }

  function prepareCopy(state) {
    if (!state.copy) {
      state.copy = shallowCopy(state.base);
    }
  }

  function willFinalizeES5(scope, result, isReplaced) {
    scope.drafts.forEach(function (draft) {
      draft[DRAFT_STATE].finalizing = true;
    });

    if (!isReplaced) {
      if (scope.patches) {
        markChangesRecursively(scope.drafts[0]);
      }

      markChangesSweep(scope.drafts);
    } else if (isDraft(result) && result[DRAFT_STATE].scope === scope) {
      markChangesSweep(scope.drafts);
    }
  }

  function createES5Proxy(base, parent) {
    var isArray = Array.isArray(base);
    var draft = clonePotentialDraft(base);
    each(draft, function (prop) {
      proxyProperty(draft, prop, isArray || isEnumerable(base, prop));
    });
    var state = {
      type: isArray ? ProxyType.ES5Array : ProxyType.ES5Object,
      scope: parent ? parent.scope : ImmerScope.current,
      modified: false,
      finalizing: false,
      finalized: false,
      assigned: {},
      parent: parent,
      base: base,
      draft: draft,
      copy: null,
      revoked: false,
      isManual: false
    };
    createHiddenProperty(draft, DRAFT_STATE, state);
    return draft;
  }

  function peek$1(draft, prop) {
    var state = draft[DRAFT_STATE];

    if (state && !state.finalizing) {
      state.finalizing = true;
      var value = draft[prop];
      state.finalizing = false;
      return value;
    }

    return draft[prop];
  }

  function get$1$1(state, prop) {
    assertUnrevoked(state);
    var value = peek$1(latest(state), prop);

    if (state.finalizing) {
      return value;
    }

    if (value === peek$1(state.base, prop) && isDraftable(value)) {
      prepareCopy$1(state);
      return state.copy[prop] = state.scope.immer.createProxy(value, state);
    }

    return value;
  }

  function set$1(state, prop, value) {
    assertUnrevoked(state);
    state.assigned[prop] = true;

    if (!state.modified) {
      if (is(value, peek$1(latest(state), prop))) {
        return;
      }

      markChangedES5(state);
      prepareCopy$1(state);
    }

    state.copy[prop] = value;
  }

  function markChangedES5(state) {
    if (!state.modified) {
      state.modified = true;

      if (state.parent) {
        markChangedES5(state.parent);
      }
    }
  }

  function prepareCopy$1(state) {
    if (!state.copy) {
      state.copy = clonePotentialDraft(state.base);
    }
  }

  function clonePotentialDraft(base) {
    var state = base && base[DRAFT_STATE];

    if (state) {
      state.finalizing = true;
      var draft = shallowCopy(state.draft, true);
      state.finalizing = false;
      return draft;
    }

    return shallowCopy(base);
  }

  var descriptors = {};

  function proxyProperty(draft, prop, enumerable) {
    var desc = descriptors[prop];

    if (desc) {
      desc.enumerable = enumerable;
    } else {
      descriptors[prop] = desc = {
        configurable: true,
        enumerable: enumerable,
        get: function get() {
          return get$1$1(this[DRAFT_STATE], prop);
        },
        set: function set(value) {
          set$1(this[DRAFT_STATE], prop, value);
        }
      };
    }

    Object.defineProperty(draft, prop, desc);
  }

  function assertUnrevoked(state) {
    if (state.revoked === true) {
      throw new Error("Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + JSON.stringify(latest(state)));
    }
  }

  function markChangesSweep(drafts) {
    for (var i = drafts.length - 1; i >= 0; i--) {
      var state = drafts[i][DRAFT_STATE];

      if (!state.modified) {
        switch (state.type) {
          case ProxyType.ES5Array:
            if (hasArrayChanges(state)) {
              markChangedES5(state);
            }

            break;

          case ProxyType.ES5Object:
            if (hasObjectChanges(state)) {
              markChangedES5(state);
            }

            break;
        }
      }
    }
  }

  function markChangesRecursively(object) {
    if (!object || _typeof(object) !== "object") {
      return;
    }

    var state = object[DRAFT_STATE];

    if (!state) {
      return;
    }

    var base = state.base,
        draft = state.draft,
        assigned = state.assigned,
        type = state.type;

    if (type === ProxyType.ES5Object) {
      each(draft, function (key) {
        if (key === DRAFT_STATE) {
          return;
        }

        if (base[key] === undefined && !has(base, key)) {
          assigned[key] = true;
          markChangedES5(state);
        } else if (!assigned[key]) {
          markChangesRecursively(draft[key]);
        }
      });
      each(base, function (key) {
        if (draft[key] === undefined && !has(draft, key)) {
          assigned[key] = false;
          markChangedES5(state);
        }
      });
    } else if (type === ProxyType.ES5Array && hasArrayChanges(state)) {
      markChangedES5(state);
      assigned.length = true;

      if (draft.length < base.length) {
        for (var i = draft.length; i < base.length; i++) {
          assigned[i] = false;
        }
      } else {
        for (var i = base.length; i < draft.length; i++) {
          assigned[i] = true;
        }
      }

      for (var i = 0; i < draft.length; i++) {
        if (assigned[i] === undefined) {
          markChangesRecursively(draft[i]);
        }
      }
    }
  }

  function hasObjectChanges(state) {
    var base = state.base,
        draft = state.draft;
    var keys = Object.keys(draft);

    for (var i = keys.length - 1; i >= 0; i--) {
      var key = keys[i];
      var baseValue = base[key];

      if (baseValue === undefined && !has(base, key)) {
        return true;
      } else {
        var value = draft[key];
        var state_1 = value && value[DRAFT_STATE];

        if (state_1 ? state_1.base !== baseValue : !is(value, baseValue)) {
          return true;
        }
      }
    }

    return keys.length !== Object.keys(base).length;
  }

  function hasArrayChanges(state) {
    var draft = state.draft;

    if (draft.length !== state.base.length) {
      return true;
    }

    var descriptor = Object.getOwnPropertyDescriptor(draft, draft.length - 1);

    if (descriptor && !descriptor.get) {
      return true;
    }

    return false;
  }

  var DraftMap = function (_super) {
    if (!_super) {
      throw new Error("Map is not polyfilled");
    }

    __extends(DraftMap, _super);

    function DraftMap(target, parent) {
      this[DRAFT_STATE] = {
        type: ProxyType.Map,
        parent: parent,
        scope: parent ? parent.scope : ImmerScope.current,
        modified: false,
        finalized: false,
        copy: undefined,
        assigned: undefined,
        base: target,
        draft: this,
        isManual: false,
        revoked: false
      };
      return this;
    }

    var p = DraftMap.prototype;
    Object.defineProperty(p, "size", {
      get: function get() {
        return latest(this[DRAFT_STATE]).size;
      },
      enumerable: true,
      configurable: true
    });

    p.has = function (key) {
      return latest(this[DRAFT_STATE]).has(key);
    };

    p.set = function (key, value) {
      var state = this[DRAFT_STATE];
      assertUnrevoked(state);

      if (latest(state).get(key) !== value) {
        prepareCopy$2(state);
        state.scope.immer.markChanged(state);
        state.assigned.set(key, true);
        state.copy.set(key, value);
        state.assigned.set(key, true);
      }

      return this;
    };

    p.delete = function (key) {
      if (!this.has(key)) {
        return false;
      }

      var state = this[DRAFT_STATE];
      assertUnrevoked(state);
      prepareCopy$2(state);
      state.scope.immer.markChanged(state);
      state.assigned.set(key, false);
      state.copy.delete(key);
      return true;
    };

    p.clear = function () {
      var state = this[DRAFT_STATE];
      assertUnrevoked(state);
      prepareCopy$2(state);
      state.scope.immer.markChanged(state);
      state.assigned = new Map();
      return state.copy.clear();
    };

    p.forEach = function (cb, thisArg) {
      var _this = this;

      var state = this[DRAFT_STATE];
      latest(state).forEach(function (_value, key, _map) {
        cb.call(thisArg, _this.get(key), key, _this);
      });
    };

    p.get = function (key) {
      var state = this[DRAFT_STATE];
      assertUnrevoked(state);
      var value = latest(state).get(key);

      if (state.finalized || !isDraftable(value)) {
        return value;
      }

      if (value !== state.base.get(key)) {
        return value;
      }

      var draft = state.scope.immer.createProxy(value, state);
      prepareCopy$2(state);
      state.copy.set(key, draft);
      return draft;
    };

    p.keys = function () {
      return latest(this[DRAFT_STATE]).keys();
    };

    p.values = function () {
      var _a;

      var _this = this;

      var iterator = this.keys();
      return _a = {}, _a[iteratorSymbol] = function () {
        return _this.values();
      }, _a.next = function () {
        var r = iterator.next();

        if (r.done) {
          return r;
        }

        var value = _this.get(r.value);

        return {
          done: false,
          value: value
        };
      }, _a;
    };

    p.entries = function () {
      var _a;

      var _this = this;

      var iterator = this.keys();
      return _a = {}, _a[iteratorSymbol] = function () {
        return _this.entries();
      }, _a.next = function () {
        var r = iterator.next();

        if (r.done) {
          return r;
        }

        var value = _this.get(r.value);

        return {
          done: false,
          value: [r.value, value]
        };
      }, _a;
    };

    p[iteratorSymbol] = function () {
      return this.entries();
    };

    return DraftMap;
  }(Map);

  function proxyMap(target, parent) {
    return new DraftMap(target, parent);
  }

  function prepareCopy$2(state) {
    if (!state.copy) {
      state.assigned = new Map();
      state.copy = new Map(state.base);
    }
  }

  var DraftSet = function (_super) {
    if (!_super) {
      throw new Error("Set is not polyfilled");
    }

    __extends(DraftSet, _super);

    function DraftSet(target, parent) {
      this[DRAFT_STATE] = {
        type: ProxyType.Set,
        parent: parent,
        scope: parent ? parent.scope : ImmerScope.current,
        modified: false,
        finalized: false,
        copy: undefined,
        base: target,
        draft: this,
        drafts: new Map(),
        revoked: false,
        isManual: false
      };
      return this;
    }

    var p = DraftSet.prototype;
    Object.defineProperty(p, "size", {
      get: function get() {
        return latest(this[DRAFT_STATE]).size;
      },
      enumerable: true,
      configurable: true
    });

    p.has = function (value) {
      var state = this[DRAFT_STATE];
      assertUnrevoked(state);

      if (!state.copy) {
        return state.base.has(value);
      }

      if (state.copy.has(value)) {
        return true;
      }

      if (state.drafts.has(value) && state.copy.has(state.drafts.get(value))) {
        return true;
      }

      return false;
    };

    p.add = function (value) {
      var state = this[DRAFT_STATE];
      assertUnrevoked(state);

      if (state.copy) {
        state.copy.add(value);
      } else if (!state.base.has(value)) {
        prepareCopy$3(state);
        state.scope.immer.markChanged(state);
        state.copy.add(value);
      }

      return this;
    };

    p.delete = function (value) {
      if (!this.has(value)) {
        return false;
      }

      var state = this[DRAFT_STATE];
      assertUnrevoked(state);
      prepareCopy$3(state);
      state.scope.immer.markChanged(state);
      return state.copy.delete(value) || (state.drafts.has(value) ? state.copy.delete(state.drafts.get(value)) : false);
    };

    p.clear = function () {
      var state = this[DRAFT_STATE];
      assertUnrevoked(state);
      prepareCopy$3(state);
      state.scope.immer.markChanged(state);
      return state.copy.clear();
    };

    p.values = function () {
      var state = this[DRAFT_STATE];
      assertUnrevoked(state);
      prepareCopy$3(state);
      return state.copy.values();
    };

    p.entries = function entries() {
      var state = this[DRAFT_STATE];
      assertUnrevoked(state);
      prepareCopy$3(state);
      return state.copy.entries();
    };

    p.keys = function () {
      return this.values();
    };

    p[iteratorSymbol] = function () {
      return this.values();
    };

    p.forEach = function forEach(cb, thisArg) {
      var iterator = this.values();
      var result = iterator.next();

      while (!result.done) {
        cb.call(thisArg, result.value, result.value, this);
        result = iterator.next();
      }
    };

    return DraftSet;
  }(Set);

  function proxySet(target, parent) {
    return new DraftSet(target, parent);
  }

  function prepareCopy$3(state) {
    if (!state.copy) {
      state.copy = new Set();
      state.base.forEach(function (value) {
        if (isDraftable(value)) {
          var draft = state.scope.immer.createProxy(value, state);
          state.drafts.set(value, draft);
          state.copy.add(draft);
        } else {
          state.copy.add(value);
        }
      });
    }
  }

  function generatePatches(state, basePath, patches, inversePatches) {
    switch (state.type) {
      case ProxyType.ProxyObject:
      case ProxyType.ES5Object:
      case ProxyType.Map:
        return generatePatchesFromAssigned(state, basePath, patches, inversePatches);

      case ProxyType.ES5Array:
      case ProxyType.ProxyArray:
        return generateArrayPatches(state, basePath, patches, inversePatches);

      case ProxyType.Set:
        return generateSetPatches(state, basePath, patches, inversePatches);
    }
  }

  function generateArrayPatches(state, basePath, patches, inversePatches) {
    var _a, _b;

    var base = state.base,
        assigned = state.assigned,
        copy = state.copy;

    if (!copy) {
      die();
    }

    if (copy.length < base.length) {
      _a = [copy, base], base = _a[0], copy = _a[1];
      _b = [inversePatches, patches], patches = _b[0], inversePatches = _b[1];
    }

    var delta = copy.length - base.length;
    var start = 0;

    while (base[start] === copy[start] && start < base.length) {
      ++start;
    }

    var end = base.length;

    while (end > start && base[end - 1] === copy[end + delta - 1]) {
      --end;
    }

    for (var i = start; i < end; ++i) {
      if (assigned[i] && copy[i] !== base[i]) {
        var path = basePath.concat([i]);
        patches.push({
          op: "replace",
          path: path,
          value: copy[i]
        });
        inversePatches.push({
          op: "replace",
          path: path,
          value: base[i]
        });
      }
    }

    var replaceCount = patches.length;

    for (var i = end + delta - 1; i >= end; --i) {
      var path = basePath.concat([i]);
      patches[replaceCount + i - end] = {
        op: "add",
        path: path,
        value: copy[i]
      };
      inversePatches.push({
        op: "remove",
        path: path
      });
    }
  }

  function generatePatchesFromAssigned(state, basePath, patches, inversePatches) {
    var base = state.base,
        copy = state.copy;
    each(state.assigned, function (key, assignedValue) {
      var origValue = get$1(base, key);
      var value = get$1(copy, key);
      var op = !assignedValue ? "remove" : has(base, key) ? "replace" : "add";

      if (origValue === value && op === "replace") {
        return;
      }

      var path = basePath.concat(key);
      patches.push(op === "remove" ? {
        op: op,
        path: path
      } : {
        op: op,
        path: path,
        value: value
      });
      inversePatches.push(op === "add" ? {
        op: "remove",
        path: path
      } : op === "remove" ? {
        op: "add",
        path: path,
        value: origValue
      } : {
        op: "replace",
        path: path,
        value: origValue
      });
    });
  }

  function generateSetPatches(state, basePath, patches, inversePatches) {
    var base = state.base,
        copy = state.copy;
    var i = 0;
    base.forEach(function (value) {
      if (!copy.has(value)) {
        var path = basePath.concat([i]);
        patches.push({
          op: "remove",
          path: path,
          value: value
        });
        inversePatches.unshift({
          op: "add",
          path: path,
          value: value
        });
      }

      i++;
    });
    i = 0;
    copy.forEach(function (value) {
      if (!base.has(value)) {
        var path = basePath.concat([i]);
        patches.push({
          op: "add",
          path: path,
          value: value
        });
        inversePatches.unshift({
          op: "remove",
          path: path,
          value: value
        });
      }

      i++;
    });
  }

  function applyPatches(draft, patches) {
    patches.forEach(function (patch) {
      var path = patch.path,
          op = patch.op;

      if (!path.length) {
        die();
      }

      var base = draft;

      for (var i = 0; i < path.length - 1; i++) {
        base = get$1(base, path[i]);

        if (!base || _typeof(base) !== "object") {
          throw new Error("Cannot apply patch, path doesn't resolve: " + path.join("/"));
        }
      }

      var type = getArchtype(base);
      var value = deepClonePatchValue(patch.value);
      var key = path[path.length - 1];

      switch (op) {
        case "replace":
          switch (type) {
            case Archtype.Map:
              return base.set(key, value);

            case Archtype.Set:
              throw new Error('Sets cannot have "replace" patches.');

            default:
              return base[key] = value;
          }

        case "add":
          switch (type) {
            case Archtype.Array:
              return base.splice(key, 0, value);

            case Archtype.Map:
              return base.set(key, value);

            case Archtype.Set:
              return base.add(value);

            default:
              return base[key] = value;
          }

        case "remove":
          switch (type) {
            case Archtype.Array:
              return base.splice(key, 1);

            case Archtype.Map:
              return base.delete(key);

            case Archtype.Set:
              return base.delete(patch.value);

            default:
              return delete base[key];
          }

        default:
          throw new Error("Unsupported patch operation: " + op);
      }
    });
    return draft;
  }

  function deepClonePatchValue(obj) {
    if (!obj || _typeof(obj) !== "object") {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(deepClonePatchValue);
    }

    if (isMap(obj)) {
      return new Map(Array.from(obj.entries()).map(function (_a) {
        var k = _a[0],
            v = _a[1];
        return [k, deepClonePatchValue(v)];
      }));
    }

    var cloned = Object.create(Object.getPrototypeOf(obj));

    for (var key in obj) {
      cloned[key] = deepClonePatchValue(obj[key]);
    }

    return cloned;
  }

  function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
      s += arguments[i].length;
    }

    for (var r = Array(s), k = 0, i = 0; i < il; i++) {
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
        r[k] = a[j];
      }
    }

    return r;
  }

  function verifyMinified() {}

  var configDefaults = {
    useProxies: typeof Proxy !== "undefined" && typeof Proxy.revocable !== "undefined" && typeof Reflect !== "undefined",
    autoFreeze: typeof process !== "undefined" ? "development" !== "production" : verifyMinified.name === "verifyMinified",
    onAssign: null,
    onDelete: null,
    onCopy: null
  };

  var Immer = function () {
    function Immer(config) {
      var _this = this;

      this.useProxies = false;
      this.autoFreeze = false;
      each(configDefaults, function (key, value) {
        var _a, _b;

        _this[key] = (_b = (_a = config) === null || _a === void 0 ? void 0 : _a[key], _b !== null && _b !== void 0 ? _b : value);
      });
      this.setUseProxies(this.useProxies);
      this.produce = this.produce.bind(this);
      this.produceWithPatches = this.produceWithPatches.bind(this);
    }

    Immer.prototype.produce = function (base, recipe, patchListener) {
      var _this = this;

      if (typeof base === "function" && typeof recipe !== "function") {
        var defaultBase_1 = recipe;
        recipe = base;
        var self_1 = this;
        return function curriedProduce(base) {
          var arguments$1 = arguments;

          var _this = this;

          if (base === void 0) {
            base = defaultBase_1;
          }

          var args = [];

          for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments$1[_i];
          }

          return self_1.produce(base, function (draft) {
            return recipe.call.apply(recipe, __spreadArrays([_this, draft], args));
          });
        };
      }

      {
        if (typeof recipe !== "function") {
          throw new Error("The first or second argument to `produce` must be a function");
        }

        if (patchListener !== undefined && typeof patchListener !== "function") {
          throw new Error("The third argument to `produce` must be a function or undefined");
        }
      }
      var result;

      if (isDraftable(base)) {
        var scope_1 = ImmerScope.enter(this);
        var proxy = this.createProxy(base, undefined);
        var hasError = true;

        try {
          result = recipe(proxy);
          hasError = false;
        } finally {
          if (hasError) {
            scope_1.revoke();
          } else {
            scope_1.leave();
          }
        }

        if (typeof Promise !== "undefined" && result instanceof Promise) {
          return result.then(function (result) {
            scope_1.usePatches(patchListener);
            return processResult(_this, result, scope_1);
          }, function (error) {
            scope_1.revoke();
            throw error;
          });
        }

        scope_1.usePatches(patchListener);
        return processResult(this, result, scope_1);
      } else {
        result = recipe(base);

        if (result === NOTHING) {
          return undefined;
        }

        if (result === undefined) {
          result = base;
        }

        maybeFreeze(this, result, true);
        return result;
      }
    };

    Immer.prototype.produceWithPatches = function (arg1, arg2, arg3) {
      var _this = this;

      if (typeof arg1 === "function") {
        return function (state) {
          var arguments$1 = arguments;
          var args = [];

          for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments$1[_i];
          }

          return _this.produceWithPatches(state, function (draft) {
            return arg1.apply(void 0, __spreadArrays([draft], args));
          });
        };
      }

      if (arg3) {
        die();
      }

      var patches, inversePatches;
      var nextState = this.produce(arg1, arg2, function (p, ip) {
        patches = p;
        inversePatches = ip;
      });
      return [nextState, patches, inversePatches];
    };

    Immer.prototype.createDraft = function (base) {
      if (!isDraftable(base)) {
        throw new Error("First argument to `createDraft` must be a plain object, an array, or an immerable object");
      }

      var scope = ImmerScope.enter(this);
      var proxy = this.createProxy(base, undefined);
      proxy[DRAFT_STATE].isManual = true;
      scope.leave();
      return proxy;
    };

    Immer.prototype.finishDraft = function (draft, patchListener) {
      var state = draft && draft[DRAFT_STATE];

      if (!state || !state.isManual) {
        throw new Error("First argument to `finishDraft` must be a draft returned by `createDraft`");
      }

      if (state.finalized) {
        throw new Error("The given draft is already finalized");
      }

      var scope = state.scope;
      scope.usePatches(patchListener);
      return processResult(this, undefined, scope);
    };

    Immer.prototype.setAutoFreeze = function (value) {
      this.autoFreeze = value;
    };

    Immer.prototype.setUseProxies = function (value) {
      this.useProxies = value;
    };

    Immer.prototype.applyPatches = function (base, patches) {
      var i;

      for (i = patches.length - 1; i >= 0; i--) {
        var patch = patches[i];

        if (patch.path.length === 0 && patch.op === "replace") {
          base = patch.value;
          break;
        }
      }

      if (isDraft(base)) {
        return applyPatches(base, patches);
      }

      return this.produce(base, function (draft) {
        return applyPatches(draft, patches.slice(i + 1));
      });
    };

    Immer.prototype.createProxy = function (value, parent) {
      var draft = isMap(value) ? proxyMap(value, parent) : isSet(value) ? proxySet(value, parent) : this.useProxies ? createProxy(value, parent) : createES5Proxy(value, parent);
      var scope = parent ? parent.scope : ImmerScope.current;
      scope.drafts.push(draft);
      return draft;
    };

    Immer.prototype.willFinalize = function (scope, thing, isReplaced) {
      if (!this.useProxies) {
        willFinalizeES5(scope, thing, isReplaced);
      }
    };

    Immer.prototype.markChanged = function (state) {
      if (this.useProxies) {
        markChanged(state);
      } else {
        markChangedES5(state);
      }
    };

    return Immer;
  }();

  var immer = new Immer();
  var produce = immer.produce;
  var produceWithPatches = immer.produceWithPatches.bind(immer);
  var setAutoFreeze = immer.setAutoFreeze.bind(immer);
  var setUseProxies = immer.setUseProxies.bind(immer);
  var applyPatches$1 = immer.applyPatches.bind(immer);
  var createDraft = immer.createDraft.bind(immer);
  var finishDraft = immer.finishDraft.bind(immer);

  function ownKeys$7(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$7(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$7(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function insertFtr(getState, _payload) {
    return produce(getState(), function (_draftState) {});
  }
  function updateEnterFtr(getState, ftrId) {
    return _objectSpread$6({}, getState(), {
      enterFtrId: ftrId
    });
  }

  var reducers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    insertFtr: insertFtr,
    updateEnterFtr: updateEnterFtr
  });

  function createInitState() {
    return {
      enterFtrId: null,
      root: {
        compId: RootCompId,
        ftrId: RootFtrId,
        children: []
      }
    };
  }

  function applyMiddleware() {
    for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
      middlewares[_key] = arguments[_key];
    }

    return function (store) {
      var mutationChain = middlewares.map(function (middleware) {
        return middleware(store);
      });

      if (mutationChain.length < 1) {
        return store.dispatch;
      }

      var dispatch = store.dispatch;

      var middledispatch = function middledispatch(param) {
        var type = param.type,
            payload = param.payload;
        dispatch(type, payload);
        return store.getState();
      };

      if (mutationChain.length === 1) {
        return function (type, payload) {
          return mutationChain[0](function (action) {
            return middledispatch(action);
          })({
            type: type,
            payload: payload
          });
        };
      } else {
        return function (type, payload) {
          return mutationChain.reduce(function (a, b) {
            return function () {
              return a(b.apply(void 0, arguments));
            };
          })(function (action) {
            return middledispatch(action);
          })({
            type: type,
            payload: payload
          });
        };
      }
    };
  }

  function _objectWithoutPropertiesLoose$1(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties$1(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose$1(source, excluded);
    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  var Store =
  /*#__PURE__*/
  function () {
    function Store(preloadedState, reducers, enhancer) {
      var _this = this;

      _classCallCheck(this, Store);

      this.listeners = [];

      this.dispatch = function (action, payload) {
        if (typeof action !== 'string') {
          return _this.adapterReduxDispatch(action);
        }

        var act = _this.actions[action];

        if (!act) {
          return;
        }

        _this.lastState = _this.state;
        _this.state = act(_this.getState, payload);

        _this.notify();
      };

      this.state = this.lastState = preloadedState;
      this.actions = reducers;
      this.dispatch = this.dispatch.bind(this);
      this.getState = this.getState.bind(this);
      this.getLastState = this.getLastState.bind(this);
      this.context = {
        getState: this.getState,
        getLastState: this.getLastState,
        dispatch: this.dispatch
      };
      var dispatch = enhancer(this);
      this.context.dispatch = this.dispatch = dispatch.bind(this);
    }

    _createClass(Store, [{
      key: "subscribe",
      value: function subscribe(listener) {
        var _this2 = this;

        this.listeners.push(listener);
        return function () {
          return _this2.unSubscribe(listener);
        };
      }
    }, {
      key: "unSubscribe",
      value: function unSubscribe(listener) {
        var index = this.listeners.indexOf(listener);

        if (index !== -1) {
          this.listeners.splice(index, 1);
        }
      }
    }, {
      key: "getState",
      value: function getState() {
        return this.state;
      }
    }, {
      key: "getLastState",
      value: function getLastState() {
        return this.lastState;
      }
    }, {
      key: "notify",
      value: function notify() {
        this.listeners.forEach(function (callback) {
          callback();
        });
      }
    }, {
      key: "adapterReduxDispatch",
      value: function adapterReduxDispatch(action) {
        if (Object.prototype.toString.apply(action) === '[object Object]') {
          var type = action.type,
              data = _objectWithoutProperties$1(action, ["type"]);

          typeof type !== 'undefined' && this.dispatch(type, data);
        }
      }
    }]);

    return Store;
  }();
  function createStore$1(preloadedState, reducers) {
    var enhancer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : applyMiddleware();
    return new Store(preloadedState, reducers, enhancer);
  }

  function shallowEqual$1(objA, objB) {
    if (is$1(objA, objB)) {
      return true;
    }

    if (_typeof(objA) !== 'object' || objA === null || _typeof(objB) !== 'object' || objB === null) {
      return false;
    }

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
      return false;
    }

    for (var i = 0; i < keysA.length; i++) {
      if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !is$1(objA[keysA[i]], objB[keysA[i]])) {
        return false;
      }
    }

    return true;
  }

  function is$1(x, y) {
    if (x === y) {
      return x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
      return x !== x && y !== y;
    }
  }

  function createUseMappedState(store) {
    return function useMappedState(mappedState) {
      var savedMappedState = React.useRef(mappedState);

      var _React$useState = React.useState(savedMappedState.current(store.getState())),
          _React$useState2 = _slicedToArray(_React$useState, 2),
          state = _React$useState2[0],
          setState = _React$useState2[1];

      var lastState = React.useRef(state);
      var update = React.useCallback(function () {
        var nextState = savedMappedState.current(store.getState());

        if (!shallowEqual$1(nextState, lastState.current)) {
          setState(nextState);
        }

        lastState.current = nextState;
      }, []);
      React.useEffect(function () {
        savedMappedState.current = mappedState;
        update();
      }, [mappedState]);
      React.useEffect(function () {
        var unSubscribe = store.subscribe(update);
        return function () {
          return unSubscribe();
        };
      }, []);
      return state;
    };
  }

  function RawCanvas(props) {
    var evtEmit = props.evtEmit,
        style = props.style,
        className = props.className,
        useMappedState = props.useMappedState;
    var root = useMappedState(function (p) {
      return p.root;
    });
    var domRef = React__default.useRef(null);

    var _useListener = useListener(),
        _useListener2 = _slicedToArray(_useListener, 2),
        registerChildDom = _useListener2[0],
        childDomReady = _useListener2[1];

    var _useListener3 = useListener(),
        _useListener4 = _slicedToArray(_useListener3, 2),
        registerMyDomMount = _useListener4[0],
        myDomMount = _useListener4[1];

    var observer = React__default.useRef(new MutationObserver(function (records) {
      var node = records[0].addedNodes[0];
      childDomReady(node, 0);
    }));
    useMount(function () {
      function handleCanvasMousemmove(e) {
        e.stopPropagation();
        evtEmit('canvasMousemove', null);
      }

      if (domRef.current) {
        observer.current.observe(domRef.current, {
          childList: true
        });
        domRef.current.addEventListener('mousemove', handleCanvasMousemmove, true);
        myDomMount(true);
      }

      return function () {
        var _domRef$current;

        observer.current.disconnect();
        (_domRef$current = domRef.current) === null || _domRef$current === void 0 ? void 0 : _domRef$current.removeEventListener('mousemove', handleCanvasMousemmove, true);
      };
    });
    return React__default.createElement("div", {
      ref: domRef,
      style: style,
      className: className
    }, renderTree({
      root: root,
      id2CompMap: props.id2CompMap,
      ftrCtx: {
        useMappedState: useMappedState,
        evtEmit: evtEmit
      },
      captureDomParams: {
        idx: 0,
        registerParentMount: registerMyDomMount,
        parentIsMount: !!domRef.current,
        registerChildDom: registerChildDom
      }
    }));
  }

  function Canvas(props) {
    var storeRef = React__default.useRef(createStore$1(createInitState(), reducers));
    var browserEvtMonitor = React__default.useRef(new EventMonitor(storeRef.current.dispatch));
    var useMappedStateRef = React__default.useRef(createUseMappedState(storeRef.current));

    var _React$useContext = React__default.useContext(Context),
        id2CompMap = _React$useContext.id2CompMap;

    return React__default.createElement(RawCanvas, Object.assign({
      evtEmit: browserEvtMonitor.current.emit,
      useMappedState: useMappedStateRef.current,
      id2CompMap: id2CompMap
    }, props));
  }

  function Feature(props) {
    var _props$id;

    var _React$useContext = React.useContext(Context),
        id2CompMap = _React$useContext.id2CompMap;

    var id = (_props$id = props.id) !== null && _props$id !== void 0 ? _props$id : uuid();

    while (id2CompMap[id]) {
      id = uuid();
    }

    id2CompMap[id] = props.component;

    var _useDrag = useDrag({
      item: {
        type: ItemTypes.CANVAS,
        compId: id
      }
    }),
        _useDrag2 = _slicedToArray(_useDrag, 2),
        drag = _useDrag2[1];

    return props.children(drag);
  }

  function App() {
    return React.createElement(GragProvider, null, React.createElement("div", {
      className: 'comp-bar'
    }, React.createElement(FtrFunc, null), React.createElement(FtrClass, null), React.createElement(FtrBox, null)), React.createElement(Canvas, {
      className: 'border'
    }));
  }

  function FtrFunc() {
    return React.createElement(Feature, {
      component: Table
    }, function (ref) {
      return React.createElement("div", {
        ref: ref,
        className: 'preview'
      }, "Func\u7EC4\u4EF6");
    });
  }

  function FtrClass() {
    return React.createElement(Feature, {
      component: Select
    }, function (ref) {
      return React.createElement("div", {
        ref: ref,
        className: 'preview'
      }, "Class\u7EC4\u4EF6");
    });
  }

  function FtrBox() {
    return React.createElement(Feature, {
      component: Box
    }, function (ref) {
      return React.createElement("div", {
        ref: ref,
        className: 'preview'
      }, "Box");
    });
  }

  var Select =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(Select, _React$Component);

    function Select() {
      _classCallCheck(this, Select);

      return _possibleConstructorReturn(this, _getPrototypeOf(Select).apply(this, arguments));
    }

    _createClass(Select, [{
      key: "render",
      value: function render() {
        return React.createElement("select", {
          style: {
            width: '60px',
            height: '30px'
          }
        }, React.createElement("option", null, "opt1"), React.createElement("option", null, "opt2"), React.createElement("option", null, "opt3"));
      }
    }]);

    return Select;
  }(React.Component);

  function Box(props) {
    return React.createElement("div", {
      style: {
        border: '1px solid #000',
        width: 150,
        height: 150
      }
    }, props.children);
  }

  function Table() {
    return React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
      colSpan: 2
    }, "The table header"))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, "The table body"), React.createElement("td", null, "with two columns"))));
  }

  ReactDOM.render(React.createElement(App), document.getElementById('root'));

}(React, ReactDOM));
//# sourceMappingURL=bundle.js.map
