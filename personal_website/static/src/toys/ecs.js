/******/ APPS.push(() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ecs/component.ts":
/*!******************************!*\
  !*** ./src/ecs/component.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


  Object.defineProperty(exports, "__esModule", ({ value: true }));
  exports.EntityComponentHandler = exports.GlobalComponentHandler = exports.ComponentHandler = exports.getGlobalComponent = exports.addGlobalComponent = exports.GlobalComponent = exports.hasComponent = exports.removeComponent = exports.getComponent = exports.updatedComponent = exports.addComponent = exports.getComponentGroup = exports.getComponentGroupByKey = exports.getComponentGroupKey = exports.getComponentId = exports.Component = void 0;
  const ecs_1 = __webpack_require__(/*! ./ecs */ "./src/ecs/ecs.ts");
  const entity_1 = __webpack_require__(/*! ./entity */ "./src/ecs/entity.ts");
  const Component = (module, global = false, name) => {
      const id = module.counters.component++;
      if (global) {
          module.globalComponentIds.push(id);
      }
      else {
          module.componentIds.push(id);
      }
      if ((0, ecs_1.isECS)(module) && !global) {
          module.components[id] = {};
          module.componentGroupMemberships[id] = [];
          module.componentTriggers[id] = [];
      }
      return { id, module: module.id, global, name };
  };
  exports.Component = Component;
  const createGroupKey = (cids) => {
      return cids.join(':');
  };
  const getComponentId = (module, component) => {
      var _a;
      if (module.id === component.module) {
          return component.id;
      }
      else {
          const mappedId = (_a = module.moduleIdMap[component.module]) === null || _a === void 0 ? void 0 : _a.components[component.id];
          if (mappedId === undefined) {
              throw new Error(`Attempted to reference an unimported component ${component.name} within module ${module.name}`);
          }
          else {
              return mappedId;
          }
      }
  };
  exports.getComponentId = getComponentId;
  const getComponentGroupKey = (module, components) => {
      return createGroupKey(components.filter(c => !c.global).map(c => (0, exports.getComponentId)(module, c)).sort());
  };
  exports.getComponentGroupKey = getComponentGroupKey;
  const getComponentGroupByKey = (ecs, key) => {
      if (key === '') {
          return Object.keys(ecs.entities).map(Number);
      }
      else {
          return ecs.componentGroups[key] || [];
      }
  };
  exports.getComponentGroupByKey = getComponentGroupByKey;
  const getComponentGroup = (ecs, components) => {
      const key = (0, exports.getComponentGroupKey)(ecs, components);
      return (0, exports.getComponentGroupByKey)(ecs, key);
  };
  exports.getComponentGroup = getComponentGroup;
  const deleteValue = (arr, val) => {
      const index = arr.indexOf(val);
      if (index >= 0) {
          arr.splice(index, 1);
      }
  };
  const addComponent = (ecs, entity, component, value) => {
      if (value === undefined) {
          (0, exports.removeComponent)(ecs, entity, component);
          return;
      }
      const componentId = (0, exports.getComponentId)(ecs, component);
      let oldValue;
      if (component.global) {
          oldValue = ecs.globalComponents[componentId];
          ecs.globalComponents[componentId] = value;
      }
      else {
          oldValue = ecs.components[componentId][entity];
          ecs.components[componentId][entity] = value;
          if (oldValue === undefined) {
              ecs.entities[entity].push(componentId);
              const cids = ecs.entities[entity];
              ecs.componentGroupMemberships[componentId]
                  .filter(m => {
                  const validEntityMembership = m.every(cid => cids.includes(cid));
                  const group = ecs.componentGroups[createGroupKey(m)];
                  const validGroup = !group || !group.includes(entity);
                  return validEntityMembership && validGroup;
              })
                  .forEach(m => {
                  const key = createGroupKey(m);
                  const group = ecs.componentGroups[key];
                  if (group) {
                      group.push(entity);
                  }
                  else {
                      ecs.componentGroups[key] = [entity];
                  }
              });
          }
      }
      const triggers = ecs.componentTriggers[componentId];
      if (triggers && triggers.length) {
          triggers.forEach(tid => ecs.triggers[tid].runner(ecs, entity, oldValue));
      }
  };
  exports.addComponent = addComponent;
  const updatedComponent = (ecs, entity, component) => {
      (0, exports.addComponent)(ecs, entity, component, (0, exports.getComponent)(ecs, entity, component));
  };
  exports.updatedComponent = updatedComponent;
  const getComponent = (ecs, entity, component) => {
      if (component.global) {
          return ecs.globalComponents[(0, exports.getComponentId)(ecs, component)];
      }
      else {
          return ecs.components[(0, exports.getComponentId)(ecs, component)][entity];
      }
  };
  exports.getComponent = getComponent;
  const removeComponent = (ecs, entity, component) => {
      const componentId = (0, exports.getComponentId)(ecs, component);
      let oldValue;
      if (component.global) {
          oldValue = ecs.globalComponents[componentId];
          delete ecs.globalComponents[componentId];
      }
      else {
          oldValue = ecs.components[componentId][entity];
          delete ecs.components[componentId][entity];
          if (oldValue !== undefined) {
              ecs.componentGroupMemberships[componentId]
                  .forEach(m => {
                  const group = ecs.componentGroups[createGroupKey(m)];
                  if (group) {
                      deleteValue(group, entity);
                  }
              });
          }
          deleteValue(ecs.entities[entity], componentId);
      }
      const triggers = ecs.componentTriggers[componentId];
      if (triggers && triggers.length) {
          triggers.forEach(tid => ecs.triggers[tid].runner(ecs, entity, oldValue));
      }
  };
  exports.removeComponent = removeComponent;
  const hasComponent = (ecs, entity, component) => {
      if (component.global) {
          return ecs.globalComponents[(0, exports.getComponentId)(ecs, component)] !== undefined;
      }
      else {
          return ecs.components[(0, exports.getComponentId)(ecs, component)][entity] !== undefined;
      }
  };
  exports.hasComponent = hasComponent;
  const GlobalComponent = (module, value) => {
      const component = (0, exports.Component)(module, true);
      if (value) {
          module.globalComponents[(0, exports.getComponentId)(module, component)] = value;
      }
      return component;
  };
  exports.GlobalComponent = GlobalComponent;
  const addGlobalComponent = (module, component, value) => {
      if (component.global) {
          module.globalComponents[(0, exports.getComponentId)(module, component)] = value;
      }
  };
  exports.addGlobalComponent = addGlobalComponent;
  const getGlobalComponent = (module, component) => {
      if (component.global) {
          return module.globalComponents[(0, exports.getComponentId)(module, component)];
      }
  };
  exports.getGlobalComponent = getGlobalComponent;
  class ComponentHandler {
      constructor(ecs, entity) {
          this.ecs = ecs;
          this.entity = entity;
      }
      get(component) {
          return (0, exports.getComponent)(this.ecs, this.entity, component);
      }
      add(component) {
          return (value) => {
              (0, exports.addComponent)(this.ecs, this.entity, component, value);
          };
      }
      remove(component) {
          (0, exports.removeComponent)(this.ecs, this.entity, component);
      }
      has(component) {
          return (0, exports.hasComponent)(this.ecs, this.entity, component);
      }
  }
  exports.ComponentHandler = ComponentHandler;
  const GlobalComponentHandler = (ecs) => new ComponentHandler(ecs);
  exports.GlobalComponentHandler = GlobalComponentHandler;
  const EntityComponentHandler = (ecs, entity = undefined) => {
      if (entity === undefined) {
          entity = (0, entity_1.Entity)(ecs);
      }
      return new ComponentHandler(ecs, entity);
  };
  exports.EntityComponentHandler = EntityComponentHandler;
  
  
  /***/ }),
  
  /***/ "./src/ecs/ecs.ts":
  /*!************************!*\
    !*** ./src/ecs/ecs.ts ***!
    \************************/
  /***/ ((__unused_webpack_module, exports) => {
  
  
  Object.defineProperty(exports, "__esModule", ({ value: true }));
  exports.ECS = exports.Module = exports.isECS = void 0;
  const ECSCounter = (() => {
      let count = 0;
      return () => count++;
  })();
  const isECS = (module) => {
      return module.entities !== undefined;
  };
  exports.isECS = isECS;
  const Module = (name) => {
      return {
          id: ECSCounter(),
          name,
          counters: { entity: 0, component: 0, system: 0, hook: 0, trigger: 0 },
          componentIds: [],
          globalComponentIds: [],
          globalComponents: {},
          systems: {},
          hooks: {},
          triggers: {},
          moduleIdMap: {},
          dependencies: [],
          imported: []
      };
  };
  exports.Module = Module;
  const ECS = (name) => {
      return Object.assign(Object.assign({}, (0, exports.Module)(name)), { entities: {}, componentGroups: {}, componentGroupMemberships: {}, components: {}, componentTriggers: {} });
  };
  exports.ECS = ECS;
  
  
  /***/ }),
  
  /***/ "./src/ecs/entity.ts":
  /*!***************************!*\
    !*** ./src/ecs/entity.ts ***!
    \***************************/
  /***/ ((__unused_webpack_module, exports) => {
  
  
  Object.defineProperty(exports, "__esModule", ({ value: true }));
  exports.deleteEntity = exports.Entity = void 0;
  const Entity = (ecs) => {
      let id = ecs.counters.entity++;
      while (ecs.entities[id]) {
          id++;
      }
      ecs.entities[id] = [];
      return id;
  };
  exports.Entity = Entity;
  const deleteEntity = (ecs, entity) => {
      for (let cid in ecs.components) {
          delete ecs.components[cid][entity];
      }
      for (let cgid in ecs.componentGroups) {
          const index = ecs.componentGroups[cgid].indexOf(entity);
          if (index >= 0) {
              ecs.componentGroups[cgid].splice(index, 1);
          }
      }
      delete ecs.entities[entity];
  };
  exports.deleteEntity = deleteEntity;
  
  
  /***/ }),
  
  /***/ "./src/ecs/hook.ts":
  /*!*************************!*\
    !*** ./src/ecs/hook.ts ***!
    \*************************/
  /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
  
  
  Object.defineProperty(exports, "__esModule", ({ value: true }));
  exports.addSystemToHook = exports.triggerHook = exports.getHookId = exports.Hook = void 0;
  const system_1 = __webpack_require__(/*! ./system */ "./src/ecs/system.ts");
  const Hook = (module, name) => {
      const id = module.counters.hook++;
      module.hooks[id] = [];
      return { id, module: module.id, name };
  };
  exports.Hook = Hook;
  const getHookId = (module, hook) => {
      var _a;
      if (module.id === hook.module) {
          return hook.id;
      }
      else {
          const mappedId = (_a = module.moduleIdMap[hook.module]) === null || _a === void 0 ? void 0 : _a.hooks[hook.id];
          if (mappedId === undefined) {
              throw new Error(`Attempted to reference an unimported component ${hook.name} within module ${module.name}`);
          }
          else {
              return mappedId;
          }
      }
  };
  exports.getHookId = getHookId;
  const triggerHook = (ecs, hook) => {
      const systemIds = ecs.hooks[(0, exports.getHookId)(ecs, hook)];
      systemIds.forEach(sid => {
          const system = ecs.systems[sid];
          system.runner(ecs);
      });
  };
  exports.triggerHook = triggerHook;
  const addSystemToHook = (ecs, hook, systemId, before, after) => {
      const systems = ecs.hooks[(0, exports.getHookId)(ecs, hook)];
      const maxIndex = Math.min(...before.map(s => systems.indexOf((0, system_1.getSystemId)(ecs, s))).filter(index => index >= 0).concat([systems.length]));
      const minIndex = Math.max(...after.map(s => systems.indexOf((0, system_1.getSystemId)(ecs, s))).filter(index => index >= 0).concat([-1]));
      if (minIndex >= maxIndex) {
          throw new Error('impossible to satisfy before and after requirements of the system');
      }
      systems.splice(minIndex + 1, 0, systemId);
  };
  exports.addSystemToHook = addSystemToHook;
  
  
  /***/ }),
  
  /***/ "./src/ecs/module.ts":
  /*!***************************!*\
    !*** ./src/ecs/module.ts ***!
    \***************************/
  /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
  
  
  Object.defineProperty(exports, "__esModule", ({ value: true }));
  exports.addDependancy = exports.importModule = void 0;
  const ecs_1 = __webpack_require__(/*! ./ecs */ "./src/ecs/ecs.ts");
  const component_1 = __webpack_require__(/*! ./component */ "./src/ecs/component.ts");
  const hook_1 = __webpack_require__(/*! ./hook */ "./src/ecs/hook.ts");
  const system_1 = __webpack_require__(/*! ./system */ "./src/ecs/system.ts");
  const trigger_1 = __webpack_require__(/*! ./trigger */ "./src/ecs/trigger.ts");
  const getOriginalId = (module, mappedId, name) => {
      for (let [moduleId, idMaps] of Object.entries(module.moduleIdMap)) {
          const idMap = idMaps[name];
          const entry = Object.entries(idMap).find(([_, mid]) => mid === mappedId);
          if (entry) {
              return { id: Number(entry[0]), module: Number(moduleId) };
          }
      }
      return { id: mappedId, module: module.id };
  };
  const forwardOriginalId = (to, from, mappedId, name, createNew) => {
      const original = getOriginalId(from, mappedId, name);
      if (!to.moduleIdMap[original.module]) {
          to.moduleIdMap[original.module] = { components: {}, systems: {}, hooks: {}, triggers: {} };
      }
      if (to.moduleIdMap[original.module][name][original.id] === undefined) {
          to.moduleIdMap[original.module][name][original.id] = createNew();
      }
  };
  const importModule = (to, from) => {
      if ((0, ecs_1.isECS)(from)) {
          throw new Error('cannot import an ecs into another ecs, must use modules');
      }
      if (to.imported.includes(from.id)) {
          return;
      }
      from.dependencies.forEach(dependancy => (0, exports.importModule)(to, dependancy));
      to.moduleIdMap[from.id] = { components: {}, systems: {}, hooks: {}, triggers: {} };
      from.componentIds.forEach(cid => {
          forwardOriginalId(to, from, cid, 'components', () => (0, component_1.Component)(to).id);
      });
      from.globalComponentIds.forEach(cid => {
          forwardOriginalId(to, from, cid, 'components', () => (0, component_1.GlobalComponent)(to, from.globalComponents[cid]).id);
      });
      Object.keys(from.hooks).map(Number).forEach(hid => {
          forwardOriginalId(to, from, hid, 'hooks', () => (0, hook_1.Hook)(to).id);
      });
      Object.entries(from.systems).forEach(([key, runner]) => {
          forwardOriginalId(to, from, Number(key), 'systems', () => (0, system_1.addSystem)(to, runner).id);
      });
      Object.entries(from.triggers).forEach(([key, runner]) => {
          forwardOriginalId(to, from, Number(key), 'triggers', () => (0, trigger_1.addTrigger)(to, runner).id);
      });
      to.imported.push(from.id);
      from.imported.forEach(id => {
          if (!to.imported.includes(id)) {
              to.imported.push(id);
          }
      });
  };
  exports.importModule = importModule;
  const addDependancy = (target, dependancy) => {
      target.dependencies.push(dependancy);
  };
  exports.addDependancy = addDependancy;
  
  
  /***/ }),
  
  /***/ "./src/ecs/program.ts":
  /*!****************************!*\
    !*** ./src/ecs/program.ts ***!
    \****************************/
  /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
  
  
  Object.defineProperty(exports, "__esModule", ({ value: true }));
  exports.Program = void 0;
  const hook_1 = __webpack_require__(/*! ./hook */ "./src/ecs/hook.ts");
  const Program = (steps) => {
      let compiled = steps.map(step => typeof step === 'function' ? step : (ecs) => (0, hook_1.triggerHook)(ecs, step));
      return (ecs) => {
          compiled.forEach(step => step(ecs));
      };
  };
  exports.Program = Program;
  
  
  /***/ }),
  
  /***/ "./src/ecs/system.ts":
  /*!***************************!*\
    !*** ./src/ecs/system.ts ***!
    \***************************/
  /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
  
  
  Object.defineProperty(exports, "__esModule", ({ value: true }));
  exports.registerSystem = exports.getSystemId = exports.addSystem = exports.GlobalSystem = exports.System = void 0;
  const ecs_1 = __webpack_require__(/*! ./ecs */ "./src/ecs/ecs.ts");
  const component_1 = __webpack_require__(/*! ./component */ "./src/ecs/component.ts");
  const hook_1 = __webpack_require__(/*! ./hook */ "./src/ecs/hook.ts");
  const isAdvancedQuery = (q) => {
      return q.with !== undefined && typeof q.with !== "function";
  };
  const asComponentList = (cl) => {
      return cl;
  };
  const System = (module, hook, query, func, name) => {
      const components = asComponentList(isAdvancedQuery(query) ? query.with : query);
      const negatedComponents = asComponentList(isAdvancedQuery(query) ? query.without : undefined);
      const systemRunner = (ecs) => {
          const key = (0, component_1.getComponentGroupKey)(ecs, components);
          const entityIds = (0, component_1.getComponentGroupByKey)(ecs, key);
          entityIds.forEach(eid => {
              if (!negatedComponents || negatedComponents.every(c => !(0, component_1.hasComponent)(ecs, eid, c))) {
                  func(ecs, eid, ...components.map(c => (0, component_1.getComponent)(ecs, Number(eid), c)));
              }
          });
      };
      const before = isAdvancedQuery(query) ? query.before || [] : [];
      const after = isAdvancedQuery(query) ? query.after || [] : [];
      const runner = { runner: systemRunner, query: query, hook, name, before, after };
      return (0, exports.addSystem)(module, runner);
  };
  exports.System = System;
  const GlobalSystem = (module, hook, func, name) => {
      const runner = { runner: func, query: undefined, hook, name, before: [], after: [] };
      return (0, exports.addSystem)(module, runner);
  };
  exports.GlobalSystem = GlobalSystem;
  const addSystem = (module, runner) => {
      const id = module.counters.system++;
      if ((0, ecs_1.isECS)(module)) {
          if (runner.query) {
              (0, exports.registerSystem)(module, runner);
          }
          (0, hook_1.addSystemToHook)(module, runner.hook, id, runner.before, runner.after);
      }
      module.systems[id] = runner;
      return { id, module: module.id, name: runner.name };
  };
  exports.addSystem = addSystem;
  const getSystemId = (ecs, system) => {
      var _a;
      if (ecs.id === system.module) {
          return system.id;
      }
      else {
          const mappedId = (_a = ecs.moduleIdMap[system.module]) === null || _a === void 0 ? void 0 : _a.systems[system.id];
          if (mappedId === undefined) {
              throw new Error(`Attempted to reference an unimported component ${system.name} within module ${ecs.name}`);
          }
          else {
              return mappedId;
          }
      }
  };
  exports.getSystemId = getSystemId;
  const registerSystem = (ecs, runner) => {
      const components = asComponentList(isAdvancedQuery(runner.query) ? runner.query.with : runner.query);
      const entityComponents = components.filter(c => !c.global);
      const key = (0, component_1.getComponentGroupKey)(ecs, components);
      ecs.componentGroups[key] = [];
      Object.entries(ecs.entities).forEach(([entity, cids]) => {
          if (entityComponents.every(c => cids.includes((0, component_1.getComponentId)(ecs, c)))) {
              ecs.componentGroups[key].push(Number(entity));
          }
      });
      const cids = entityComponents.map(c => (0, component_1.getComponentId)(ecs, c)).sort();
      entityComponents.forEach(c => {
          const memberships = ecs.componentGroupMemberships[(0, component_1.getComponentId)(ecs, c)];
          if (!memberships.some(m => m.length === cids.length && m.every((cid, i) => cid === cids[i]))) {
              memberships.push(cids);
          }
      });
  };
  exports.registerSystem = registerSystem;
  
  
  /***/ }),
  
  /***/ "./src/ecs/trigger.ts":
  /*!****************************!*\
    !*** ./src/ecs/trigger.ts ***!
    \****************************/
  /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
  
  
  Object.defineProperty(exports, "__esModule", ({ value: true }));
  exports.getTriggerId = exports.addTrigger = exports.GlobalTrigger = exports.Trigger = void 0;
  const component_1 = __webpack_require__(/*! ./component */ "./src/ecs/component.ts");
  const ecs_1 = __webpack_require__(/*! ./ecs */ "./src/ecs/ecs.ts");
  const Trigger = (module, component, func, name) => {
      const runner = (ecs, entity, oldValue) => {
          const newValue = (0, component_1.getComponent)(ecs, entity, component);
          func(ecs, entity, oldValue, newValue);
      };
      const trigger = { component, runner, name };
      return (0, exports.addTrigger)(module, trigger);
  };
  exports.Trigger = Trigger;
  const GlobalTrigger = (module, component, func, name) => {
      if (!component.global) {
          throw new Error("can't attach global trigger to non-global component");
      }
      const runner = (ecs, entity, oldValue) => {
          const newValue = (0, component_1.getComponent)(ecs, entity, component);
          func(ecs, oldValue, newValue);
      };
      const trigger = { component, runner, name };
      return (0, exports.addTrigger)(module, trigger);
  };
  exports.GlobalTrigger = GlobalTrigger;
  const addTrigger = (module, runner) => {
      const id = module.counters.trigger++;
      module.triggers[id] = runner;
      if ((0, ecs_1.isECS)(module)) {
          module.componentTriggers[(0, component_1.getComponentId)(module, runner.component)].push(id);
      }
      return { id, module: module.id, name: runner.name };
  };
  exports.addTrigger = addTrigger;
  const getTriggerId = (ecs, trigger) => {
      var _a;
      if (ecs.id === trigger.module) {
          return trigger.id;
      }
      else {
          const mappedId = (_a = ecs.moduleIdMap[trigger.module]) === null || _a === void 0 ? void 0 : _a.systems[trigger.id];
          if (mappedId === undefined) {
              throw new Error(`Attempted to reference an unimported component ${trigger.name} within module ${ecs.name}`);
          }
          else {
              return mappedId;
          }
      }
  };
  exports.getTriggerId = getTriggerId;
  
  
  /***/ }),
  
  /***/ "./src/modules/bounds.ts":
  /*!*******************************!*\
    !*** ./src/modules/bounds.ts ***!
    \*******************************/
  /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
  
  
  Object.defineProperty(exports, "__esModule", ({ value: true }));
  exports.BoundsHitbox = exports.BoundsBounceCoef = exports.Bounds = exports.BoundsModule = void 0;
  const component_1 = __webpack_require__(/*! ../ecs/component */ "./src/ecs/component.ts");
  const ecs_1 = __webpack_require__(/*! ../ecs/ecs */ "./src/ecs/ecs.ts");
  const module_1 = __webpack_require__(/*! ../ecs/module */ "./src/ecs/module.ts");
  const system_1 = __webpack_require__(/*! ../ecs/system */ "./src/ecs/system.ts");
  const lifetime_1 = __webpack_require__(/*! ./lifetime */ "./src/modules/lifetime.ts");
  const movement_1 = __webpack_require__(/*! ./movement */ "./src/modules/movement.ts");
  const movement_2 = __webpack_require__(/*! ./movement */ "./src/modules/movement.ts");
  exports.BoundsModule = (0, ecs_1.Module)('Bounds');
  (0, module_1.addDependancy)(exports.BoundsModule, movement_1.MovementModule);
  exports.Bounds = (0, component_1.GlobalComponent)(exports.BoundsModule);
  exports.BoundsBounceCoef = (0, component_1.GlobalComponent)(exports.BoundsModule);
  exports.BoundsHitbox = (0, component_1.Component)(exports.BoundsModule);
  (0, system_1.System)(exports.BoundsModule, lifetime_1.OnUpdate, { with: [movement_1.Position, movement_1.Velocity, exports.Bounds, exports.BoundsHitbox], after: [movement_2.MovementSystem] }, (ecs, entity, pos, vel, bounds, hitbox) => {
      const bounce = (0, component_1.getGlobalComponent)(ecs, exports.BoundsBounceCoef) || 1;
      if (pos.x + hitbox.left < bounds.left) {
          pos.x = bounds.left - hitbox.left;
          vel.x *= -bounce;
      }
      else if (pos.x + hitbox.right > bounds.right) {
          pos.x = bounds.right - hitbox.right;
          vel.x *= -bounce;
      }
      if (pos.y + hitbox.bottom < bounds.bottom) {
          pos.y = bounds.bottom - hitbox.bottom;
          vel.y *= -bounce;
      }
      else if (pos.y + hitbox.top > bounds.top) {
          pos.y = bounds.top - hitbox.top;
          vel.y *= -bounce;
      }
  }, 'CheckBounds');
  
  
  /***/ }),
  
  /***/ "./src/modules/canvas.ts":
  /*!*******************************!*\
    !*** ./src/modules/canvas.ts ***!
    \*******************************/
  /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
  
  
  Object.defineProperty(exports, "__esModule", ({ value: true }));
  exports.addCanvas = exports.GFXContext = exports.Canvas = exports.CanvasModule = void 0;
  const component_1 = __webpack_require__(/*! ../ecs/component */ "./src/ecs/component.ts");
  const ecs_1 = __webpack_require__(/*! ../ecs/ecs */ "./src/ecs/ecs.ts");
  const module_1 = __webpack_require__(/*! ../ecs/module */ "./src/ecs/module.ts");
  const system_1 = __webpack_require__(/*! ../ecs/system */ "./src/ecs/system.ts");
  const lifetime_1 = __webpack_require__(/*! ./lifetime */ "./src/modules/lifetime.ts");
  exports.CanvasModule = (0, ecs_1.Module)('Canvas');
  (0, module_1.addDependancy)(exports.CanvasModule, lifetime_1.LifetimeModule);
  exports.Canvas = (0, component_1.GlobalComponent)(exports.CanvasModule);
  exports.GFXContext = (0, component_1.GlobalComponent)(exports.CanvasModule);
  const addCanvas = (ecs, canvas, ctx) => {
      (0, component_1.addGlobalComponent)(ecs, exports.Canvas, canvas);
      (0, component_1.addGlobalComponent)(ecs, exports.GFXContext, ctx || canvas.getContext('2d'));
  };
  exports.addCanvas = addCanvas;
  (0, system_1.GlobalSystem)(exports.CanvasModule, lifetime_1.PreRender, (ecs) => {
      const ctx = (0, component_1.getGlobalComponent)(ecs, exports.GFXContext);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }, 'ClearCanvas');
  
  
  /***/ }),
  
  /***/ "./src/modules/canvasCircles.ts":
  /*!**************************************!*\
    !*** ./src/modules/canvasCircles.ts ***!
    \**************************************/
  /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
  
  
  Object.defineProperty(exports, "__esModule", ({ value: true }));
  exports.FillStyle = exports.Radius = exports.CanvasCirclesModule = void 0;
  const component_1 = __webpack_require__(/*! ../ecs/component */ "./src/ecs/component.ts");
  const ecs_1 = __webpack_require__(/*! ../ecs/ecs */ "./src/ecs/ecs.ts");
  const module_1 = __webpack_require__(/*! ../ecs/module */ "./src/ecs/module.ts");
  const system_1 = __webpack_require__(/*! ../ecs/system */ "./src/ecs/system.ts");
  const movement_1 = __webpack_require__(/*! ./movement */ "./src/modules/movement.ts");
  const canvas_1 = __webpack_require__(/*! ./canvas */ "./src/modules/canvas.ts");
  const lifetime_1 = __webpack_require__(/*! ./lifetime */ "./src/modules/lifetime.ts");
  exports.CanvasCirclesModule = (0, ecs_1.Module)('CanvasCircles');
  (0, module_1.addDependancy)(exports.CanvasCirclesModule, canvas_1.CanvasModule);
  (0, module_1.addDependancy)(exports.CanvasCirclesModule, lifetime_1.LifetimeModule);
  (0, module_1.addDependancy)(exports.CanvasCirclesModule, movement_1.MovementModule);
  exports.Radius = (0, component_1.Component)(exports.CanvasCirclesModule);
  exports.FillStyle = (0, component_1.Component)(exports.CanvasCirclesModule);
  (0, system_1.System)(exports.CanvasCirclesModule, lifetime_1.OnRender, [movement_1.Position, exports.Radius, exports.FillStyle, canvas_1.GFXContext], (ecs, entity, pos, radius, fillStyle, ctx) => {
      ctx.fillStyle = fillStyle;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
      ctx.fill();
  }, 'Render');
  
  
  /***/ }),
  
  /***/ "./src/modules/cellhash.ts":
  /*!*********************************!*\
    !*** ./src/modules/cellhash.ts ***!
    \*********************************/
  /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
  
  
  Object.defineProperty(exports, "__esModule", ({ value: true }));
  exports.forEachEntityInRange = exports.getEntitiesInCell = exports.removeFromCellHash = exports.addToCellHash = exports.addCellHash = exports.CellHash = exports.ParentCellHash = exports.Cell = exports.CellHashModule = void 0;
  const component_1 = __webpack_require__(/*! ../ecs/component */ "./src/ecs/component.ts");
  const ecs_1 = __webpack_require__(/*! ../ecs/ecs */ "./src/ecs/ecs.ts");
  const entity_1 = __webpack_require__(/*! ../ecs/entity */ "./src/ecs/entity.ts");
  const trigger_1 = __webpack_require__(/*! ../ecs/trigger */ "./src/ecs/trigger.ts");
  exports.CellHashModule = (0, ecs_1.Module)('CellHash');
  exports.Cell = (0, component_1.Component)(exports.CellHashModule);
  exports.ParentCellHash = (0, component_1.Component)(exports.CellHashModule);
  exports.CellHash = (0, component_1.Component)(exports.CellHashModule);
  (0, trigger_1.Trigger)(exports.CellHashModule, exports.Cell, (ecs, entity, oldCell, newCell) => {
      const cellHashEntity = (0, component_1.getComponent)(ecs, entity, exports.ParentCellHash);
      if (cellHashEntity !== undefined) {
          const cellHash = (0, component_1.getComponent)(ecs, cellHashEntity, exports.CellHash);
          if (oldCell === undefined && newCell === undefined) {
              return;
          }
          else if (oldCell === undefined && newCell !== undefined) {
              get(cellHash, newCell).push(entity);
          }
          else if (oldCell !== undefined && newCell === undefined) {
              remove(get(cellHash, oldCell), entity);
          }
          else if (oldCell.x !== newCell.x || oldCell.y !== newCell.y) {
              remove(get(cellHash, oldCell), entity);
              get(cellHash, newCell).push(entity);
          }
      }
  }, 'CellHash');
  const get = (cellHash, cell) => {
      if (!cellHash[cell.x]) {
          cellHash[cell.x] = {};
      }
      let entities = cellHash[cell.x][cell.y];
      if (!entities) {
          entities = [];
          cellHash[cell.x][cell.y] = entities;
      }
      return entities;
  };
  const remove = (arr, val) => {
      const index = arr.indexOf(val);
      if (index >= 0) {
          arr.splice(index, 1);
      }
  };
  const addCellHash = (ecs) => {
      const cellHashEntity = (0, entity_1.Entity)(ecs);
      (0, component_1.addComponent)(ecs, cellHashEntity, exports.CellHash, {});
      return cellHashEntity;
  };
  exports.addCellHash = addCellHash;
  const addToCellHash = (ecs, cellHashEntity, entity, cell) => {
      (0, component_1.addComponent)(ecs, entity, exports.ParentCellHash, cellHashEntity);
      (0, component_1.addComponent)(ecs, entity, exports.Cell, cell || { x: 0, y: 0 });
  };
  exports.addToCellHash = addToCellHash;
  const removeFromCellHash = (ecs, cellHashEntity, entity) => {
      const cellHash = (0, component_1.getComponent)(ecs, cellHashEntity, exports.CellHash);
      Object.values(cellHash).forEach(col => Object.values(col).forEach(ents => remove(ents, entity)));
  };
  exports.removeFromCellHash = removeFromCellHash;
  const getEntitiesInCell = (ecs, cellHashEntity, cell) => {
      const cellHash = (0, component_1.getComponent)(ecs, cellHashEntity, exports.CellHash);
      return get(cellHash, cell);
  };
  exports.getEntitiesInCell = getEntitiesInCell;
  const forEachEntityInRange = (ecs, cellHashEntity, from, to, iter) => {
      for (let x = Math.min(from.x, to.x); x <= Math.max(from.x, to.x); x++) {
          for (let y = Math.min(from.y, to.y); y <= Math.max(from.y, to.y); y++) {
              (0, exports.getEntitiesInCell)(ecs, cellHashEntity, { x, y }).forEach(iter);
          }
      }
  };
  exports.forEachEntityInRange = forEachEntityInRange;
  
  
  /***/ }),
  
  /***/ "./src/modules/cellhashMovement.ts":
  /*!*****************************************!*\
    !*** ./src/modules/cellhashMovement.ts ***!
    \*****************************************/
  /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
  
  
  Object.defineProperty(exports, "__esModule", ({ value: true }));
  exports.CellHashDimensions = exports.CellHashMovementModule = void 0;
  const component_1 = __webpack_require__(/*! ../ecs/component */ "./src/ecs/component.ts");
  const ecs_1 = __webpack_require__(/*! ../ecs/ecs */ "./src/ecs/ecs.ts");
  const module_1 = __webpack_require__(/*! ../ecs/module */ "./src/ecs/module.ts");
  const trigger_1 = __webpack_require__(/*! ../ecs/trigger */ "./src/ecs/trigger.ts");
  const cellhash_1 = __webpack_require__(/*! ./cellhash */ "./src/modules/cellhash.ts");
  const movement_1 = __webpack_require__(/*! ./movement */ "./src/modules/movement.ts");
  exports.CellHashMovementModule = (0, ecs_1.Module)('CellHashMovement');
  (0, module_1.addDependancy)(exports.CellHashMovementModule, cellhash_1.CellHashModule);
  (0, module_1.addDependancy)(exports.CellHashMovementModule, movement_1.MovementModule);
  exports.CellHashDimensions = (0, component_1.Component)(exports.CellHashMovementModule);
  (0, trigger_1.Trigger)(exports.CellHashMovementModule, movement_1.Position, (ecs, entity, oldPos, newPos) => {
      const cellHashEntity = (0, component_1.getComponent)(ecs, entity, cellhash_1.ParentCellHash);
      if (cellHashEntity !== undefined) {
          const dimensions = (0, component_1.getComponent)(ecs, cellHashEntity, exports.CellHashDimensions);
          if (dimensions !== undefined) {
              const newCell = newPos && { x: Math.floor(newPos.x / dimensions.width), y: Math.floor(newPos.y / dimensions.height) };
              (0, component_1.addComponent)(ecs, entity, cellhash_1.Cell, newCell);
          }
      }
  }, 'CellHashMovement');
  
  
  /***/ }),
  
  /***/ "./src/modules/gas.ts":
  /*!****************************!*\
    !*** ./src/modules/gas.ts ***!
    \****************************/
  /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
  
  
  Object.defineProperty(exports, "__esModule", ({ value: true }));
  exports.GasConfig = exports.MoleculePressureDensityCoef = exports.MoleculeMass = exports.IsGas = exports.GasModule = void 0;
  const component_1 = __webpack_require__(/*! ../ecs/component */ "./src/ecs/component.ts");
  const ecs_1 = __webpack_require__(/*! ../ecs/ecs */ "./src/ecs/ecs.ts");
  const module_1 = __webpack_require__(/*! ../ecs/module */ "./src/ecs/module.ts");
  const system_1 = __webpack_require__(/*! ../ecs/system */ "./src/ecs/system.ts");
  const lifetime_1 = __webpack_require__(/*! ./lifetime */ "./src/modules/lifetime.ts");
  const movement_1 = __webpack_require__(/*! ./movement */ "./src/modules/movement.ts");
  const cellhash_1 = __webpack_require__(/*! ./cellhash */ "./src/modules/cellhash.ts");
  const lifetime_2 = __webpack_require__(/*! ./lifetime */ "./src/modules/lifetime.ts");
  const movement_2 = __webpack_require__(/*! ./movement */ "./src/modules/movement.ts");
  const bounds_1 = __webpack_require__(/*! ./bounds */ "./src/modules/bounds.ts");
  exports.GasModule = (0, ecs_1.Module)('Gas');
  (0, module_1.addDependancy)(exports.GasModule, lifetime_2.LifetimeModule);
  (0, module_1.addDependancy)(exports.GasModule, movement_1.MovementModule);
  (0, module_1.addDependancy)(exports.GasModule, cellhash_1.CellHashModule);
  exports.IsGas = (0, component_1.Component)(exports.GasModule);
  exports.MoleculeMass = (0, component_1.Component)(exports.GasModule);
  exports.MoleculePressureDensityCoef = (0, component_1.Component)(exports.GasModule);
  exports.GasConfig = (0, component_1.GlobalComponent)(exports.GasModule);
  const alpha = 7 / (4 * Math.PI);
  const smooth = (x, gas) => {
      x /= gas.simulationScale;
      if (x >= 2 * gas.smoothingLength) {
          return 0;
      }
      else {
          const h = gas.smoothingLength;
          const ratio = x / h;
          return (alpha / h) * (Math.pow((1 - (0.5 * ratio)), 4)) * (1 + (2 * ratio));
      }
  };
  const smoothDeriv = (v, x, gas) => {
      x /= gas.simulationScale;
      if (x >= 2 * gas.smoothingLength || x <= 0.0001) {
          return { x: 0, y: 0 };
      }
      else {
          const h = gas.smoothingLength;
          const coef = (5 * alpha * x * (Math.pow(((2 * h) - x), 3))) / (8 * (Math.pow(h, 7)));
          return { x: v.x * coef / (x * gas.simulationScale), y: v.y * coef / (x * gas.simulationScale) };
      }
  };
  const calculatePressure = (density, stateConstant, polytropicIndex) => {
      return stateConstant * Math.pow(density, 1 + (1 / polytropicIndex));
  };
  const UpdatePressureSystem = (0, system_1.System)(exports.GasModule, lifetime_1.OnUpdate, { with: [movement_1.Position, cellhash_1.Cell, cellhash_1.ParentCellHash, exports.IsGas, exports.GasConfig], before: [movement_2.MovementSystem] }, (ecs, entity, pos, cell, cellHashEntity, isGas, gas) => {
      if (isGas) {
          let density = 0;
          let n = 0;
          (0, cellhash_1.forEachEntityInRange)(ecs, cellHashEntity, { x: cell.x - 1, y: cell.y - 1 }, { x: cell.x + 1, y: cell.y + 1 }, (neighbour) => {
              const npos = (0, component_1.getComponent)(ecs, neighbour, movement_1.Position);
              const dx = pos.x - npos.x;
              const dy = pos.y - npos.y;
              const dist = Math.sqrt((dx * dx) + (dy * dy));
              const mass = (0, component_1.getComponent)(ecs, neighbour, exports.MoleculeMass) || 1;
              density += mass * smooth(dist, gas);
              n++;
          });
          const pressure = calculatePressure(density, gas.stateConstant, gas.polytropicIndex);
          const pdcoef = pressure / (density * density);
          (0, component_1.addComponent)(ecs, entity, exports.MoleculePressureDensityCoef, pdcoef);
      }
  }, 'UpdatePressure');
  (0, system_1.System)(exports.GasModule, lifetime_1.OnUpdate, {
      with: [movement_1.Position, movement_1.Velocity, exports.MoleculePressureDensityCoef, cellhash_1.Cell, cellhash_1.ParentCellHash, exports.IsGas, exports.GasConfig],
      after: [UpdatePressureSystem],
      before: [movement_2.MovementSystem]
  }, (ecs, entity, pos, vel, pdcoef, cell, cellHashEntity, isGas, gas) => {
      if (isGas) {
          const force = { x: 0, y: 0 };
          (0, cellhash_1.forEachEntityInRange)(ecs, cellHashEntity, { x: cell.x - 1, y: cell.y - 1 }, { x: cell.x + 1, y: cell.y + 1 }, (neighbour) => {
              if (neighbour === entity) {
                  return;
              }
              const npdcoef = (0, component_1.getComponent)(ecs, neighbour, exports.MoleculePressureDensityCoef);
              const npos = (0, component_1.getComponent)(ecs, neighbour, movement_1.Position);
              const mass = (0, component_1.getComponent)(ecs, neighbour, exports.MoleculeMass) || 1;
              const dx = pos.x - npos.x;
              const dy = pos.y - npos.y;
              const dist = Math.sqrt((dx * dx) + (dy * dy));
              const sv = smoothDeriv({ x: dx, y: dy }, dist, gas);
              force.x += mass * (pdcoef + npdcoef) * sv.x;
              force.y += mass * (pdcoef + npdcoef) * sv.y;
          });
          const acc = {
              x: force.x - (vel.x * gas.viscosity),
              y: force.y - (vel.y * gas.viscosity)
          };
          const bounds = (0, component_1.getGlobalComponent)(ecs, bounds_1.Bounds);
          if (bounds) {
              acc.x += (((bounds.left + bounds.right) / 2) - pos.x);
              acc.y += (((bounds.top + bounds.bottom) / 2) - pos.y);
              acc.x += gas.gravity.x;
              acc.y += gas.gravity.y;
          }
          (0, component_1.addComponent)(ecs, entity, movement_1.Acceleration, acc);
      }
  });
  
  
  /***/ }),
  
  /***/ "./src/modules/lifetime.ts":
  /*!*********************************!*\
    !*** ./src/modules/lifetime.ts ***!
    \*********************************/
  /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
  
  
  Object.defineProperty(exports, "__esModule", ({ value: true }));
  exports.LifetimeLoop = exports.UpdateTimeSystem = exports.TimeDelta = exports.LastTick = exports.OnRender = exports.PreRender = exports.PostUpdate = exports.OnUpdate = exports.PreUpdate = exports.LifetimeModule = void 0;
  const component_1 = __webpack_require__(/*! ../ecs/component */ "./src/ecs/component.ts");
  const ecs_1 = __webpack_require__(/*! ../ecs/ecs */ "./src/ecs/ecs.ts");
  const hook_1 = __webpack_require__(/*! ../ecs/hook */ "./src/ecs/hook.ts");
  const program_1 = __webpack_require__(/*! ../ecs/program */ "./src/ecs/program.ts");
  const system_1 = __webpack_require__(/*! ../ecs/system */ "./src/ecs/system.ts");
  exports.LifetimeModule = (0, ecs_1.Module)('Lifetime');
  exports.PreUpdate = (0, hook_1.Hook)(exports.LifetimeModule, 'PreUpdate');
  exports.OnUpdate = (0, hook_1.Hook)(exports.LifetimeModule, 'OnUpdate');
  exports.PostUpdate = (0, hook_1.Hook)(exports.LifetimeModule, 'PostUpdate');
  exports.PreRender = (0, hook_1.Hook)(exports.LifetimeModule, 'PreRender');
  exports.OnRender = (0, hook_1.Hook)(exports.LifetimeModule, 'OnRender');
  exports.LastTick = (0, component_1.GlobalComponent)(exports.LifetimeModule);
  exports.TimeDelta = (0, component_1.GlobalComponent)(exports.LifetimeModule, 0);
  exports.UpdateTimeSystem = (0, system_1.GlobalSystem)(exports.LifetimeModule, exports.PreUpdate, (ecs) => {
      const time = new Date().getTime() / 1000;
      const lastTime = (0, component_1.getGlobalComponent)(ecs, exports.LastTick);
      const delta = lastTime === undefined ? 0.001 : time - lastTime;
      (0, component_1.addGlobalComponent)(ecs, exports.LastTick, time);
      (0, component_1.addGlobalComponent)(ecs, exports.TimeDelta, Math.min(delta, 0.1));
  }, 'UpdateTimeDelta');
  exports.LifetimeLoop = (0, program_1.Program)([
      exports.PreUpdate,
      exports.OnUpdate,
      exports.PostUpdate,
      exports.PreRender,
      exports.OnRender
  ]);
  
  
  /***/ }),
  
  /***/ "./src/modules/movement.ts":
  /*!*********************************!*\
    !*** ./src/modules/movement.ts ***!
    \*********************************/
  /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
  
  
  Object.defineProperty(exports, "__esModule", ({ value: true }));
  exports.MovementSystem = exports.Static = exports.Acceleration = exports.Velocity = exports.Position = exports.MovementModule = void 0;
  const component_1 = __webpack_require__(/*! ../ecs/component */ "./src/ecs/component.ts");
  const ecs_1 = __webpack_require__(/*! ../ecs/ecs */ "./src/ecs/ecs.ts");
  const module_1 = __webpack_require__(/*! ../ecs/module */ "./src/ecs/module.ts");
  const system_1 = __webpack_require__(/*! ../ecs/system */ "./src/ecs/system.ts");
  const lifetime_1 = __webpack_require__(/*! ./lifetime */ "./src/modules/lifetime.ts");
  exports.MovementModule = (0, ecs_1.Module)('Movement');
  (0, module_1.addDependancy)(exports.MovementModule, lifetime_1.LifetimeModule);
  exports.Position = (0, component_1.Component)(exports.MovementModule);
  exports.Velocity = (0, component_1.Component)(exports.MovementModule);
  exports.Acceleration = (0, component_1.Component)(exports.MovementModule);
  exports.Static = (0, component_1.Component)(exports.MovementModule);
  (0, system_1.System)(exports.MovementModule, lifetime_1.PreUpdate, { with: [exports.Velocity, exports.Acceleration, lifetime_1.TimeDelta], after: [lifetime_1.UpdateTimeSystem] }, (ecs, entity, vel, acc, delta) => {
      vel.x += acc.x * delta / 2;
      vel.y += acc.y * delta / 2;
      (0, component_1.updatedComponent)(ecs, entity, exports.Velocity);
  }, 'KickAcceleration');
  exports.MovementSystem = (0, system_1.System)(exports.MovementModule, lifetime_1.OnUpdate, { with: [exports.Position, exports.Velocity, lifetime_1.TimeDelta], without: [exports.Static] }, (ecs, entity, pos, vel, delta) => {
      const acc = (0, component_1.getComponent)(ecs, entity, exports.Acceleration);
      pos.x += vel.x * delta;
      pos.y += vel.y * delta;
      (0, component_1.updatedComponent)(ecs, entity, exports.Position);
      if (acc) {
          vel.x += acc.x * delta / 2;
          vel.y += acc.y * delta / 2;
          (0, component_1.updatedComponent)(ecs, entity, exports.Velocity);
      }
  }, 'Movement');
  
  
  /***/ })
  
  /******/ 	});
  /************************************************************************/
  /******/ 	// The module cache
  /******/ 	var __webpack_module_cache__ = {};
  /******/ 	
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/ 		// Check if module is in cache
  /******/ 		var cachedModule = __webpack_module_cache__[moduleId];
  /******/ 		if (cachedModule !== undefined) {
  /******/ 			return cachedModule.exports;
  /******/ 		}
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = __webpack_module_cache__[moduleId] = {
  /******/ 			// no module.id needed
  /******/ 			// no module.loaded needed
  /******/ 			exports: {}
  /******/ 		};
  /******/ 	
  /******/ 		// Execute the module function
  /******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  /******/ 	
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/ 	
  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
  var exports = __webpack_exports__;
  /*!***************************!*\
    !*** ./src/gasExample.ts ***!
    \***************************/
  
  Object.defineProperty(exports, "__esModule", ({ value: true }));
  const component_1 = __webpack_require__(/*! ./ecs/component */ "./src/ecs/component.ts");
  const ecs_1 = __webpack_require__(/*! ./ecs/ecs */ "./src/ecs/ecs.ts");
  const entity_1 = __webpack_require__(/*! ./ecs/entity */ "./src/ecs/entity.ts");
  const module_1 = __webpack_require__(/*! ./ecs/module */ "./src/ecs/module.ts");
  const bounds_1 = __webpack_require__(/*! ./modules/bounds */ "./src/modules/bounds.ts");
  const canvas_1 = __webpack_require__(/*! ./modules/canvas */ "./src/modules/canvas.ts");
  const canvasCircles_1 = __webpack_require__(/*! ./modules/canvasCircles */ "./src/modules/canvasCircles.ts");
  const cellhash_1 = __webpack_require__(/*! ./modules/cellhash */ "./src/modules/cellhash.ts");
  const cellhashMovement_1 = __webpack_require__(/*! ./modules/cellhashMovement */ "./src/modules/cellhashMovement.ts");
  const gas_1 = __webpack_require__(/*! ./modules/gas */ "./src/modules/gas.ts");
  const lifetime_1 = __webpack_require__(/*! ./modules/lifetime */ "./src/modules/lifetime.ts");
  const movement_1 = __webpack_require__(/*! ./modules/movement */ "./src/modules/movement.ts");
  const movement_2 = __webpack_require__(/*! ./modules/movement */ "./src/modules/movement.ts");
  const ecs = (0, ecs_1.ECS)('MainECS');
  (0, module_1.importModule)(ecs, lifetime_1.LifetimeModule);
  (0, module_1.importModule)(ecs, movement_2.MovementModule);
  (0, module_1.importModule)(ecs, cellhash_1.CellHashModule);
  (0, module_1.importModule)(ecs, cellhashMovement_1.CellHashMovementModule);
  (0, module_1.importModule)(ecs, canvas_1.CanvasModule);
  (0, module_1.importModule)(ecs, canvasCircles_1.CanvasCirclesModule);
  (0, module_1.importModule)(ecs, gas_1.GasModule);
  (0, module_1.importModule)(ecs, bounds_1.BoundsModule);
  const simulationScale = 20;
  const smoothingLength = 1;
  const canvas = document.getElementById('canvas');
  const resizeCanvas = () => {
    const toyContent = document.getElementById('toy-content').getBoundingClientRect();
    canvas.width = 1000;
    canvas.height = toyContent.height;
  };
  window.addEventListener('resize', () => resizeCanvas());
  resizeCanvas();
  const viscosityEl = document.getElementById('viscosity');
  const polytropicIndexEl = document.getElementById('polytropicIndex');
  const stateConstantEl = document.getElementById('stateConstant');
  const gravityXEl = document.getElementById('gravity-x');
  const gravityYEl = document.getElementById('gravity-y');
  const valueEls = [viscosityEl, polytropicIndexEl, stateConstantEl, gravityXEl, gravityYEl];
  (0, canvas_1.addCanvas)(ecs, canvas);
  const cellHash = (0, cellhash_1.addCellHash)(ecs);
  (0, component_1.addComponent)(ecs, cellHash, cellhashMovement_1.CellHashDimensions, { width: 2 * smoothingLength * simulationScale, height: 2 * smoothingLength * simulationScale });
  const getConfig = () => {
      return {
          viscosity: parseInt(viscosityEl.value),
          polytropicIndex: parseInt(polytropicIndexEl.value),
          stateConstant: parseInt(stateConstantEl.value),
          gravity: { x: parseInt(gravityXEl.value), y: parseInt(gravityYEl.value) },
          smoothingLength: smoothingLength,
          simulationScale: simulationScale,
      };
  };
  const updateConfig = () => {
      console.log('updating config!');
      (0, component_1.addGlobalComponent)(ecs, gas_1.GasConfig, getConfig());
  };
  updateConfig();
  valueEls.forEach(el => el.addEventListener('change', () => updateConfig()));
  (0, component_1.addGlobalComponent)(ecs, bounds_1.Bounds, { left: 0, right: canvas.width, bottom: 0, top: canvas.height });
  (0, component_1.addGlobalComponent)(ecs, bounds_1.BoundsBounceCoef, 0.3);
  const molecules = [];
  const createMolecule = (pos) => {
      const molecule = (0, entity_1.Entity)(ecs);
      molecules.push(molecule);
      const opts = {
          radius: 10,
          mass: 1,
          color: 'rgba(50, 50, 255, 0.8)'
      };
      (0, cellhash_1.addToCellHash)(ecs, cellHash, molecule);
      (0, component_1.addComponent)(ecs, molecule, movement_2.Position, pos);
      (0, component_1.addComponent)(ecs, molecule, movement_2.Velocity, { x: 0, y: 0 });
      (0, component_1.addComponent)(ecs, molecule, movement_1.Acceleration, { x: 0, y: 0 });
      (0, component_1.addComponent)(ecs, molecule, bounds_1.BoundsHitbox, { left: -opts.radius, right: opts.radius, bottom: -opts.radius, top: opts.radius });
      (0, component_1.addComponent)(ecs, molecule, gas_1.IsGas, true);
      (0, component_1.addComponent)(ecs, molecule, gas_1.MoleculeMass, opts.mass);
      (0, component_1.addComponent)(ecs, molecule, canvasCircles_1.Radius, opts.radius);
      const clr = () => Math.floor(Math.random() * 255);
      (0, component_1.addComponent)(ecs, molecule, canvasCircles_1.FillStyle, opts.color);
  };
  const createWallMolecule = (pos) => {
      const molecule = (0, entity_1.Entity)(ecs);
      (0, cellhash_1.addToCellHash)(ecs, cellHash, molecule);
      (0, component_1.addComponent)(ecs, molecule, movement_2.Position, pos);
      (0, component_1.addComponent)(ecs, molecule, gas_1.IsGas, true);
      (0, component_1.addComponent)(ecs, molecule, gas_1.MoleculeMass, 5);
      (0, component_1.addComponent)(ecs, molecule, movement_1.Static, true);
  };
  for (let x = 0; x < canvas.width; x += 5) {
      createWallMolecule({ x, y: 0 });
      createWallMolecule({ x, y: canvas.height });
  }
  for (let y = 0; y < canvas.height; y += 5) {
      createWallMolecule({ x: 0, y });
      createWallMolecule({ x: canvas.width, y });
  }
  const generate = () => {
      let totalX = 25;
      let totalY = 25;
      let spacing = 20;
      let offset = { x: (canvas.width / 2) - (totalX * spacing * 0.5), y: (canvas.height / 2) - (totalY * spacing * 0.5) };
      for (let x = 0; x < totalX; x++) {
          for (let y = 0; y < totalY; y++) {
              createMolecule({ x: offset.x + (spacing * x), y: offset.y + (spacing * y) });
          }
      }
  };
  generate();
  document.getElementById("reset-button").addEventListener('click', () => {
      for (let molecule of molecules) {
          (0, cellhash_1.removeFromCellHash)(ecs, cellHash, molecule);
          (0, entity_1.deleteEntity)(ecs, molecule);
      }
      molecules.splice(0, molecules.length);
      generate();
  });
  setInterval(() => (0, lifetime_1.LifetimeLoop)(ecs), 10);
  
  })();
  
  /******/ })
  ;
  //# sourceMappingURL=main.bundle.js.map