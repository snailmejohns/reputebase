/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @rainbow-me/rainbowkit/styles.css */ \"./node_modules/@rainbow-me/rainbowkit/dist/index.css\");\n/* harmony import */ var _rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @rainbow-me/rainbowkit */ \"@rainbow-me/rainbowkit\");\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! wagmi */ \"wagmi\");\n/* harmony import */ var wagmi_chains__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! wagmi/chains */ \"wagmi/chains\");\n/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @tanstack/react-query */ \"@tanstack/react-query\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__, wagmi__WEBPACK_IMPORTED_MODULE_4__, wagmi_chains__WEBPACK_IMPORTED_MODULE_5__, _tanstack_react_query__WEBPACK_IMPORTED_MODULE_6__]);\n([_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__, wagmi__WEBPACK_IMPORTED_MODULE_4__, wagmi_chains__WEBPACK_IMPORTED_MODULE_5__, _tanstack_react_query__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\n\n// Define local Anvil chain for development\nconst anvil = {\n    id: 31337,\n    name: \"Anvil\",\n    nativeCurrency: {\n        decimals: 18,\n        name: \"Ether\",\n        symbol: \"ETH\"\n    },\n    rpcUrls: {\n        default: {\n            http: [\n                \"http://localhost:8545\"\n            ]\n        }\n    }\n};\nconst config = (0,_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__.getDefaultConfig)({\n    appName: \"ReputeBase\",\n    projectId: \"a93fe36da49b99b57428d4efb051be6c\" || 0,\n    chains: [\n        anvil,\n        wagmi_chains__WEBPACK_IMPORTED_MODULE_5__.baseSepolia,\n        wagmi_chains__WEBPACK_IMPORTED_MODULE_5__.base\n    ],\n    transports: {\n        [anvil.id]: (0,wagmi__WEBPACK_IMPORTED_MODULE_4__.http)(\"http://localhost:8545\"),\n        [wagmi_chains__WEBPACK_IMPORTED_MODULE_5__.baseSepolia.id]: (0,wagmi__WEBPACK_IMPORTED_MODULE_4__.http)(),\n        [wagmi_chains__WEBPACK_IMPORTED_MODULE_5__.base.id]: (0,wagmi__WEBPACK_IMPORTED_MODULE_4__.http)()\n    },\n    ssr: true,\n    locale: \"en\"\n});\nconst queryClient = new _tanstack_react_query__WEBPACK_IMPORTED_MODULE_6__.QueryClient();\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(wagmi__WEBPACK_IMPORTED_MODULE_4__.WagmiProvider, {\n        config: config,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_6__.QueryClientProvider, {\n            client: queryClient,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__.RainbowKitProvider, {\n                locale: \"en\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"/Users/nikolajburlakov/Work/Base/reputebase/frontend/pages/_app.js\",\n                    lineNumber: 45,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/nikolajburlakov/Work/Base/reputebase/frontend/pages/_app.js\",\n                lineNumber: 44,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/Users/nikolajburlakov/Work/Base/reputebase/frontend/pages/_app.js\",\n            lineNumber: 43,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/nikolajburlakov/Work/Base/reputebase/frontend/pages/_app.js\",\n        lineNumber: 42,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUErQjtBQUNZO0FBQ21DO0FBQ3hDO0FBQ1c7QUFDd0I7QUFDNUM7QUFFN0IsMkNBQTJDO0FBQzNDLE1BQU1RLFFBQVE7SUFDWkMsSUFBSTtJQUNKQyxNQUFNO0lBQ05DLGdCQUFnQjtRQUNkQyxVQUFVO1FBQ1ZGLE1BQU07UUFDTkcsUUFBUTtJQUNWO0lBQ0FDLFNBQVM7UUFDUEMsU0FBUztZQUNQUixNQUFNO2dCQUFDO2FBQXdCO1FBQ2pDO0lBQ0Y7QUFDRjtBQUVBLE1BQU1TLFNBQVNoQix3RUFBZ0JBLENBQUM7SUFDOUJpQixTQUFTO0lBQ1RDLFdBQVdDLGtDQUFnRCxJQUFJO0lBQy9ERyxRQUFRO1FBQUNkO1FBQU9KLHFEQUFXQTtRQUFFRCw4Q0FBSUE7S0FBQztJQUNsQ29CLFlBQVk7UUFDVixDQUFDZixNQUFNQyxFQUFFLENBQUMsRUFBRUYsMkNBQUlBLENBQUM7UUFDakIsQ0FBQ0gscURBQVdBLENBQUNLLEVBQUUsQ0FBQyxFQUFFRiwyQ0FBSUE7UUFDdEIsQ0FBQ0osOENBQUlBLENBQUNNLEVBQUUsQ0FBQyxFQUFFRiwyQ0FBSUE7SUFDakI7SUFDQWlCLEtBQUs7SUFDTEMsUUFBUTtBQUNWO0FBRUEsTUFBTUMsY0FBYyxJQUFJcEIsOERBQVdBO0FBRW5DLFNBQVNxQixNQUFNLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFFO0lBQ3JDLHFCQUNFLDhEQUFDM0IsZ0RBQWFBO1FBQUNjLFFBQVFBO2tCQUNyQiw0RUFBQ1gsc0VBQW1CQTtZQUFDeUIsUUFBUUo7c0JBQzNCLDRFQUFDekIsc0VBQWtCQTtnQkFBQ3dCLFFBQU87MEJBQ3pCLDRFQUFDRztvQkFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLbEM7QUFFQSxpRUFBZUYsS0FBS0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL0ByZXB1dGViYXNlL2Zyb250ZW5kLy4vcGFnZXMvX2FwcC5qcz9lMGFkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJztcbmltcG9ydCAnQHJhaW5ib3ctbWUvcmFpbmJvd2tpdC9zdHlsZXMuY3NzJztcbmltcG9ydCB7IGdldERlZmF1bHRDb25maWcsIFJhaW5ib3dLaXRQcm92aWRlciB9IGZyb20gJ0ByYWluYm93LW1lL3JhaW5ib3draXQnO1xuaW1wb3J0IHsgV2FnbWlQcm92aWRlciB9IGZyb20gJ3dhZ21pJztcbmltcG9ydCB7IGJhc2UsIGJhc2VTZXBvbGlhIH0gZnJvbSAnd2FnbWkvY2hhaW5zJztcbmltcG9ydCB7IFF1ZXJ5Q2xpZW50UHJvdmlkZXIsIFF1ZXJ5Q2xpZW50IH0gZnJvbSAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5JztcbmltcG9ydCB7IGh0dHAgfSBmcm9tICd3YWdtaSc7XG5cbi8vIERlZmluZSBsb2NhbCBBbnZpbCBjaGFpbiBmb3IgZGV2ZWxvcG1lbnRcbmNvbnN0IGFudmlsID0ge1xuICBpZDogMzEzMzcsXG4gIG5hbWU6ICdBbnZpbCcsXG4gIG5hdGl2ZUN1cnJlbmN5OiB7XG4gICAgZGVjaW1hbHM6IDE4LFxuICAgIG5hbWU6ICdFdGhlcicsXG4gICAgc3ltYm9sOiAnRVRIJyxcbiAgfSxcbiAgcnBjVXJsczoge1xuICAgIGRlZmF1bHQ6IHtcbiAgICAgIGh0dHA6IFsnaHR0cDovL2xvY2FsaG9zdDo4NTQ1J10sXG4gICAgfSxcbiAgfSxcbn07XG5cbmNvbnN0IGNvbmZpZyA9IGdldERlZmF1bHRDb25maWcoe1xuICBhcHBOYW1lOiAnUmVwdXRlQmFzZScsXG4gIHByb2plY3RJZDogcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfV0FMTEVUQ09OTkVDVF9QUk9KRUNUX0lEIHx8ICdZT1VSX1BST0pFQ1RfSUQnLFxuICBjaGFpbnM6IFthbnZpbCwgYmFzZVNlcG9saWEsIGJhc2VdLFxuICB0cmFuc3BvcnRzOiB7XG4gICAgW2FudmlsLmlkXTogaHR0cCgnaHR0cDovL2xvY2FsaG9zdDo4NTQ1JyksXG4gICAgW2Jhc2VTZXBvbGlhLmlkXTogaHR0cCgpLFxuICAgIFtiYXNlLmlkXTogaHR0cCgpLFxuICB9LFxuICBzc3I6IHRydWUsXG4gIGxvY2FsZTogJ2VuJywgLy8gRm9yY2UgRW5nbGlzaCBsYW5ndWFnZVxufSk7XG5cbmNvbnN0IHF1ZXJ5Q2xpZW50ID0gbmV3IFF1ZXJ5Q2xpZW50KCk7XG5cbmZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfSkge1xuICByZXR1cm4gKFxuICAgIDxXYWdtaVByb3ZpZGVyIGNvbmZpZz17Y29uZmlnfT5cbiAgICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17cXVlcnlDbGllbnR9PlxuICAgICAgICA8UmFpbmJvd0tpdFByb3ZpZGVyIGxvY2FsZT1cImVuXCI+XG4gICAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgICA8L1JhaW5ib3dLaXRQcm92aWRlcj5cbiAgICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj5cbiAgICA8L1dhZ21pUHJvdmlkZXI+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IE15QXBwO1xuXG4iXSwibmFtZXMiOlsiZ2V0RGVmYXVsdENvbmZpZyIsIlJhaW5ib3dLaXRQcm92aWRlciIsIldhZ21pUHJvdmlkZXIiLCJiYXNlIiwiYmFzZVNlcG9saWEiLCJRdWVyeUNsaWVudFByb3ZpZGVyIiwiUXVlcnlDbGllbnQiLCJodHRwIiwiYW52aWwiLCJpZCIsIm5hbWUiLCJuYXRpdmVDdXJyZW5jeSIsImRlY2ltYWxzIiwic3ltYm9sIiwicnBjVXJscyIsImRlZmF1bHQiLCJjb25maWciLCJhcHBOYW1lIiwicHJvamVjdElkIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX1dBTExFVENPTk5FQ1RfUFJPSkVDVF9JRCIsImNoYWlucyIsInRyYW5zcG9ydHMiLCJzc3IiLCJsb2NhbGUiLCJxdWVyeUNsaWVudCIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwiY2xpZW50Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "@rainbow-me/rainbowkit":
/*!*****************************************!*\
  !*** external "@rainbow-me/rainbowkit" ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@rainbow-me/rainbowkit");;

/***/ }),

/***/ "@tanstack/react-query":
/*!****************************************!*\
  !*** external "@tanstack/react-query" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@tanstack/react-query");;

/***/ }),

/***/ "wagmi":
/*!************************!*\
  !*** external "wagmi" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi");;

/***/ }),

/***/ "wagmi/chains":
/*!*******************************!*\
  !*** external "wagmi/chains" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi/chains");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/@rainbow-me"], () => (__webpack_exec__("./pages/_app.js")));
module.exports = __webpack_exports__;

})();