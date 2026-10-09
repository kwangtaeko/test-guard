#!/usr/bin/env node
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/picocolors@1.1.1/node_modules/picocolors/picocolors.js
var require_picocolors = __commonJS({
  "node_modules/.pnpm/picocolors@1.1.1/node_modules/picocolors/picocolors.js"(exports, module) {
    "use strict";
    var p = process || {};
    var argv = p.argv || [];
    var env = p.env || {};
    var isColorSupported = !(!!env.NO_COLOR || argv.includes("--no-color")) && (!!env.FORCE_COLOR || argv.includes("--color") || p.platform === "win32" || (p.stdout || {}).isTTY && env.TERM !== "dumb" || !!env.CI);
    var formatter = (open, close, replace = open) => (input) => {
      let string = "" + input, index = string.indexOf(close, open.length);
      return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
    };
    var replaceClose = (string, close, replace, index) => {
      let result = "", cursor = 0;
      do {
        result += string.substring(cursor, index) + replace;
        cursor = index + close.length;
        index = string.indexOf(close, cursor);
      } while (~index);
      return result + string.substring(cursor);
    };
    var createColors2 = (enabled = isColorSupported) => {
      let f = enabled ? formatter : () => String;
      return {
        isColorSupported: enabled,
        reset: f("\x1B[0m", "\x1B[0m"),
        bold: f("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
        dim: f("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
        italic: f("\x1B[3m", "\x1B[23m"),
        underline: f("\x1B[4m", "\x1B[24m"),
        inverse: f("\x1B[7m", "\x1B[27m"),
        hidden: f("\x1B[8m", "\x1B[28m"),
        strikethrough: f("\x1B[9m", "\x1B[29m"),
        black: f("\x1B[30m", "\x1B[39m"),
        red: f("\x1B[31m", "\x1B[39m"),
        green: f("\x1B[32m", "\x1B[39m"),
        yellow: f("\x1B[33m", "\x1B[39m"),
        blue: f("\x1B[34m", "\x1B[39m"),
        magenta: f("\x1B[35m", "\x1B[39m"),
        cyan: f("\x1B[36m", "\x1B[39m"),
        white: f("\x1B[37m", "\x1B[39m"),
        gray: f("\x1B[90m", "\x1B[39m"),
        bgBlack: f("\x1B[40m", "\x1B[49m"),
        bgRed: f("\x1B[41m", "\x1B[49m"),
        bgGreen: f("\x1B[42m", "\x1B[49m"),
        bgYellow: f("\x1B[43m", "\x1B[49m"),
        bgBlue: f("\x1B[44m", "\x1B[49m"),
        bgMagenta: f("\x1B[45m", "\x1B[49m"),
        bgCyan: f("\x1B[46m", "\x1B[49m"),
        bgWhite: f("\x1B[47m", "\x1B[49m"),
        blackBright: f("\x1B[90m", "\x1B[39m"),
        redBright: f("\x1B[91m", "\x1B[39m"),
        greenBright: f("\x1B[92m", "\x1B[39m"),
        yellowBright: f("\x1B[93m", "\x1B[39m"),
        blueBright: f("\x1B[94m", "\x1B[39m"),
        magentaBright: f("\x1B[95m", "\x1B[39m"),
        cyanBright: f("\x1B[96m", "\x1B[39m"),
        whiteBright: f("\x1B[97m", "\x1B[39m"),
        bgBlackBright: f("\x1B[100m", "\x1B[49m"),
        bgRedBright: f("\x1B[101m", "\x1B[49m"),
        bgGreenBright: f("\x1B[102m", "\x1B[49m"),
        bgYellowBright: f("\x1B[103m", "\x1B[49m"),
        bgBlueBright: f("\x1B[104m", "\x1B[49m"),
        bgMagentaBright: f("\x1B[105m", "\x1B[49m"),
        bgCyanBright: f("\x1B[106m", "\x1B[49m"),
        bgWhiteBright: f("\x1B[107m", "\x1B[49m")
      };
    };
    module.exports = createColors2();
    module.exports.createColors = createColors2;
  }
});

// node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/error.js
var require_error = __commonJS({
  "node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/error.js"(exports) {
    "use strict";
    var CommanderError2 = class extends Error {
      /**
       * Constructs the CommanderError class
       * @param {number} exitCode suggested exit code which could be used with process.exit
       * @param {string} code an id string representing the error
       * @param {string} message human-readable description of the error
       */
      constructor(exitCode, code, message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.code = code;
        this.exitCode = exitCode;
        this.nestedError = void 0;
      }
    };
    var InvalidArgumentError2 = class extends CommanderError2 {
      /**
       * Constructs the InvalidArgumentError class
       * @param {string} [message] explanation of why argument is invalid
       */
      constructor(message) {
        super(1, "commander.invalidArgument", message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
      }
    };
    exports.CommanderError = CommanderError2;
    exports.InvalidArgumentError = InvalidArgumentError2;
  }
});

// node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/argument.js
var require_argument = __commonJS({
  "node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/argument.js"(exports) {
    "use strict";
    var { InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var Argument2 = class {
      /**
       * Initialize a new command argument with the given name and description.
       * The default is that the argument is required, and you can explicitly
       * indicate this with <> around the name. Put [] around the name for an optional argument.
       *
       * @param {string} name
       * @param {string} [description]
       */
      constructor(name, description) {
        this.description = description || "";
        this.variadic = false;
        this.parseArg = void 0;
        this.defaultValue = void 0;
        this.defaultValueDescription = void 0;
        this.argChoices = void 0;
        switch (name[0]) {
          case "<":
            this.required = true;
            this._name = name.slice(1, -1);
            break;
          case "[":
            this.required = false;
            this._name = name.slice(1, -1);
            break;
          default:
            this.required = true;
            this._name = name;
            break;
        }
        if (this._name.endsWith("...")) {
          this.variadic = true;
          this._name = this._name.slice(0, -3);
        }
      }
      /**
       * Return argument name.
       *
       * @return {string}
       */
      name() {
        return this._name;
      }
      /**
       * @package
       */
      _collectValue(value, previous) {
        if (previous === this.defaultValue || !Array.isArray(previous)) {
          return [value];
        }
        previous.push(value);
        return previous;
      }
      /**
       * Set the default value, and optionally supply the description to be displayed in the help.
       *
       * @param {*} value
       * @param {string} [description]
       * @return {Argument}
       */
      default(value, description) {
        this.defaultValue = value;
        this.defaultValueDescription = description;
        return this;
      }
      /**
       * Set the custom handler for processing CLI command arguments into argument values.
       *
       * @param {Function} [fn]
       * @return {Argument}
       */
      argParser(fn) {
        this.parseArg = fn;
        return this;
      }
      /**
       * Only allow argument value to be one of choices.
       *
       * @param {string[]} values
       * @return {Argument}
       */
      choices(values) {
        this.argChoices = values.slice();
        this.parseArg = (arg, previous) => {
          if (!this.argChoices.includes(arg)) {
            throw new InvalidArgumentError2(
              `Allowed choices are ${this.argChoices.join(", ")}.`
            );
          }
          if (this.variadic) {
            return this._collectValue(arg, previous);
          }
          return arg;
        };
        return this;
      }
      /**
       * Make argument required.
       *
       * @returns {Argument}
       */
      argRequired() {
        this.required = true;
        return this;
      }
      /**
       * Make argument optional.
       *
       * @returns {Argument}
       */
      argOptional() {
        this.required = false;
        return this;
      }
    };
    function humanReadableArgName(arg) {
      const nameOutput = arg.name() + (arg.variadic === true ? "..." : "");
      return arg.required ? "<" + nameOutput + ">" : "[" + nameOutput + "]";
    }
    exports.Argument = Argument2;
    exports.humanReadableArgName = humanReadableArgName;
  }
});

// node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/help.js
var require_help = __commonJS({
  "node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/help.js"(exports) {
    "use strict";
    var { humanReadableArgName } = require_argument();
    var Help2 = class {
      constructor() {
        this.helpWidth = void 0;
        this.minWidthToWrap = 40;
        this.sortSubcommands = false;
        this.sortOptions = false;
        this.showGlobalOptions = false;
      }
      /**
       * prepareContext is called by Commander after applying overrides from `Command.configureHelp()`
       * and just before calling `formatHelp()`.
       *
       * Commander just uses the helpWidth and the rest is provided for optional use by more complex subclasses.
       *
       * @param {{ error?: boolean, helpWidth?: number, outputHasColors?: boolean }} contextOptions
       */
      prepareContext(contextOptions) {
        this.helpWidth = this.helpWidth ?? contextOptions.helpWidth ?? 80;
      }
      /**
       * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
       *
       * @param {Command} cmd
       * @returns {Command[]}
       */
      visibleCommands(cmd) {
        const visibleCommands = cmd.commands.filter((cmd2) => !cmd2._hidden);
        const helpCommand = cmd._getHelpCommand();
        if (helpCommand && !helpCommand._hidden) {
          visibleCommands.push(helpCommand);
        }
        if (this.sortSubcommands) {
          visibleCommands.sort((a, b) => {
            return a.name().localeCompare(b.name());
          });
        }
        return visibleCommands;
      }
      /**
       * Compare options for sort.
       *
       * @param {Option} a
       * @param {Option} b
       * @returns {number}
       */
      compareOptions(a, b) {
        const getSortKey = (option) => {
          return option.short ? option.short.replace(/^-/, "") : option.long.replace(/^--/, "");
        };
        return getSortKey(a).localeCompare(getSortKey(b));
      }
      /**
       * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
       *
       * @param {Command} cmd
       * @returns {Option[]}
       */
      visibleOptions(cmd) {
        const visibleOptions = cmd.options.filter((option) => !option.hidden);
        const helpOption = cmd._getHelpOption();
        if (helpOption && !helpOption.hidden) {
          const removeShort = helpOption.short && cmd._findOption(helpOption.short);
          const removeLong = helpOption.long && cmd._findOption(helpOption.long);
          if (!removeShort && !removeLong) {
            visibleOptions.push(helpOption);
          } else if (helpOption.long && !removeLong) {
            visibleOptions.push(
              cmd.createOption(helpOption.long, helpOption.description)
            );
          } else if (helpOption.short && !removeShort) {
            visibleOptions.push(
              cmd.createOption(helpOption.short, helpOption.description)
            );
          }
        }
        if (this.sortOptions) {
          visibleOptions.sort(this.compareOptions);
        }
        return visibleOptions;
      }
      /**
       * Get an array of the visible global options. (Not including help.)
       *
       * @param {Command} cmd
       * @returns {Option[]}
       */
      visibleGlobalOptions(cmd) {
        if (!this.showGlobalOptions) return [];
        const globalOptions = [];
        for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
          const visibleOptions = ancestorCmd.options.filter(
            (option) => !option.hidden
          );
          globalOptions.push(...visibleOptions);
        }
        if (this.sortOptions) {
          globalOptions.sort(this.compareOptions);
        }
        return globalOptions;
      }
      /**
       * Get an array of the arguments if any have a description.
       *
       * @param {Command} cmd
       * @returns {Argument[]}
       */
      visibleArguments(cmd) {
        if (cmd._argsDescription) {
          cmd.registeredArguments.forEach((argument) => {
            argument.description = argument.description || cmd._argsDescription[argument.name()] || "";
          });
        }
        if (cmd.registeredArguments.find((argument) => argument.description)) {
          return cmd.registeredArguments;
        }
        return [];
      }
      /**
       * Get the command term to show in the list of subcommands.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      subcommandTerm(cmd) {
        const args = cmd.registeredArguments.map((arg) => humanReadableArgName(arg)).join(" ");
        return cmd._name + (cmd._aliases[0] ? "|" + cmd._aliases[0] : "") + (cmd.options.length ? " [options]" : "") + // simplistic check for non-help option
        (args ? " " + args : "");
      }
      /**
       * Get the option term to show in the list of options.
       *
       * @param {Option} option
       * @returns {string}
       */
      optionTerm(option) {
        return option.flags;
      }
      /**
       * Get the argument term to show in the list of arguments.
       *
       * @param {Argument} argument
       * @returns {string}
       */
      argumentTerm(argument) {
        return argument.name();
      }
      /**
       * Get the longest command term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestSubcommandTermLength(cmd, helper) {
        return helper.visibleCommands(cmd).reduce((max, command) => {
          return Math.max(
            max,
            this.displayWidth(
              helper.styleSubcommandTerm(helper.subcommandTerm(command))
            )
          );
        }, 0);
      }
      /**
       * Get the longest option term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestOptionTermLength(cmd, helper) {
        return helper.visibleOptions(cmd).reduce((max, option) => {
          return Math.max(
            max,
            this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option)))
          );
        }, 0);
      }
      /**
       * Get the longest global option term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestGlobalOptionTermLength(cmd, helper) {
        return helper.visibleGlobalOptions(cmd).reduce((max, option) => {
          return Math.max(
            max,
            this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option)))
          );
        }, 0);
      }
      /**
       * Get the longest argument term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestArgumentTermLength(cmd, helper) {
        return helper.visibleArguments(cmd).reduce((max, argument) => {
          return Math.max(
            max,
            this.displayWidth(
              helper.styleArgumentTerm(helper.argumentTerm(argument))
            )
          );
        }, 0);
      }
      /**
       * Get the command usage to be displayed at the top of the built-in help.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      commandUsage(cmd) {
        let cmdName = cmd._name;
        if (cmd._aliases[0]) {
          cmdName = cmdName + "|" + cmd._aliases[0];
        }
        let ancestorCmdNames = "";
        for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
          ancestorCmdNames = ancestorCmd.name() + " " + ancestorCmdNames;
        }
        return ancestorCmdNames + cmdName + " " + cmd.usage();
      }
      /**
       * Get the description for the command.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      commandDescription(cmd) {
        return cmd.description();
      }
      /**
       * Get the subcommand summary to show in the list of subcommands.
       * (Fallback to description for backwards compatibility.)
       *
       * @param {Command} cmd
       * @returns {string}
       */
      subcommandDescription(cmd) {
        return cmd.summary() || cmd.description();
      }
      /**
       * Get the option description to show in the list of options.
       *
       * @param {Option} option
       * @return {string}
       */
      optionDescription(option) {
        const extraInfo = [];
        if (option.argChoices) {
          extraInfo.push(
            // use stringify to match the display of the default value
            `choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`
          );
        }
        if (option.defaultValue !== void 0) {
          const showDefault = option.required || option.optional || option.isBoolean() && typeof option.defaultValue === "boolean";
          if (showDefault) {
            extraInfo.push(
              `default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`
            );
          }
        }
        if (option.presetArg !== void 0 && option.optional) {
          extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
        }
        if (option.envVar !== void 0) {
          extraInfo.push(`env: ${option.envVar}`);
        }
        if (extraInfo.length > 0) {
          const extraDescription = `(${extraInfo.join(", ")})`;
          if (option.description) {
            return `${option.description} ${extraDescription}`;
          }
          return extraDescription;
        }
        return option.description;
      }
      /**
       * Get the argument description to show in the list of arguments.
       *
       * @param {Argument} argument
       * @return {string}
       */
      argumentDescription(argument) {
        const extraInfo = [];
        if (argument.argChoices) {
          extraInfo.push(
            // use stringify to match the display of the default value
            `choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`
          );
        }
        if (argument.defaultValue !== void 0) {
          extraInfo.push(
            `default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`
          );
        }
        if (extraInfo.length > 0) {
          const extraDescription = `(${extraInfo.join(", ")})`;
          if (argument.description) {
            return `${argument.description} ${extraDescription}`;
          }
          return extraDescription;
        }
        return argument.description;
      }
      /**
       * Format a list of items, given a heading and an array of formatted items.
       *
       * @param {string} heading
       * @param {string[]} items
       * @param {Help} helper
       * @returns string[]
       */
      formatItemList(heading, items, helper) {
        if (items.length === 0) return [];
        return [helper.styleTitle(heading), ...items, ""];
      }
      /**
       * Group items by their help group heading.
       *
       * @param {Command[] | Option[]} unsortedItems
       * @param {Command[] | Option[]} visibleItems
       * @param {Function} getGroup
       * @returns {Map<string, Command[] | Option[]>}
       */
      groupItems(unsortedItems, visibleItems, getGroup) {
        const result = /* @__PURE__ */ new Map();
        unsortedItems.forEach((item) => {
          const group = getGroup(item);
          if (!result.has(group)) result.set(group, []);
        });
        visibleItems.forEach((item) => {
          const group = getGroup(item);
          if (!result.has(group)) {
            result.set(group, []);
          }
          result.get(group).push(item);
        });
        return result;
      }
      /**
       * Generate the built-in help text.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {string}
       */
      formatHelp(cmd, helper) {
        const termWidth = helper.padWidth(cmd, helper);
        const helpWidth = helper.helpWidth ?? 80;
        function callFormatItem(term, description) {
          return helper.formatItem(term, termWidth, description, helper);
        }
        let output = [
          `${helper.styleTitle("Usage:")} ${helper.styleUsage(helper.commandUsage(cmd))}`,
          ""
        ];
        const commandDescription = helper.commandDescription(cmd);
        if (commandDescription.length > 0) {
          output = output.concat([
            helper.boxWrap(
              helper.styleCommandDescription(commandDescription),
              helpWidth
            ),
            ""
          ]);
        }
        const argumentList = helper.visibleArguments(cmd).map((argument) => {
          return callFormatItem(
            helper.styleArgumentTerm(helper.argumentTerm(argument)),
            helper.styleArgumentDescription(helper.argumentDescription(argument))
          );
        });
        output = output.concat(
          this.formatItemList("Arguments:", argumentList, helper)
        );
        const optionGroups = this.groupItems(
          cmd.options,
          helper.visibleOptions(cmd),
          (option) => option.helpGroupHeading ?? "Options:"
        );
        optionGroups.forEach((options, group) => {
          const optionList = options.map((option) => {
            return callFormatItem(
              helper.styleOptionTerm(helper.optionTerm(option)),
              helper.styleOptionDescription(helper.optionDescription(option))
            );
          });
          output = output.concat(this.formatItemList(group, optionList, helper));
        });
        if (helper.showGlobalOptions) {
          const globalOptionList = helper.visibleGlobalOptions(cmd).map((option) => {
            return callFormatItem(
              helper.styleOptionTerm(helper.optionTerm(option)),
              helper.styleOptionDescription(helper.optionDescription(option))
            );
          });
          output = output.concat(
            this.formatItemList("Global Options:", globalOptionList, helper)
          );
        }
        const commandGroups = this.groupItems(
          cmd.commands,
          helper.visibleCommands(cmd),
          (sub) => sub.helpGroup() || "Commands:"
        );
        commandGroups.forEach((commands, group) => {
          const commandList = commands.map((sub) => {
            return callFormatItem(
              helper.styleSubcommandTerm(helper.subcommandTerm(sub)),
              helper.styleSubcommandDescription(helper.subcommandDescription(sub))
            );
          });
          output = output.concat(this.formatItemList(group, commandList, helper));
        });
        return output.join("\n");
      }
      /**
       * Return display width of string, ignoring ANSI escape sequences. Used in padding and wrapping calculations.
       *
       * @param {string} str
       * @returns {number}
       */
      displayWidth(str) {
        return stripColor(str).length;
      }
      /**
       * Style the title for displaying in the help. Called with 'Usage:', 'Options:', etc.
       *
       * @param {string} str
       * @returns {string}
       */
      styleTitle(str) {
        return str;
      }
      styleUsage(str) {
        return str.split(" ").map((word2) => {
          if (word2 === "[options]") return this.styleOptionText(word2);
          if (word2 === "[command]") return this.styleSubcommandText(word2);
          if (word2[0] === "[" || word2[0] === "<")
            return this.styleArgumentText(word2);
          return this.styleCommandText(word2);
        }).join(" ");
      }
      styleCommandDescription(str) {
        return this.styleDescriptionText(str);
      }
      styleOptionDescription(str) {
        return this.styleDescriptionText(str);
      }
      styleSubcommandDescription(str) {
        return this.styleDescriptionText(str);
      }
      styleArgumentDescription(str) {
        return this.styleDescriptionText(str);
      }
      styleDescriptionText(str) {
        return str;
      }
      styleOptionTerm(str) {
        return this.styleOptionText(str);
      }
      styleSubcommandTerm(str) {
        return str.split(" ").map((word2) => {
          if (word2 === "[options]") return this.styleOptionText(word2);
          if (word2[0] === "[" || word2[0] === "<")
            return this.styleArgumentText(word2);
          return this.styleSubcommandText(word2);
        }).join(" ");
      }
      styleArgumentTerm(str) {
        return this.styleArgumentText(str);
      }
      styleOptionText(str) {
        return str;
      }
      styleArgumentText(str) {
        return str;
      }
      styleSubcommandText(str) {
        return str;
      }
      styleCommandText(str) {
        return str;
      }
      /**
       * Calculate the pad width from the maximum term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      padWidth(cmd, helper) {
        return Math.max(
          helper.longestOptionTermLength(cmd, helper),
          helper.longestGlobalOptionTermLength(cmd, helper),
          helper.longestSubcommandTermLength(cmd, helper),
          helper.longestArgumentTermLength(cmd, helper)
        );
      }
      /**
       * Detect manually wrapped and indented strings by checking for line break followed by whitespace.
       *
       * @param {string} str
       * @returns {boolean}
       */
      preformatted(str) {
        return /\n[^\S\r\n]/.test(str);
      }
      /**
       * Format the "item", which consists of a term and description. Pad the term and wrap the description, indenting the following lines.
       *
       * So "TTT", 5, "DDD DDDD DD DDD" might be formatted for this.helpWidth=17 like so:
       *   TTT  DDD DDDD
       *        DD DDD
       *
       * @param {string} term
       * @param {number} termWidth
       * @param {string} description
       * @param {Help} helper
       * @returns {string}
       */
      formatItem(term, termWidth, description, helper) {
        const itemIndent = 2;
        const itemIndentStr = " ".repeat(itemIndent);
        if (!description) return itemIndentStr + term;
        const paddedTerm = term.padEnd(
          termWidth + term.length - helper.displayWidth(term)
        );
        const spacerWidth = 2;
        const helpWidth = this.helpWidth ?? 80;
        const remainingWidth = helpWidth - termWidth - spacerWidth - itemIndent;
        let formattedDescription;
        if (remainingWidth < this.minWidthToWrap || helper.preformatted(description)) {
          formattedDescription = description;
        } else {
          const wrappedDescription = helper.boxWrap(description, remainingWidth);
          formattedDescription = wrappedDescription.replace(
            /\n/g,
            "\n" + " ".repeat(termWidth + spacerWidth)
          );
        }
        return itemIndentStr + paddedTerm + " ".repeat(spacerWidth) + formattedDescription.replace(/\n/g, `
${itemIndentStr}`);
      }
      /**
       * Wrap a string at whitespace, preserving existing line breaks.
       * Wrapping is skipped if the width is less than `minWidthToWrap`.
       *
       * @param {string} str
       * @param {number} width
       * @returns {string}
       */
      boxWrap(str, width) {
        if (width < this.minWidthToWrap) return str;
        const rawLines = str.split(/\r\n|\n/);
        const chunkPattern = /[\s]*[^\s]+/g;
        const wrappedLines = [];
        rawLines.forEach((line) => {
          const chunks = line.match(chunkPattern);
          if (chunks === null) {
            wrappedLines.push("");
            return;
          }
          let sumChunks = [chunks.shift()];
          let sumWidth = this.displayWidth(sumChunks[0]);
          chunks.forEach((chunk) => {
            const visibleWidth = this.displayWidth(chunk);
            if (sumWidth + visibleWidth <= width) {
              sumChunks.push(chunk);
              sumWidth += visibleWidth;
              return;
            }
            wrappedLines.push(sumChunks.join(""));
            const nextChunk = chunk.trimStart();
            sumChunks = [nextChunk];
            sumWidth = this.displayWidth(nextChunk);
          });
          wrappedLines.push(sumChunks.join(""));
        });
        return wrappedLines.join("\n");
      }
    };
    function stripColor(str) {
      const sgrPattern = /\x1b\[\d*(;\d*)*m/g;
      return str.replace(sgrPattern, "");
    }
    exports.Help = Help2;
    exports.stripColor = stripColor;
  }
});

// node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/option.js
var require_option = __commonJS({
  "node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/option.js"(exports) {
    "use strict";
    var { InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var Option2 = class {
      /**
       * Initialize a new `Option` with the given `flags` and `description`.
       *
       * @param {string} flags
       * @param {string} [description]
       */
      constructor(flags, description) {
        this.flags = flags;
        this.description = description || "";
        this.required = flags.includes("<");
        this.optional = flags.includes("[");
        this.variadic = /\w\.\.\.[>\]]$/.test(flags);
        this.mandatory = false;
        const optionFlags = splitOptionFlags(flags);
        this.short = optionFlags.shortFlag;
        this.long = optionFlags.longFlag;
        this.negate = false;
        if (this.long) {
          this.negate = this.long.startsWith("--no-");
        }
        this.defaultValue = void 0;
        this.defaultValueDescription = void 0;
        this.presetArg = void 0;
        this.envVar = void 0;
        this.parseArg = void 0;
        this.hidden = false;
        this.argChoices = void 0;
        this.conflictsWith = [];
        this.implied = void 0;
        this.helpGroupHeading = void 0;
      }
      /**
       * Set the default value, and optionally supply the description to be displayed in the help.
       *
       * @param {*} value
       * @param {string} [description]
       * @return {Option}
       */
      default(value, description) {
        this.defaultValue = value;
        this.defaultValueDescription = description;
        return this;
      }
      /**
       * Preset to use when option used without option-argument, especially optional but also boolean and negated.
       * The custom processing (parseArg) is called.
       *
       * @example
       * new Option('--color').default('GREYSCALE').preset('RGB');
       * new Option('--donate [amount]').preset('20').argParser(parseFloat);
       *
       * @param {*} arg
       * @return {Option}
       */
      preset(arg) {
        this.presetArg = arg;
        return this;
      }
      /**
       * Add option name(s) that conflict with this option.
       * An error will be displayed if conflicting options are found during parsing.
       *
       * @example
       * new Option('--rgb').conflicts('cmyk');
       * new Option('--js').conflicts(['ts', 'jsx']);
       *
       * @param {(string | string[])} names
       * @return {Option}
       */
      conflicts(names) {
        this.conflictsWith = this.conflictsWith.concat(names);
        return this;
      }
      /**
       * Specify implied option values for when this option is set and the implied options are not.
       *
       * The custom processing (parseArg) is not called on the implied values.
       *
       * @example
       * program
       *   .addOption(new Option('--log', 'write logging information to file'))
       *   .addOption(new Option('--trace', 'log extra details').implies({ log: 'trace.txt' }));
       *
       * @param {object} impliedOptionValues
       * @return {Option}
       */
      implies(impliedOptionValues) {
        let newImplied = impliedOptionValues;
        if (typeof impliedOptionValues === "string") {
          newImplied = { [impliedOptionValues]: true };
        }
        this.implied = Object.assign(this.implied || {}, newImplied);
        return this;
      }
      /**
       * Set environment variable to check for option value.
       *
       * An environment variable is only used if when processed the current option value is
       * undefined, or the source of the current value is 'default' or 'config' or 'env'.
       *
       * @param {string} name
       * @return {Option}
       */
      env(name) {
        this.envVar = name;
        return this;
      }
      /**
       * Set the custom handler for processing CLI option arguments into option values.
       *
       * @param {Function} [fn]
       * @return {Option}
       */
      argParser(fn) {
        this.parseArg = fn;
        return this;
      }
      /**
       * Whether the option is mandatory and must have a value after parsing.
       *
       * @param {boolean} [mandatory=true]
       * @return {Option}
       */
      makeOptionMandatory(mandatory = true) {
        this.mandatory = !!mandatory;
        return this;
      }
      /**
       * Hide option in help.
       *
       * @param {boolean} [hide=true]
       * @return {Option}
       */
      hideHelp(hide = true) {
        this.hidden = !!hide;
        return this;
      }
      /**
       * @package
       */
      _collectValue(value, previous) {
        if (previous === this.defaultValue || !Array.isArray(previous)) {
          return [value];
        }
        previous.push(value);
        return previous;
      }
      /**
       * Only allow option value to be one of choices.
       *
       * @param {string[]} values
       * @return {Option}
       */
      choices(values) {
        this.argChoices = values.slice();
        this.parseArg = (arg, previous) => {
          if (!this.argChoices.includes(arg)) {
            throw new InvalidArgumentError2(
              `Allowed choices are ${this.argChoices.join(", ")}.`
            );
          }
          if (this.variadic) {
            return this._collectValue(arg, previous);
          }
          return arg;
        };
        return this;
      }
      /**
       * Return option name.
       *
       * @return {string}
       */
      name() {
        if (this.long) {
          return this.long.replace(/^--/, "");
        }
        return this.short.replace(/^-/, "");
      }
      /**
       * Return option name, in a camelcase format that can be used
       * as an object attribute key.
       *
       * @return {string}
       */
      attributeName() {
        if (this.negate) {
          return camelcase(this.name().replace(/^no-/, ""));
        }
        return camelcase(this.name());
      }
      /**
       * Set the help group heading.
       *
       * @param {string} heading
       * @return {Option}
       */
      helpGroup(heading) {
        this.helpGroupHeading = heading;
        return this;
      }
      /**
       * Check if `arg` matches the short or long flag.
       *
       * @param {string} arg
       * @return {boolean}
       * @package
       */
      is(arg) {
        return this.short === arg || this.long === arg;
      }
      /**
       * Return whether a boolean option.
       *
       * Options are one of boolean, negated, required argument, or optional argument.
       *
       * @return {boolean}
       * @package
       */
      isBoolean() {
        return !this.required && !this.optional && !this.negate;
      }
    };
    var DualOptions = class {
      /**
       * @param {Option[]} options
       */
      constructor(options) {
        this.positiveOptions = /* @__PURE__ */ new Map();
        this.negativeOptions = /* @__PURE__ */ new Map();
        this.dualOptions = /* @__PURE__ */ new Set();
        options.forEach((option) => {
          if (option.negate) {
            this.negativeOptions.set(option.attributeName(), option);
          } else {
            this.positiveOptions.set(option.attributeName(), option);
          }
        });
        this.negativeOptions.forEach((value, key) => {
          if (this.positiveOptions.has(key)) {
            this.dualOptions.add(key);
          }
        });
      }
      /**
       * Did the value come from the option, and not from possible matching dual option?
       *
       * @param {*} value
       * @param {Option} option
       * @returns {boolean}
       */
      valueFromOption(value, option) {
        const optionKey = option.attributeName();
        if (!this.dualOptions.has(optionKey)) return true;
        const preset = this.negativeOptions.get(optionKey).presetArg;
        const negativeValue = preset !== void 0 ? preset : false;
        return option.negate === (negativeValue === value);
      }
    };
    function camelcase(str) {
      return str.split("-").reduce((str2, word2) => {
        return str2 + word2[0].toUpperCase() + word2.slice(1);
      });
    }
    function splitOptionFlags(flags) {
      let shortFlag;
      let longFlag;
      const shortFlagExp = /^-[^-]$/;
      const longFlagExp = /^--[^-]/;
      const flagParts = flags.split(/[ |,]+/).concat("guard");
      if (shortFlagExp.test(flagParts[0])) shortFlag = flagParts.shift();
      if (longFlagExp.test(flagParts[0])) longFlag = flagParts.shift();
      if (!shortFlag && shortFlagExp.test(flagParts[0]))
        shortFlag = flagParts.shift();
      if (!shortFlag && longFlagExp.test(flagParts[0])) {
        shortFlag = longFlag;
        longFlag = flagParts.shift();
      }
      if (flagParts[0].startsWith("-")) {
        const unsupportedFlag = flagParts[0];
        const baseError = `option creation failed due to '${unsupportedFlag}' in option flags '${flags}'`;
        if (/^-[^-][^-]/.test(unsupportedFlag))
          throw new Error(
            `${baseError}
- a short flag is a single dash and a single character
  - either use a single dash and a single character (for a short flag)
  - or use a double dash for a long option (and can have two, like '--ws, --workspace')`
          );
        if (shortFlagExp.test(unsupportedFlag))
          throw new Error(`${baseError}
- too many short flags`);
        if (longFlagExp.test(unsupportedFlag))
          throw new Error(`${baseError}
- too many long flags`);
        throw new Error(`${baseError}
- unrecognised flag format`);
      }
      if (shortFlag === void 0 && longFlag === void 0)
        throw new Error(
          `option creation failed due to no flags found in '${flags}'.`
        );
      return { shortFlag, longFlag };
    }
    exports.Option = Option2;
    exports.DualOptions = DualOptions;
  }
});

// node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/suggestSimilar.js
var require_suggestSimilar = __commonJS({
  "node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/suggestSimilar.js"(exports) {
    "use strict";
    var maxDistance = 3;
    function editDistance(a, b) {
      if (Math.abs(a.length - b.length) > maxDistance)
        return Math.max(a.length, b.length);
      const d = [];
      for (let i = 0; i <= a.length; i++) {
        d[i] = [i];
      }
      for (let j = 0; j <= b.length; j++) {
        d[0][j] = j;
      }
      for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
          let cost = 1;
          if (a[i - 1] === b[j - 1]) {
            cost = 0;
          } else {
            cost = 1;
          }
          d[i][j] = Math.min(
            d[i - 1][j] + 1,
            // deletion
            d[i][j - 1] + 1,
            // insertion
            d[i - 1][j - 1] + cost
            // substitution
          );
          if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
            d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
          }
        }
      }
      return d[a.length][b.length];
    }
    function suggestSimilar(word2, candidates2) {
      if (!candidates2 || candidates2.length === 0) return "";
      candidates2 = Array.from(new Set(candidates2));
      const searchingOptions = word2.startsWith("--");
      if (searchingOptions) {
        word2 = word2.slice(2);
        candidates2 = candidates2.map((candidate) => candidate.slice(2));
      }
      let similar = [];
      let bestDistance = maxDistance;
      const minSimilarity = 0.4;
      candidates2.forEach((candidate) => {
        if (candidate.length <= 1) return;
        const distance = editDistance(word2, candidate);
        const length = Math.max(word2.length, candidate.length);
        const similarity = (length - distance) / length;
        if (similarity > minSimilarity) {
          if (distance < bestDistance) {
            bestDistance = distance;
            similar = [candidate];
          } else if (distance === bestDistance) {
            similar.push(candidate);
          }
        }
      });
      similar.sort((a, b) => a.localeCompare(b));
      if (searchingOptions) {
        similar = similar.map((candidate) => `--${candidate}`);
      }
      if (similar.length > 1) {
        return `
(Did you mean one of ${similar.join(", ")}?)`;
      }
      if (similar.length === 1) {
        return `
(Did you mean ${similar[0]}?)`;
      }
      return "";
    }
    exports.suggestSimilar = suggestSimilar;
  }
});

// node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/command.js
var require_command = __commonJS({
  "node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/command.js"(exports) {
    "use strict";
    var EventEmitter = __require("events").EventEmitter;
    var childProcess = __require("child_process");
    var path = __require("path");
    var fs = __require("fs");
    var process2 = __require("process");
    var { Argument: Argument2, humanReadableArgName } = require_argument();
    var { CommanderError: CommanderError2 } = require_error();
    var { Help: Help2, stripColor } = require_help();
    var { Option: Option2, DualOptions } = require_option();
    var { suggestSimilar } = require_suggestSimilar();
    var Command2 = class _Command extends EventEmitter {
      /**
       * Initialize a new `Command`.
       *
       * @param {string} [name]
       */
      constructor(name) {
        super();
        this.commands = [];
        this.options = [];
        this.parent = null;
        this._allowUnknownOption = false;
        this._allowExcessArguments = false;
        this.registeredArguments = [];
        this._args = this.registeredArguments;
        this.args = [];
        this.rawArgs = [];
        this.processedArgs = [];
        this._scriptPath = null;
        this._name = name || "";
        this._optionValues = {};
        this._optionValueSources = {};
        this._storeOptionsAsProperties = false;
        this._actionHandler = null;
        this._executableHandler = false;
        this._executableFile = null;
        this._executableDir = null;
        this._defaultCommandName = null;
        this._exitCallback = null;
        this._aliases = [];
        this._combineFlagAndOptionalValue = true;
        this._description = "";
        this._summary = "";
        this._argsDescription = void 0;
        this._enablePositionalOptions = false;
        this._passThroughOptions = false;
        this._lifeCycleHooks = {};
        this._showHelpAfterError = false;
        this._showSuggestionAfterError = true;
        this._savedState = null;
        this._outputConfiguration = {
          writeOut: (str) => process2.stdout.write(str),
          writeErr: (str) => process2.stderr.write(str),
          outputError: (str, write) => write(str),
          getOutHelpWidth: () => process2.stdout.isTTY ? process2.stdout.columns : void 0,
          getErrHelpWidth: () => process2.stderr.isTTY ? process2.stderr.columns : void 0,
          getOutHasColors: () => useColor() ?? (process2.stdout.isTTY && process2.stdout.hasColors?.()),
          getErrHasColors: () => useColor() ?? (process2.stderr.isTTY && process2.stderr.hasColors?.()),
          stripColor: (str) => stripColor(str)
        };
        this._hidden = false;
        this._helpOption = void 0;
        this._addImplicitHelpCommand = void 0;
        this._helpCommand = void 0;
        this._helpConfiguration = {};
        this._helpGroupHeading = void 0;
        this._defaultCommandGroup = void 0;
        this._defaultOptionGroup = void 0;
      }
      /**
       * Copy settings that are useful to have in common across root command and subcommands.
       *
       * (Used internally when adding a command using `.command()` so subcommands inherit parent settings.)
       *
       * @param {Command} sourceCommand
       * @return {Command} `this` command for chaining
       */
      copyInheritedSettings(sourceCommand) {
        this._outputConfiguration = sourceCommand._outputConfiguration;
        this._helpOption = sourceCommand._helpOption;
        this._helpCommand = sourceCommand._helpCommand;
        this._helpConfiguration = sourceCommand._helpConfiguration;
        this._exitCallback = sourceCommand._exitCallback;
        this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties;
        this._combineFlagAndOptionalValue = sourceCommand._combineFlagAndOptionalValue;
        this._allowExcessArguments = sourceCommand._allowExcessArguments;
        this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
        this._showHelpAfterError = sourceCommand._showHelpAfterError;
        this._showSuggestionAfterError = sourceCommand._showSuggestionAfterError;
        return this;
      }
      /**
       * @returns {Command[]}
       * @private
       */
      _getCommandAndAncestors() {
        const result = [];
        for (let command = this; command; command = command.parent) {
          result.push(command);
        }
        return result;
      }
      /**
       * Define a command.
       *
       * There are two styles of command: pay attention to where to put the description.
       *
       * @example
       * // Command implemented using action handler (description is supplied separately to `.command`)
       * program
       *   .command('clone <source> [destination]')
       *   .description('clone a repository into a newly created directory')
       *   .action((source, destination) => {
       *     console.log('clone command called');
       *   });
       *
       * // Command implemented using separate executable file (description is second parameter to `.command`)
       * program
       *   .command('start <service>', 'start named service')
       *   .command('stop [service]', 'stop named service, or all if no name supplied');
       *
       * @param {string} nameAndArgs - command name and arguments, args are `<required>` or `[optional]` and last may also be `variadic...`
       * @param {(object | string)} [actionOptsOrExecDesc] - configuration options (for action), or description (for executable)
       * @param {object} [execOpts] - configuration options (for executable)
       * @return {Command} returns new command for action handler, or `this` for executable command
       */
      command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
        let desc = actionOptsOrExecDesc;
        let opts = execOpts;
        if (typeof desc === "object" && desc !== null) {
          opts = desc;
          desc = null;
        }
        opts = opts || {};
        const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);
        const cmd = this.createCommand(name);
        if (desc) {
          cmd.description(desc);
          cmd._executableHandler = true;
        }
        if (opts.isDefault) this._defaultCommandName = cmd._name;
        cmd._hidden = !!(opts.noHelp || opts.hidden);
        cmd._executableFile = opts.executableFile || null;
        if (args) cmd.arguments(args);
        this._registerCommand(cmd);
        cmd.parent = this;
        cmd.copyInheritedSettings(this);
        if (desc) return this;
        return cmd;
      }
      /**
       * Factory routine to create a new unattached command.
       *
       * See .command() for creating an attached subcommand, which uses this routine to
       * create the command. You can override createCommand to customise subcommands.
       *
       * @param {string} [name]
       * @return {Command} new command
       */
      createCommand(name) {
        return new _Command(name);
      }
      /**
       * You can customise the help with a subclass of Help by overriding createHelp,
       * or by overriding Help properties using configureHelp().
       *
       * @return {Help}
       */
      createHelp() {
        return Object.assign(new Help2(), this.configureHelp());
      }
      /**
       * You can customise the help by overriding Help properties using configureHelp(),
       * or with a subclass of Help by overriding createHelp().
       *
       * @param {object} [configuration] - configuration options
       * @return {(Command | object)} `this` command for chaining, or stored configuration
       */
      configureHelp(configuration) {
        if (configuration === void 0) return this._helpConfiguration;
        this._helpConfiguration = configuration;
        return this;
      }
      /**
       * The default output goes to stdout and stderr. You can customise this for special
       * applications. You can also customise the display of errors by overriding outputError.
       *
       * The configuration properties are all functions:
       *
       *     // change how output being written, defaults to stdout and stderr
       *     writeOut(str)
       *     writeErr(str)
       *     // change how output being written for errors, defaults to writeErr
       *     outputError(str, write) // used for displaying errors and not used for displaying help
       *     // specify width for wrapping help
       *     getOutHelpWidth()
       *     getErrHelpWidth()
       *     // color support, currently only used with Help
       *     getOutHasColors()
       *     getErrHasColors()
       *     stripColor() // used to remove ANSI escape codes if output does not have colors
       *
       * @param {object} [configuration] - configuration options
       * @return {(Command | object)} `this` command for chaining, or stored configuration
       */
      configureOutput(configuration) {
        if (configuration === void 0) return this._outputConfiguration;
        this._outputConfiguration = {
          ...this._outputConfiguration,
          ...configuration
        };
        return this;
      }
      /**
       * Display the help or a custom message after an error occurs.
       *
       * @param {(boolean|string)} [displayHelp]
       * @return {Command} `this` command for chaining
       */
      showHelpAfterError(displayHelp = true) {
        if (typeof displayHelp !== "string") displayHelp = !!displayHelp;
        this._showHelpAfterError = displayHelp;
        return this;
      }
      /**
       * Display suggestion of similar commands for unknown commands, or options for unknown options.
       *
       * @param {boolean} [displaySuggestion]
       * @return {Command} `this` command for chaining
       */
      showSuggestionAfterError(displaySuggestion = true) {
        this._showSuggestionAfterError = !!displaySuggestion;
        return this;
      }
      /**
       * Add a prepared subcommand.
       *
       * See .command() for creating an attached subcommand which inherits settings from its parent.
       *
       * @param {Command} cmd - new subcommand
       * @param {object} [opts] - configuration options
       * @return {Command} `this` command for chaining
       */
      addCommand(cmd, opts) {
        if (!cmd._name) {
          throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
        }
        opts = opts || {};
        if (opts.isDefault) this._defaultCommandName = cmd._name;
        if (opts.noHelp || opts.hidden) cmd._hidden = true;
        this._registerCommand(cmd);
        cmd.parent = this;
        cmd._checkForBrokenPassThrough();
        return this;
      }
      /**
       * Factory routine to create a new unattached argument.
       *
       * See .argument() for creating an attached argument, which uses this routine to
       * create the argument. You can override createArgument to return a custom argument.
       *
       * @param {string} name
       * @param {string} [description]
       * @return {Argument} new argument
       */
      createArgument(name, description) {
        return new Argument2(name, description);
      }
      /**
       * Define argument syntax for command.
       *
       * The default is that the argument is required, and you can explicitly
       * indicate this with <> around the name. Put [] around the name for an optional argument.
       *
       * @example
       * program.argument('<input-file>');
       * program.argument('[output-file]');
       *
       * @param {string} name
       * @param {string} [description]
       * @param {(Function|*)} [parseArg] - custom argument processing function or default value
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      argument(name, description, parseArg, defaultValue) {
        const argument = this.createArgument(name, description);
        if (typeof parseArg === "function") {
          argument.default(defaultValue).argParser(parseArg);
        } else {
          argument.default(parseArg);
        }
        this.addArgument(argument);
        return this;
      }
      /**
       * Define argument syntax for command, adding multiple at once (without descriptions).
       *
       * See also .argument().
       *
       * @example
       * program.arguments('<cmd> [env]');
       *
       * @param {string} names
       * @return {Command} `this` command for chaining
       */
      arguments(names) {
        names.trim().split(/ +/).forEach((detail) => {
          this.argument(detail);
        });
        return this;
      }
      /**
       * Define argument syntax for command, adding a prepared argument.
       *
       * @param {Argument} argument
       * @return {Command} `this` command for chaining
       */
      addArgument(argument) {
        const previousArgument = this.registeredArguments.slice(-1)[0];
        if (previousArgument?.variadic) {
          throw new Error(
            `only the last argument can be variadic '${previousArgument.name()}'`
          );
        }
        if (argument.required && argument.defaultValue !== void 0 && argument.parseArg === void 0) {
          throw new Error(
            `a default value for a required argument is never used: '${argument.name()}'`
          );
        }
        this.registeredArguments.push(argument);
        return this;
      }
      /**
       * Customise or override default help command. By default a help command is automatically added if your command has subcommands.
       *
       * @example
       *    program.helpCommand('help [cmd]');
       *    program.helpCommand('help [cmd]', 'show help');
       *    program.helpCommand(false); // suppress default help command
       *    program.helpCommand(true); // add help command even if no subcommands
       *
       * @param {string|boolean} enableOrNameAndArgs - enable with custom name and/or arguments, or boolean to override whether added
       * @param {string} [description] - custom description
       * @return {Command} `this` command for chaining
       */
      helpCommand(enableOrNameAndArgs, description) {
        if (typeof enableOrNameAndArgs === "boolean") {
          this._addImplicitHelpCommand = enableOrNameAndArgs;
          if (enableOrNameAndArgs && this._defaultCommandGroup) {
            this._initCommandGroup(this._getHelpCommand());
          }
          return this;
        }
        const nameAndArgs = enableOrNameAndArgs ?? "help [command]";
        const [, helpName, helpArgs] = nameAndArgs.match(/([^ ]+) *(.*)/);
        const helpDescription = description ?? "display help for command";
        const helpCommand = this.createCommand(helpName);
        helpCommand.helpOption(false);
        if (helpArgs) helpCommand.arguments(helpArgs);
        if (helpDescription) helpCommand.description(helpDescription);
        this._addImplicitHelpCommand = true;
        this._helpCommand = helpCommand;
        if (enableOrNameAndArgs || description) this._initCommandGroup(helpCommand);
        return this;
      }
      /**
       * Add prepared custom help command.
       *
       * @param {(Command|string|boolean)} helpCommand - custom help command, or deprecated enableOrNameAndArgs as for `.helpCommand()`
       * @param {string} [deprecatedDescription] - deprecated custom description used with custom name only
       * @return {Command} `this` command for chaining
       */
      addHelpCommand(helpCommand, deprecatedDescription) {
        if (typeof helpCommand !== "object") {
          this.helpCommand(helpCommand, deprecatedDescription);
          return this;
        }
        this._addImplicitHelpCommand = true;
        this._helpCommand = helpCommand;
        this._initCommandGroup(helpCommand);
        return this;
      }
      /**
       * Lazy create help command.
       *
       * @return {(Command|null)}
       * @package
       */
      _getHelpCommand() {
        const hasImplicitHelpCommand = this._addImplicitHelpCommand ?? (this.commands.length && !this._actionHandler && !this._findCommand("help"));
        if (hasImplicitHelpCommand) {
          if (this._helpCommand === void 0) {
            this.helpCommand(void 0, void 0);
          }
          return this._helpCommand;
        }
        return null;
      }
      /**
       * Add hook for life cycle event.
       *
       * @param {string} event
       * @param {Function} listener
       * @return {Command} `this` command for chaining
       */
      hook(event, listener) {
        const allowedValues = ["preSubcommand", "preAction", "postAction"];
        if (!allowedValues.includes(event)) {
          throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
        }
        if (this._lifeCycleHooks[event]) {
          this._lifeCycleHooks[event].push(listener);
        } else {
          this._lifeCycleHooks[event] = [listener];
        }
        return this;
      }
      /**
       * Register callback to use as replacement for calling process.exit.
       *
       * @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
       * @return {Command} `this` command for chaining
       */
      exitOverride(fn) {
        if (fn) {
          this._exitCallback = fn;
        } else {
          this._exitCallback = (err) => {
            if (err.code !== "commander.executeSubCommandAsync") {
              throw err;
            } else {
            }
          };
        }
        return this;
      }
      /**
       * Call process.exit, and _exitCallback if defined.
       *
       * @param {number} exitCode exit code for using with process.exit
       * @param {string} code an id string representing the error
       * @param {string} message human-readable description of the error
       * @return never
       * @private
       */
      _exit(exitCode, code, message) {
        if (this._exitCallback) {
          this._exitCallback(new CommanderError2(exitCode, code, message));
        }
        process2.exit(exitCode);
      }
      /**
       * Register callback `fn` for the command.
       *
       * @example
       * program
       *   .command('serve')
       *   .description('start service')
       *   .action(function() {
       *      // do work here
       *   });
       *
       * @param {Function} fn
       * @return {Command} `this` command for chaining
       */
      action(fn) {
        const listener = (args) => {
          const expectedArgsCount = this.registeredArguments.length;
          const actionArgs = args.slice(0, expectedArgsCount);
          if (this._storeOptionsAsProperties) {
            actionArgs[expectedArgsCount] = this;
          } else {
            actionArgs[expectedArgsCount] = this.opts();
          }
          actionArgs.push(this);
          return fn.apply(this, actionArgs);
        };
        this._actionHandler = listener;
        return this;
      }
      /**
       * Factory routine to create a new unattached option.
       *
       * See .option() for creating an attached option, which uses this routine to
       * create the option. You can override createOption to return a custom option.
       *
       * @param {string} flags
       * @param {string} [description]
       * @return {Option} new option
       */
      createOption(flags, description) {
        return new Option2(flags, description);
      }
      /**
       * Wrap parseArgs to catch 'commander.invalidArgument'.
       *
       * @param {(Option | Argument)} target
       * @param {string} value
       * @param {*} previous
       * @param {string} invalidArgumentMessage
       * @private
       */
      _callParseArg(target, value, previous, invalidArgumentMessage) {
        try {
          return target.parseArg(value, previous);
        } catch (err) {
          if (err.code === "commander.invalidArgument") {
            const message = `${invalidArgumentMessage} ${err.message}`;
            this.error(message, { exitCode: err.exitCode, code: err.code });
          }
          throw err;
        }
      }
      /**
       * Check for option flag conflicts.
       * Register option if no conflicts found, or throw on conflict.
       *
       * @param {Option} option
       * @private
       */
      _registerOption(option) {
        const matchingOption = option.short && this._findOption(option.short) || option.long && this._findOption(option.long);
        if (matchingOption) {
          const matchingFlag = option.long && this._findOption(option.long) ? option.long : option.short;
          throw new Error(`Cannot add option '${option.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${matchingFlag}'
-  already used by option '${matchingOption.flags}'`);
        }
        this._initOptionGroup(option);
        this.options.push(option);
      }
      /**
       * Check for command name and alias conflicts with existing commands.
       * Register command if no conflicts found, or throw on conflict.
       *
       * @param {Command} command
       * @private
       */
      _registerCommand(command) {
        const knownBy = (cmd) => {
          return [cmd.name()].concat(cmd.aliases());
        };
        const alreadyUsed = knownBy(command).find(
          (name) => this._findCommand(name)
        );
        if (alreadyUsed) {
          const existingCmd = knownBy(this._findCommand(alreadyUsed)).join("|");
          const newCmd = knownBy(command).join("|");
          throw new Error(
            `cannot add command '${newCmd}' as already have command '${existingCmd}'`
          );
        }
        this._initCommandGroup(command);
        this.commands.push(command);
      }
      /**
       * Add an option.
       *
       * @param {Option} option
       * @return {Command} `this` command for chaining
       */
      addOption(option) {
        this._registerOption(option);
        const oname = option.name();
        const name = option.attributeName();
        if (option.negate) {
          const positiveLongFlag = option.long.replace(/^--no-/, "--");
          if (!this._findOption(positiveLongFlag)) {
            this.setOptionValueWithSource(
              name,
              option.defaultValue === void 0 ? true : option.defaultValue,
              "default"
            );
          }
        } else if (option.defaultValue !== void 0) {
          this.setOptionValueWithSource(name, option.defaultValue, "default");
        }
        const handleOptionValue = (val, invalidValueMessage, valueSource) => {
          if (val == null && option.presetArg !== void 0) {
            val = option.presetArg;
          }
          const oldValue = this.getOptionValue(name);
          if (val !== null && option.parseArg) {
            val = this._callParseArg(option, val, oldValue, invalidValueMessage);
          } else if (val !== null && option.variadic) {
            val = option._collectValue(val, oldValue);
          }
          if (val == null) {
            if (option.negate) {
              val = false;
            } else if (option.isBoolean() || option.optional) {
              val = true;
            } else {
              val = "";
            }
          }
          this.setOptionValueWithSource(name, val, valueSource);
        };
        this.on("option:" + oname, (val) => {
          const invalidValueMessage = `error: option '${option.flags}' argument '${val}' is invalid.`;
          handleOptionValue(val, invalidValueMessage, "cli");
        });
        if (option.envVar) {
          this.on("optionEnv:" + oname, (val) => {
            const invalidValueMessage = `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`;
            handleOptionValue(val, invalidValueMessage, "env");
          });
        }
        return this;
      }
      /**
       * Internal implementation shared by .option() and .requiredOption()
       *
       * @return {Command} `this` command for chaining
       * @private
       */
      _optionEx(config, flags, description, fn, defaultValue) {
        if (typeof flags === "object" && flags instanceof Option2) {
          throw new Error(
            "To add an Option object use addOption() instead of option() or requiredOption()"
          );
        }
        const option = this.createOption(flags, description);
        option.makeOptionMandatory(!!config.mandatory);
        if (typeof fn === "function") {
          option.default(defaultValue).argParser(fn);
        } else if (fn instanceof RegExp) {
          const regex = fn;
          fn = (val, def) => {
            const m = regex.exec(val);
            return m ? m[0] : def;
          };
          option.default(defaultValue).argParser(fn);
        } else {
          option.default(fn);
        }
        return this.addOption(option);
      }
      /**
       * Define option with `flags`, `description`, and optional argument parsing function or `defaultValue` or both.
       *
       * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space. A required
       * option-argument is indicated by `<>` and an optional option-argument by `[]`.
       *
       * See the README for more details, and see also addOption() and requiredOption().
       *
       * @example
       * program
       *     .option('-p, --pepper', 'add pepper')
       *     .option('--pt, --pizza-type <TYPE>', 'type of pizza') // required option-argument
       *     .option('-c, --cheese [CHEESE]', 'add extra cheese', 'mozzarella') // optional option-argument with default
       *     .option('-t, --tip <VALUE>', 'add tip to purchase cost', parseFloat) // custom parse function
       *
       * @param {string} flags
       * @param {string} [description]
       * @param {(Function|*)} [parseArg] - custom option processing function or default value
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      option(flags, description, parseArg, defaultValue) {
        return this._optionEx({}, flags, description, parseArg, defaultValue);
      }
      /**
       * Add a required option which must have a value after parsing. This usually means
       * the option must be specified on the command line. (Otherwise the same as .option().)
       *
       * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space.
       *
       * @param {string} flags
       * @param {string} [description]
       * @param {(Function|*)} [parseArg] - custom option processing function or default value
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      requiredOption(flags, description, parseArg, defaultValue) {
        return this._optionEx(
          { mandatory: true },
          flags,
          description,
          parseArg,
          defaultValue
        );
      }
      /**
       * Alter parsing of short flags with optional values.
       *
       * @example
       * // for `.option('-f,--flag [value]'):
       * program.combineFlagAndOptionalValue(true);  // `-f80` is treated like `--flag=80`, this is the default behaviour
       * program.combineFlagAndOptionalValue(false) // `-fb` is treated like `-f -b`
       *
       * @param {boolean} [combine] - if `true` or omitted, an optional value can be specified directly after the flag.
       * @return {Command} `this` command for chaining
       */
      combineFlagAndOptionalValue(combine = true) {
        this._combineFlagAndOptionalValue = !!combine;
        return this;
      }
      /**
       * Allow unknown options on the command line.
       *
       * @param {boolean} [allowUnknown] - if `true` or omitted, no error will be thrown for unknown options.
       * @return {Command} `this` command for chaining
       */
      allowUnknownOption(allowUnknown = true) {
        this._allowUnknownOption = !!allowUnknown;
        return this;
      }
      /**
       * Allow excess command-arguments on the command line. Pass false to make excess arguments an error.
       *
       * @param {boolean} [allowExcess] - if `true` or omitted, no error will be thrown for excess arguments.
       * @return {Command} `this` command for chaining
       */
      allowExcessArguments(allowExcess = true) {
        this._allowExcessArguments = !!allowExcess;
        return this;
      }
      /**
       * Enable positional options. Positional means global options are specified before subcommands which lets
       * subcommands reuse the same option names, and also enables subcommands to turn on passThroughOptions.
       * The default behaviour is non-positional and global options may appear anywhere on the command line.
       *
       * @param {boolean} [positional]
       * @return {Command} `this` command for chaining
       */
      enablePositionalOptions(positional = true) {
        this._enablePositionalOptions = !!positional;
        return this;
      }
      /**
       * Pass through options that come after command-arguments rather than treat them as command-options,
       * so actual command-options come before command-arguments. Turning this on for a subcommand requires
       * positional options to have been enabled on the program (parent commands).
       * The default behaviour is non-positional and options may appear before or after command-arguments.
       *
       * @param {boolean} [passThrough] for unknown options.
       * @return {Command} `this` command for chaining
       */
      passThroughOptions(passThrough = true) {
        this._passThroughOptions = !!passThrough;
        this._checkForBrokenPassThrough();
        return this;
      }
      /**
       * @private
       */
      _checkForBrokenPassThrough() {
        if (this.parent && this._passThroughOptions && !this.parent._enablePositionalOptions) {
          throw new Error(
            `passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`
          );
        }
      }
      /**
       * Whether to store option values as properties on command object,
       * or store separately (specify false). In both cases the option values can be accessed using .opts().
       *
       * @param {boolean} [storeAsProperties=true]
       * @return {Command} `this` command for chaining
       */
      storeOptionsAsProperties(storeAsProperties = true) {
        if (this.options.length) {
          throw new Error("call .storeOptionsAsProperties() before adding options");
        }
        if (Object.keys(this._optionValues).length) {
          throw new Error(
            "call .storeOptionsAsProperties() before setting option values"
          );
        }
        this._storeOptionsAsProperties = !!storeAsProperties;
        return this;
      }
      /**
       * Retrieve option value.
       *
       * @param {string} key
       * @return {object} value
       */
      getOptionValue(key) {
        if (this._storeOptionsAsProperties) {
          return this[key];
        }
        return this._optionValues[key];
      }
      /**
       * Store option value.
       *
       * @param {string} key
       * @param {object} value
       * @return {Command} `this` command for chaining
       */
      setOptionValue(key, value) {
        return this.setOptionValueWithSource(key, value, void 0);
      }
      /**
       * Store option value and where the value came from.
       *
       * @param {string} key
       * @param {object} value
       * @param {string} source - expected values are default/config/env/cli/implied
       * @return {Command} `this` command for chaining
       */
      setOptionValueWithSource(key, value, source) {
        if (this._storeOptionsAsProperties) {
          this[key] = value;
        } else {
          this._optionValues[key] = value;
        }
        this._optionValueSources[key] = source;
        return this;
      }
      /**
       * Get source of option value.
       * Expected values are default | config | env | cli | implied
       *
       * @param {string} key
       * @return {string}
       */
      getOptionValueSource(key) {
        return this._optionValueSources[key];
      }
      /**
       * Get source of option value. See also .optsWithGlobals().
       * Expected values are default | config | env | cli | implied
       *
       * @param {string} key
       * @return {string}
       */
      getOptionValueSourceWithGlobals(key) {
        let source;
        this._getCommandAndAncestors().forEach((cmd) => {
          if (cmd.getOptionValueSource(key) !== void 0) {
            source = cmd.getOptionValueSource(key);
          }
        });
        return source;
      }
      /**
       * Get user arguments from implied or explicit arguments.
       * Side-effects: set _scriptPath if args included script. Used for default program name, and subcommand searches.
       *
       * @private
       */
      _prepareUserArgs(argv, parseOptions) {
        if (argv !== void 0 && !Array.isArray(argv)) {
          throw new Error("first parameter to parse must be array or undefined");
        }
        parseOptions = parseOptions || {};
        if (argv === void 0 && parseOptions.from === void 0) {
          if (process2.versions?.electron) {
            parseOptions.from = "electron";
          }
          const execArgv = process2.execArgv ?? [];
          if (execArgv.includes("-e") || execArgv.includes("--eval") || execArgv.includes("-p") || execArgv.includes("--print")) {
            parseOptions.from = "eval";
          }
        }
        if (argv === void 0) {
          argv = process2.argv;
        }
        this.rawArgs = argv.slice();
        let userArgs;
        switch (parseOptions.from) {
          case void 0:
          case "node":
            this._scriptPath = argv[1];
            userArgs = argv.slice(2);
            break;
          case "electron":
            if (process2.defaultApp) {
              this._scriptPath = argv[1];
              userArgs = argv.slice(2);
            } else {
              userArgs = argv.slice(1);
            }
            break;
          case "user":
            userArgs = argv.slice(0);
            break;
          case "eval":
            userArgs = argv.slice(1);
            break;
          default:
            throw new Error(
              `unexpected parse option { from: '${parseOptions.from}' }`
            );
        }
        if (!this._name && this._scriptPath)
          this.nameFromFilename(this._scriptPath);
        this._name = this._name || "program";
        return userArgs;
      }
      /**
       * Parse `argv`, setting options and invoking commands when defined.
       *
       * Use parseAsync instead of parse if any of your action handlers are async.
       *
       * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
       *
       * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
       * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
       * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
       * - `'user'`: just user arguments
       *
       * @example
       * program.parse(); // parse process.argv and auto-detect electron and special node flags
       * program.parse(process.argv); // assume argv[0] is app and argv[1] is script
       * program.parse(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
       *
       * @param {string[]} [argv] - optional, defaults to process.argv
       * @param {object} [parseOptions] - optionally specify style of options with from: node/user/electron
       * @param {string} [parseOptions.from] - where the args are from: 'node', 'user', 'electron'
       * @return {Command} `this` command for chaining
       */
      parse(argv, parseOptions) {
        this._prepareForParse();
        const userArgs = this._prepareUserArgs(argv, parseOptions);
        this._parseCommand([], userArgs);
        return this;
      }
      /**
       * Parse `argv`, setting options and invoking commands when defined.
       *
       * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
       *
       * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
       * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
       * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
       * - `'user'`: just user arguments
       *
       * @example
       * await program.parseAsync(); // parse process.argv and auto-detect electron and special node flags
       * await program.parseAsync(process.argv); // assume argv[0] is app and argv[1] is script
       * await program.parseAsync(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
       *
       * @param {string[]} [argv]
       * @param {object} [parseOptions]
       * @param {string} parseOptions.from - where the args are from: 'node', 'user', 'electron'
       * @return {Promise}
       */
      async parseAsync(argv, parseOptions) {
        this._prepareForParse();
        const userArgs = this._prepareUserArgs(argv, parseOptions);
        await this._parseCommand([], userArgs);
        return this;
      }
      _prepareForParse() {
        if (this._savedState === null) {
          this.saveStateBeforeParse();
        } else {
          this.restoreStateBeforeParse();
        }
      }
      /**
       * Called the first time parse is called to save state and allow a restore before subsequent calls to parse.
       * Not usually called directly, but available for subclasses to save their custom state.
       *
       * This is called in a lazy way. Only commands used in parsing chain will have state saved.
       */
      saveStateBeforeParse() {
        this._savedState = {
          // name is stable if supplied by author, but may be unspecified for root command and deduced during parsing
          _name: this._name,
          // option values before parse have default values (including false for negated options)
          // shallow clones
          _optionValues: { ...this._optionValues },
          _optionValueSources: { ...this._optionValueSources }
        };
      }
      /**
       * Restore state before parse for calls after the first.
       * Not usually called directly, but available for subclasses to save their custom state.
       *
       * This is called in a lazy way. Only commands used in parsing chain will have state restored.
       */
      restoreStateBeforeParse() {
        if (this._storeOptionsAsProperties)
          throw new Error(`Can not call parse again when storeOptionsAsProperties is true.
- either make a new Command for each call to parse, or stop storing options as properties`);
        this._name = this._savedState._name;
        this._scriptPath = null;
        this.rawArgs = [];
        this._optionValues = { ...this._savedState._optionValues };
        this._optionValueSources = { ...this._savedState._optionValueSources };
        this.args = [];
        this.processedArgs = [];
      }
      /**
       * Throw if expected executable is missing. Add lots of help for author.
       *
       * @param {string} executableFile
       * @param {string} executableDir
       * @param {string} subcommandName
       */
      _checkForMissingExecutable(executableFile, executableDir, subcommandName) {
        if (fs.existsSync(executableFile)) return;
        const executableDirMessage = executableDir ? `searched for local subcommand relative to directory '${executableDir}'` : "no directory for search for local subcommand, use .executableDir() to supply a custom directory";
        const executableMissing = `'${executableFile}' does not exist
 - if '${subcommandName}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDirMessage}`;
        throw new Error(executableMissing);
      }
      /**
       * Execute a sub-command executable.
       *
       * @private
       */
      _executeSubCommand(subcommand, args) {
        args = args.slice();
        let launchWithNode = false;
        const sourceExt = [".js", ".ts", ".tsx", ".mjs", ".cjs"];
        function findFile(baseDir, baseName) {
          const localBin = path.resolve(baseDir, baseName);
          if (fs.existsSync(localBin)) return localBin;
          if (sourceExt.includes(path.extname(baseName))) return void 0;
          const foundExt = sourceExt.find(
            (ext) => fs.existsSync(`${localBin}${ext}`)
          );
          if (foundExt) return `${localBin}${foundExt}`;
          return void 0;
        }
        this._checkForMissingMandatoryOptions();
        this._checkForConflictingOptions();
        let executableFile = subcommand._executableFile || `${this._name}-${subcommand._name}`;
        let executableDir = this._executableDir || "";
        if (this._scriptPath) {
          let resolvedScriptPath;
          try {
            resolvedScriptPath = fs.realpathSync(this._scriptPath);
          } catch {
            resolvedScriptPath = this._scriptPath;
          }
          executableDir = path.resolve(
            path.dirname(resolvedScriptPath),
            executableDir
          );
        }
        if (executableDir) {
          let localFile = findFile(executableDir, executableFile);
          if (!localFile && !subcommand._executableFile && this._scriptPath) {
            const legacyName = path.basename(
              this._scriptPath,
              path.extname(this._scriptPath)
            );
            if (legacyName !== this._name) {
              localFile = findFile(
                executableDir,
                `${legacyName}-${subcommand._name}`
              );
            }
          }
          executableFile = localFile || executableFile;
        }
        launchWithNode = sourceExt.includes(path.extname(executableFile));
        let proc;
        if (process2.platform !== "win32") {
          if (launchWithNode) {
            args.unshift(executableFile);
            args = incrementNodeInspectorPort(process2.execArgv).concat(args);
            proc = childProcess.spawn(process2.argv[0], args, { stdio: "inherit" });
          } else {
            proc = childProcess.spawn(executableFile, args, { stdio: "inherit" });
          }
        } else {
          this._checkForMissingExecutable(
            executableFile,
            executableDir,
            subcommand._name
          );
          args.unshift(executableFile);
          args = incrementNodeInspectorPort(process2.execArgv).concat(args);
          proc = childProcess.spawn(process2.execPath, args, { stdio: "inherit" });
        }
        if (!proc.killed) {
          const signals = ["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"];
          signals.forEach((signal) => {
            process2.on(signal, () => {
              if (proc.killed === false && proc.exitCode === null) {
                proc.kill(signal);
              }
            });
          });
        }
        const exitCallback = this._exitCallback;
        proc.on("close", (code) => {
          code = code ?? 1;
          if (!exitCallback) {
            process2.exit(code);
          } else {
            exitCallback(
              new CommanderError2(
                code,
                "commander.executeSubCommandAsync",
                "(close)"
              )
            );
          }
        });
        proc.on("error", (err) => {
          if (err.code === "ENOENT") {
            this._checkForMissingExecutable(
              executableFile,
              executableDir,
              subcommand._name
            );
          } else if (err.code === "EACCES") {
            throw new Error(`'${executableFile}' not executable`);
          }
          if (!exitCallback) {
            process2.exit(1);
          } else {
            const wrappedError = new CommanderError2(
              1,
              "commander.executeSubCommandAsync",
              "(error)"
            );
            wrappedError.nestedError = err;
            exitCallback(wrappedError);
          }
        });
        this.runningCommand = proc;
      }
      /**
       * @private
       */
      _dispatchSubcommand(commandName, operands, unknown) {
        const subCommand = this._findCommand(commandName);
        if (!subCommand) this.help({ error: true });
        subCommand._prepareForParse();
        let promiseChain;
        promiseChain = this._chainOrCallSubCommandHook(
          promiseChain,
          subCommand,
          "preSubcommand"
        );
        promiseChain = this._chainOrCall(promiseChain, () => {
          if (subCommand._executableHandler) {
            this._executeSubCommand(subCommand, operands.concat(unknown));
          } else {
            return subCommand._parseCommand(operands, unknown);
          }
        });
        return promiseChain;
      }
      /**
       * Invoke help directly if possible, or dispatch if necessary.
       * e.g. help foo
       *
       * @private
       */
      _dispatchHelpCommand(subcommandName) {
        if (!subcommandName) {
          this.help();
        }
        const subCommand = this._findCommand(subcommandName);
        if (subCommand && !subCommand._executableHandler) {
          subCommand.help();
        }
        return this._dispatchSubcommand(
          subcommandName,
          [],
          [this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? "--help"]
        );
      }
      /**
       * Check this.args against expected this.registeredArguments.
       *
       * @private
       */
      _checkNumberOfArguments() {
        this.registeredArguments.forEach((arg, i) => {
          if (arg.required && this.args[i] == null) {
            this.missingArgument(arg.name());
          }
        });
        if (this.registeredArguments.length > 0 && this.registeredArguments[this.registeredArguments.length - 1].variadic) {
          return;
        }
        if (this.args.length > this.registeredArguments.length) {
          this._excessArguments(this.args);
        }
      }
      /**
       * Process this.args using this.registeredArguments and save as this.processedArgs!
       *
       * @private
       */
      _processArguments() {
        const myParseArg = (argument, value, previous) => {
          let parsedValue = value;
          if (value !== null && argument.parseArg) {
            const invalidValueMessage = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'.`;
            parsedValue = this._callParseArg(
              argument,
              value,
              previous,
              invalidValueMessage
            );
          }
          return parsedValue;
        };
        this._checkNumberOfArguments();
        const processedArgs = [];
        this.registeredArguments.forEach((declaredArg, index) => {
          let value = declaredArg.defaultValue;
          if (declaredArg.variadic) {
            if (index < this.args.length) {
              value = this.args.slice(index);
              if (declaredArg.parseArg) {
                value = value.reduce((processed, v) => {
                  return myParseArg(declaredArg, v, processed);
                }, declaredArg.defaultValue);
              }
            } else if (value === void 0) {
              value = [];
            }
          } else if (index < this.args.length) {
            value = this.args[index];
            if (declaredArg.parseArg) {
              value = myParseArg(declaredArg, value, declaredArg.defaultValue);
            }
          }
          processedArgs[index] = value;
        });
        this.processedArgs = processedArgs;
      }
      /**
       * Once we have a promise we chain, but call synchronously until then.
       *
       * @param {(Promise|undefined)} promise
       * @param {Function} fn
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCall(promise, fn) {
        if (promise?.then && typeof promise.then === "function") {
          return promise.then(() => fn());
        }
        return fn();
      }
      /**
       *
       * @param {(Promise|undefined)} promise
       * @param {string} event
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCallHooks(promise, event) {
        let result = promise;
        const hooks = [];
        this._getCommandAndAncestors().reverse().filter((cmd) => cmd._lifeCycleHooks[event] !== void 0).forEach((hookedCommand) => {
          hookedCommand._lifeCycleHooks[event].forEach((callback) => {
            hooks.push({ hookedCommand, callback });
          });
        });
        if (event === "postAction") {
          hooks.reverse();
        }
        hooks.forEach((hookDetail) => {
          result = this._chainOrCall(result, () => {
            return hookDetail.callback(hookDetail.hookedCommand, this);
          });
        });
        return result;
      }
      /**
       *
       * @param {(Promise|undefined)} promise
       * @param {Command} subCommand
       * @param {string} event
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCallSubCommandHook(promise, subCommand, event) {
        let result = promise;
        if (this._lifeCycleHooks[event] !== void 0) {
          this._lifeCycleHooks[event].forEach((hook2) => {
            result = this._chainOrCall(result, () => {
              return hook2(this, subCommand);
            });
          });
        }
        return result;
      }
      /**
       * Process arguments in context of this command.
       * Returns action result, in case it is a promise.
       *
       * @private
       */
      _parseCommand(operands, unknown) {
        const parsed = this.parseOptions(unknown);
        this._parseOptionsEnv();
        this._parseOptionsImplied();
        operands = operands.concat(parsed.operands);
        unknown = parsed.unknown;
        this.args = operands.concat(unknown);
        if (operands && this._findCommand(operands[0])) {
          return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
        }
        if (this._getHelpCommand() && operands[0] === this._getHelpCommand().name()) {
          return this._dispatchHelpCommand(operands[1]);
        }
        if (this._defaultCommandName) {
          this._outputHelpIfRequested(unknown);
          return this._dispatchSubcommand(
            this._defaultCommandName,
            operands,
            unknown
          );
        }
        if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
          this.help({ error: true });
        }
        this._outputHelpIfRequested(parsed.unknown);
        this._checkForMissingMandatoryOptions();
        this._checkForConflictingOptions();
        const checkForUnknownOptions = () => {
          if (parsed.unknown.length > 0) {
            this.unknownOption(parsed.unknown[0]);
          }
        };
        const commandEvent = `command:${this.name()}`;
        if (this._actionHandler) {
          checkForUnknownOptions();
          this._processArguments();
          let promiseChain;
          promiseChain = this._chainOrCallHooks(promiseChain, "preAction");
          promiseChain = this._chainOrCall(
            promiseChain,
            () => this._actionHandler(this.processedArgs)
          );
          if (this.parent) {
            promiseChain = this._chainOrCall(promiseChain, () => {
              this.parent.emit(commandEvent, operands, unknown);
            });
          }
          promiseChain = this._chainOrCallHooks(promiseChain, "postAction");
          return promiseChain;
        }
        if (this.parent?.listenerCount(commandEvent)) {
          checkForUnknownOptions();
          this._processArguments();
          this.parent.emit(commandEvent, operands, unknown);
        } else if (operands.length) {
          if (this._findCommand("*")) {
            return this._dispatchSubcommand("*", operands, unknown);
          }
          if (this.listenerCount("command:*")) {
            this.emit("command:*", operands, unknown);
          } else if (this.commands.length) {
            this.unknownCommand();
          } else {
            checkForUnknownOptions();
            this._processArguments();
          }
        } else if (this.commands.length) {
          checkForUnknownOptions();
          this.help({ error: true });
        } else {
          checkForUnknownOptions();
          this._processArguments();
        }
      }
      /**
       * Find matching command.
       *
       * @private
       * @return {Command | undefined}
       */
      _findCommand(name) {
        if (!name) return void 0;
        return this.commands.find(
          (cmd) => cmd._name === name || cmd._aliases.includes(name)
        );
      }
      /**
       * Return an option matching `arg` if any.
       *
       * @param {string} arg
       * @return {Option}
       * @package
       */
      _findOption(arg) {
        return this.options.find((option) => option.is(arg));
      }
      /**
       * Display an error message if a mandatory option does not have a value.
       * Called after checking for help flags in leaf subcommand.
       *
       * @private
       */
      _checkForMissingMandatoryOptions() {
        this._getCommandAndAncestors().forEach((cmd) => {
          cmd.options.forEach((anOption) => {
            if (anOption.mandatory && cmd.getOptionValue(anOption.attributeName()) === void 0) {
              cmd.missingMandatoryOptionValue(anOption);
            }
          });
        });
      }
      /**
       * Display an error message if conflicting options are used together in this.
       *
       * @private
       */
      _checkForConflictingLocalOptions() {
        const definedNonDefaultOptions = this.options.filter((option) => {
          const optionKey = option.attributeName();
          if (this.getOptionValue(optionKey) === void 0) {
            return false;
          }
          return this.getOptionValueSource(optionKey) !== "default";
        });
        const optionsWithConflicting = definedNonDefaultOptions.filter(
          (option) => option.conflictsWith.length > 0
        );
        optionsWithConflicting.forEach((option) => {
          const conflictingAndDefined = definedNonDefaultOptions.find(
            (defined) => option.conflictsWith.includes(defined.attributeName())
          );
          if (conflictingAndDefined) {
            this._conflictingOption(option, conflictingAndDefined);
          }
        });
      }
      /**
       * Display an error message if conflicting options are used together.
       * Called after checking for help flags in leaf subcommand.
       *
       * @private
       */
      _checkForConflictingOptions() {
        this._getCommandAndAncestors().forEach((cmd) => {
          cmd._checkForConflictingLocalOptions();
        });
      }
      /**
       * Parse options from `argv` removing known options,
       * and return argv split into operands and unknown arguments.
       *
       * Side effects: modifies command by storing options. Does not reset state if called again.
       *
       * Examples:
       *
       *     argv => operands, unknown
       *     --known kkk op => [op], []
       *     op --known kkk => [op], []
       *     sub --unknown uuu op => [sub], [--unknown uuu op]
       *     sub -- --unknown uuu op => [sub --unknown uuu op], []
       *
       * @param {string[]} args
       * @return {{operands: string[], unknown: string[]}}
       */
      parseOptions(args) {
        const operands = [];
        const unknown = [];
        let dest = operands;
        function maybeOption(arg) {
          return arg.length > 1 && arg[0] === "-";
        }
        const negativeNumberArg = (arg) => {
          if (!/^-(\d+|\d*\.\d+)(e[+-]?\d+)?$/.test(arg)) return false;
          return !this._getCommandAndAncestors().some(
            (cmd) => cmd.options.map((opt) => opt.short).some((short) => /^-\d$/.test(short))
          );
        };
        let activeVariadicOption = null;
        let activeGroup = null;
        let i = 0;
        while (i < args.length || activeGroup) {
          const arg = activeGroup ?? args[i++];
          activeGroup = null;
          if (arg === "--") {
            if (dest === unknown) dest.push(arg);
            dest.push(...args.slice(i));
            break;
          }
          if (activeVariadicOption && (!maybeOption(arg) || negativeNumberArg(arg))) {
            this.emit(`option:${activeVariadicOption.name()}`, arg);
            continue;
          }
          activeVariadicOption = null;
          if (maybeOption(arg)) {
            const option = this._findOption(arg);
            if (option) {
              if (option.required) {
                const value = args[i++];
                if (value === void 0) this.optionMissingArgument(option);
                this.emit(`option:${option.name()}`, value);
              } else if (option.optional) {
                let value = null;
                if (i < args.length && (!maybeOption(args[i]) || negativeNumberArg(args[i]))) {
                  value = args[i++];
                }
                this.emit(`option:${option.name()}`, value);
              } else {
                this.emit(`option:${option.name()}`);
              }
              activeVariadicOption = option.variadic ? option : null;
              continue;
            }
          }
          if (arg.length > 2 && arg[0] === "-" && arg[1] !== "-") {
            const option = this._findOption(`-${arg[1]}`);
            if (option) {
              if (option.required || option.optional && this._combineFlagAndOptionalValue) {
                this.emit(`option:${option.name()}`, arg.slice(2));
              } else {
                this.emit(`option:${option.name()}`);
                activeGroup = `-${arg.slice(2)}`;
              }
              continue;
            }
          }
          if (/^--[^=]+=/.test(arg)) {
            const index = arg.indexOf("=");
            const option = this._findOption(arg.slice(0, index));
            if (option && (option.required || option.optional)) {
              this.emit(`option:${option.name()}`, arg.slice(index + 1));
              continue;
            }
          }
          if (dest === operands && maybeOption(arg) && !(this.commands.length === 0 && negativeNumberArg(arg))) {
            dest = unknown;
          }
          if ((this._enablePositionalOptions || this._passThroughOptions) && operands.length === 0 && unknown.length === 0) {
            if (this._findCommand(arg)) {
              operands.push(arg);
              unknown.push(...args.slice(i));
              break;
            } else if (this._getHelpCommand() && arg === this._getHelpCommand().name()) {
              operands.push(arg, ...args.slice(i));
              break;
            } else if (this._defaultCommandName) {
              unknown.push(arg, ...args.slice(i));
              break;
            }
          }
          if (this._passThroughOptions) {
            dest.push(arg, ...args.slice(i));
            break;
          }
          dest.push(arg);
        }
        return { operands, unknown };
      }
      /**
       * Return an object containing local option values as key-value pairs.
       *
       * @return {object}
       */
      opts() {
        if (this._storeOptionsAsProperties) {
          const result = {};
          const len = this.options.length;
          for (let i = 0; i < len; i++) {
            const key = this.options[i].attributeName();
            result[key] = key === this._versionOptionName ? this._version : this[key];
          }
          return result;
        }
        return this._optionValues;
      }
      /**
       * Return an object containing merged local and global option values as key-value pairs.
       *
       * @return {object}
       */
      optsWithGlobals() {
        return this._getCommandAndAncestors().reduce(
          (combinedOptions, cmd) => Object.assign(combinedOptions, cmd.opts()),
          {}
        );
      }
      /**
       * Display error message and exit (or call exitOverride).
       *
       * @param {string} message
       * @param {object} [errorOptions]
       * @param {string} [errorOptions.code] - an id string representing the error
       * @param {number} [errorOptions.exitCode] - used with process.exit
       */
      error(message, errorOptions) {
        this._outputConfiguration.outputError(
          `${message}
`,
          this._outputConfiguration.writeErr
        );
        if (typeof this._showHelpAfterError === "string") {
          this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`);
        } else if (this._showHelpAfterError) {
          this._outputConfiguration.writeErr("\n");
          this.outputHelp({ error: true });
        }
        const config = errorOptions || {};
        const exitCode = config.exitCode || 1;
        const code = config.code || "commander.error";
        this._exit(exitCode, code, message);
      }
      /**
       * Apply any option related environment variables, if option does
       * not have a value from cli or client code.
       *
       * @private
       */
      _parseOptionsEnv() {
        this.options.forEach((option) => {
          if (option.envVar && option.envVar in process2.env) {
            const optionKey = option.attributeName();
            if (this.getOptionValue(optionKey) === void 0 || ["default", "config", "env"].includes(
              this.getOptionValueSource(optionKey)
            )) {
              if (option.required || option.optional) {
                this.emit(`optionEnv:${option.name()}`, process2.env[option.envVar]);
              } else {
                this.emit(`optionEnv:${option.name()}`);
              }
            }
          }
        });
      }
      /**
       * Apply any implied option values, if option is undefined or default value.
       *
       * @private
       */
      _parseOptionsImplied() {
        const dualHelper = new DualOptions(this.options);
        const hasCustomOptionValue = (optionKey) => {
          return this.getOptionValue(optionKey) !== void 0 && !["default", "implied"].includes(this.getOptionValueSource(optionKey));
        };
        this.options.filter(
          (option) => option.implied !== void 0 && hasCustomOptionValue(option.attributeName()) && dualHelper.valueFromOption(
            this.getOptionValue(option.attributeName()),
            option
          )
        ).forEach((option) => {
          Object.keys(option.implied).filter((impliedKey) => !hasCustomOptionValue(impliedKey)).forEach((impliedKey) => {
            this.setOptionValueWithSource(
              impliedKey,
              option.implied[impliedKey],
              "implied"
            );
          });
        });
      }
      /**
       * Argument `name` is missing.
       *
       * @param {string} name
       * @private
       */
      missingArgument(name) {
        const message = `error: missing required argument '${name}'`;
        this.error(message, { code: "commander.missingArgument" });
      }
      /**
       * `Option` is missing an argument.
       *
       * @param {Option} option
       * @private
       */
      optionMissingArgument(option) {
        const message = `error: option '${option.flags}' argument missing`;
        this.error(message, { code: "commander.optionMissingArgument" });
      }
      /**
       * `Option` does not have a value, and is a mandatory option.
       *
       * @param {Option} option
       * @private
       */
      missingMandatoryOptionValue(option) {
        const message = `error: required option '${option.flags}' not specified`;
        this.error(message, { code: "commander.missingMandatoryOptionValue" });
      }
      /**
       * `Option` conflicts with another option.
       *
       * @param {Option} option
       * @param {Option} conflictingOption
       * @private
       */
      _conflictingOption(option, conflictingOption) {
        const findBestOptionFromValue = (option2) => {
          const optionKey = option2.attributeName();
          const optionValue = this.getOptionValue(optionKey);
          const negativeOption = this.options.find(
            (target) => target.negate && optionKey === target.attributeName()
          );
          const positiveOption = this.options.find(
            (target) => !target.negate && optionKey === target.attributeName()
          );
          if (negativeOption && (negativeOption.presetArg === void 0 && optionValue === false || negativeOption.presetArg !== void 0 && optionValue === negativeOption.presetArg)) {
            return negativeOption;
          }
          return positiveOption || option2;
        };
        const getErrorMessage = (option2) => {
          const bestOption = findBestOptionFromValue(option2);
          const optionKey = bestOption.attributeName();
          const source = this.getOptionValueSource(optionKey);
          if (source === "env") {
            return `environment variable '${bestOption.envVar}'`;
          }
          return `option '${bestOption.flags}'`;
        };
        const message = `error: ${getErrorMessage(option)} cannot be used with ${getErrorMessage(conflictingOption)}`;
        this.error(message, { code: "commander.conflictingOption" });
      }
      /**
       * Unknown option `flag`.
       *
       * @param {string} flag
       * @private
       */
      unknownOption(flag) {
        if (this._allowUnknownOption) return;
        let suggestion = "";
        if (flag.startsWith("--") && this._showSuggestionAfterError) {
          let candidateFlags = [];
          let command = this;
          do {
            const moreFlags = command.createHelp().visibleOptions(command).filter((option) => option.long).map((option) => option.long);
            candidateFlags = candidateFlags.concat(moreFlags);
            command = command.parent;
          } while (command && !command._enablePositionalOptions);
          suggestion = suggestSimilar(flag, candidateFlags);
        }
        const message = `error: unknown option '${flag}'${suggestion}`;
        this.error(message, { code: "commander.unknownOption" });
      }
      /**
       * Excess arguments, more than expected.
       *
       * @param {string[]} receivedArgs
       * @private
       */
      _excessArguments(receivedArgs) {
        if (this._allowExcessArguments) return;
        const expected = this.registeredArguments.length;
        const s = expected === 1 ? "" : "s";
        const forSubcommand = this.parent ? ` for '${this.name()}'` : "";
        const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
        this.error(message, { code: "commander.excessArguments" });
      }
      /**
       * Unknown command.
       *
       * @private
       */
      unknownCommand() {
        const unknownName = this.args[0];
        let suggestion = "";
        if (this._showSuggestionAfterError) {
          const candidateNames = [];
          this.createHelp().visibleCommands(this).forEach((command) => {
            candidateNames.push(command.name());
            if (command.alias()) candidateNames.push(command.alias());
          });
          suggestion = suggestSimilar(unknownName, candidateNames);
        }
        const message = `error: unknown command '${unknownName}'${suggestion}`;
        this.error(message, { code: "commander.unknownCommand" });
      }
      /**
       * Get or set the program version.
       *
       * This method auto-registers the "-V, --version" option which will print the version number.
       *
       * You can optionally supply the flags and description to override the defaults.
       *
       * @param {string} [str]
       * @param {string} [flags]
       * @param {string} [description]
       * @return {(this | string | undefined)} `this` command for chaining, or version string if no arguments
       */
      version(str, flags, description) {
        if (str === void 0) return this._version;
        this._version = str;
        flags = flags || "-V, --version";
        description = description || "output the version number";
        const versionOption = this.createOption(flags, description);
        this._versionOptionName = versionOption.attributeName();
        this._registerOption(versionOption);
        this.on("option:" + versionOption.name(), () => {
          this._outputConfiguration.writeOut(`${str}
`);
          this._exit(0, "commander.version", str);
        });
        return this;
      }
      /**
       * Set the description.
       *
       * @param {string} [str]
       * @param {object} [argsDescription]
       * @return {(string|Command)}
       */
      description(str, argsDescription) {
        if (str === void 0 && argsDescription === void 0)
          return this._description;
        this._description = str;
        if (argsDescription) {
          this._argsDescription = argsDescription;
        }
        return this;
      }
      /**
       * Set the summary. Used when listed as subcommand of parent.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      summary(str) {
        if (str === void 0) return this._summary;
        this._summary = str;
        return this;
      }
      /**
       * Set an alias for the command.
       *
       * You may call more than once to add multiple aliases. Only the first alias is shown in the auto-generated help.
       *
       * @param {string} [alias]
       * @return {(string|Command)}
       */
      alias(alias) {
        if (alias === void 0) return this._aliases[0];
        let command = this;
        if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) {
          command = this.commands[this.commands.length - 1];
        }
        if (alias === command._name)
          throw new Error("Command alias can't be the same as its name");
        const matchingCommand = this.parent?._findCommand(alias);
        if (matchingCommand) {
          const existingCmd = [matchingCommand.name()].concat(matchingCommand.aliases()).join("|");
          throw new Error(
            `cannot add alias '${alias}' to command '${this.name()}' as already have command '${existingCmd}'`
          );
        }
        command._aliases.push(alias);
        return this;
      }
      /**
       * Set aliases for the command.
       *
       * Only the first alias is shown in the auto-generated help.
       *
       * @param {string[]} [aliases]
       * @return {(string[]|Command)}
       */
      aliases(aliases) {
        if (aliases === void 0) return this._aliases;
        aliases.forEach((alias) => this.alias(alias));
        return this;
      }
      /**
       * Set / get the command usage `str`.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      usage(str) {
        if (str === void 0) {
          if (this._usage) return this._usage;
          const args = this.registeredArguments.map((arg) => {
            return humanReadableArgName(arg);
          });
          return [].concat(
            this.options.length || this._helpOption !== null ? "[options]" : [],
            this.commands.length ? "[command]" : [],
            this.registeredArguments.length ? args : []
          ).join(" ");
        }
        this._usage = str;
        return this;
      }
      /**
       * Get or set the name of the command.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      name(str) {
        if (str === void 0) return this._name;
        this._name = str;
        return this;
      }
      /**
       * Set/get the help group heading for this subcommand in parent command's help.
       *
       * @param {string} [heading]
       * @return {Command | string}
       */
      helpGroup(heading) {
        if (heading === void 0) return this._helpGroupHeading ?? "";
        this._helpGroupHeading = heading;
        return this;
      }
      /**
       * Set/get the default help group heading for subcommands added to this command.
       * (This does not override a group set directly on the subcommand using .helpGroup().)
       *
       * @example
       * program.commandsGroup('Development Commands:);
       * program.command('watch')...
       * program.command('lint')...
       * ...
       *
       * @param {string} [heading]
       * @returns {Command | string}
       */
      commandsGroup(heading) {
        if (heading === void 0) return this._defaultCommandGroup ?? "";
        this._defaultCommandGroup = heading;
        return this;
      }
      /**
       * Set/get the default help group heading for options added to this command.
       * (This does not override a group set directly on the option using .helpGroup().)
       *
       * @example
       * program
       *   .optionsGroup('Development Options:')
       *   .option('-d, --debug', 'output extra debugging')
       *   .option('-p, --profile', 'output profiling information')
       *
       * @param {string} [heading]
       * @returns {Command | string}
       */
      optionsGroup(heading) {
        if (heading === void 0) return this._defaultOptionGroup ?? "";
        this._defaultOptionGroup = heading;
        return this;
      }
      /**
       * @param {Option} option
       * @private
       */
      _initOptionGroup(option) {
        if (this._defaultOptionGroup && !option.helpGroupHeading)
          option.helpGroup(this._defaultOptionGroup);
      }
      /**
       * @param {Command} cmd
       * @private
       */
      _initCommandGroup(cmd) {
        if (this._defaultCommandGroup && !cmd.helpGroup())
          cmd.helpGroup(this._defaultCommandGroup);
      }
      /**
       * Set the name of the command from script filename, such as process.argv[1],
       * or require.main.filename, or __filename.
       *
       * (Used internally and public although not documented in README.)
       *
       * @example
       * program.nameFromFilename(require.main.filename);
       *
       * @param {string} filename
       * @return {Command}
       */
      nameFromFilename(filename) {
        this._name = path.basename(filename, path.extname(filename));
        return this;
      }
      /**
       * Get or set the directory for searching for executable subcommands of this command.
       *
       * @example
       * program.executableDir(__dirname);
       * // or
       * program.executableDir('subcommands');
       *
       * @param {string} [path]
       * @return {(string|null|Command)}
       */
      executableDir(path2) {
        if (path2 === void 0) return this._executableDir;
        this._executableDir = path2;
        return this;
      }
      /**
       * Return program help documentation.
       *
       * @param {{ error: boolean }} [contextOptions] - pass {error:true} to wrap for stderr instead of stdout
       * @return {string}
       */
      helpInformation(contextOptions) {
        const helper = this.createHelp();
        const context = this._getOutputContext(contextOptions);
        helper.prepareContext({
          error: context.error,
          helpWidth: context.helpWidth,
          outputHasColors: context.hasColors
        });
        const text = helper.formatHelp(this, helper);
        if (context.hasColors) return text;
        return this._outputConfiguration.stripColor(text);
      }
      /**
       * @typedef HelpContext
       * @type {object}
       * @property {boolean} error
       * @property {number} helpWidth
       * @property {boolean} hasColors
       * @property {function} write - includes stripColor if needed
       *
       * @returns {HelpContext}
       * @private
       */
      _getOutputContext(contextOptions) {
        contextOptions = contextOptions || {};
        const error = !!contextOptions.error;
        let baseWrite;
        let hasColors;
        let helpWidth;
        if (error) {
          baseWrite = (str) => this._outputConfiguration.writeErr(str);
          hasColors = this._outputConfiguration.getErrHasColors();
          helpWidth = this._outputConfiguration.getErrHelpWidth();
        } else {
          baseWrite = (str) => this._outputConfiguration.writeOut(str);
          hasColors = this._outputConfiguration.getOutHasColors();
          helpWidth = this._outputConfiguration.getOutHelpWidth();
        }
        const write = (str) => {
          if (!hasColors) str = this._outputConfiguration.stripColor(str);
          return baseWrite(str);
        };
        return { error, write, hasColors, helpWidth };
      }
      /**
       * Output help information for this command.
       *
       * Outputs built-in help, and custom text added using `.addHelpText()`.
       *
       * @param {{ error: boolean } | Function} [contextOptions] - pass {error:true} to write to stderr instead of stdout
       */
      outputHelp(contextOptions) {
        let deprecatedCallback;
        if (typeof contextOptions === "function") {
          deprecatedCallback = contextOptions;
          contextOptions = void 0;
        }
        const outputContext = this._getOutputContext(contextOptions);
        const eventContext = {
          error: outputContext.error,
          write: outputContext.write,
          command: this
        };
        this._getCommandAndAncestors().reverse().forEach((command) => command.emit("beforeAllHelp", eventContext));
        this.emit("beforeHelp", eventContext);
        let helpInformation = this.helpInformation({ error: outputContext.error });
        if (deprecatedCallback) {
          helpInformation = deprecatedCallback(helpInformation);
          if (typeof helpInformation !== "string" && !Buffer.isBuffer(helpInformation)) {
            throw new Error("outputHelp callback must return a string or a Buffer");
          }
        }
        outputContext.write(helpInformation);
        if (this._getHelpOption()?.long) {
          this.emit(this._getHelpOption().long);
        }
        this.emit("afterHelp", eventContext);
        this._getCommandAndAncestors().forEach(
          (command) => command.emit("afterAllHelp", eventContext)
        );
      }
      /**
       * You can pass in flags and a description to customise the built-in help option.
       * Pass in false to disable the built-in help option.
       *
       * @example
       * program.helpOption('-?, --help' 'show help'); // customise
       * program.helpOption(false); // disable
       *
       * @param {(string | boolean)} flags
       * @param {string} [description]
       * @return {Command} `this` command for chaining
       */
      helpOption(flags, description) {
        if (typeof flags === "boolean") {
          if (flags) {
            if (this._helpOption === null) this._helpOption = void 0;
            if (this._defaultOptionGroup) {
              this._initOptionGroup(this._getHelpOption());
            }
          } else {
            this._helpOption = null;
          }
          return this;
        }
        this._helpOption = this.createOption(
          flags ?? "-h, --help",
          description ?? "display help for command"
        );
        if (flags || description) this._initOptionGroup(this._helpOption);
        return this;
      }
      /**
       * Lazy create help option.
       * Returns null if has been disabled with .helpOption(false).
       *
       * @returns {(Option | null)} the help option
       * @package
       */
      _getHelpOption() {
        if (this._helpOption === void 0) {
          this.helpOption(void 0, void 0);
        }
        return this._helpOption;
      }
      /**
       * Supply your own option to use for the built-in help option.
       * This is an alternative to using helpOption() to customise the flags and description etc.
       *
       * @param {Option} option
       * @return {Command} `this` command for chaining
       */
      addHelpOption(option) {
        this._helpOption = option;
        this._initOptionGroup(option);
        return this;
      }
      /**
       * Output help information and exit.
       *
       * Outputs built-in help, and custom text added using `.addHelpText()`.
       *
       * @param {{ error: boolean }} [contextOptions] - pass {error:true} to write to stderr instead of stdout
       */
      help(contextOptions) {
        this.outputHelp(contextOptions);
        let exitCode = Number(process2.exitCode ?? 0);
        if (exitCode === 0 && contextOptions && typeof contextOptions !== "function" && contextOptions.error) {
          exitCode = 1;
        }
        this._exit(exitCode, "commander.help", "(outputHelp)");
      }
      /**
       * // Do a little typing to coordinate emit and listener for the help text events.
       * @typedef HelpTextEventContext
       * @type {object}
       * @property {boolean} error
       * @property {Command} command
       * @property {function} write
       */
      /**
       * Add additional text to be displayed with the built-in help.
       *
       * Position is 'before' or 'after' to affect just this command,
       * and 'beforeAll' or 'afterAll' to affect this command and all its subcommands.
       *
       * @param {string} position - before or after built-in help
       * @param {(string | Function)} text - string to add, or a function returning a string
       * @return {Command} `this` command for chaining
       */
      addHelpText(position, text) {
        const allowedValues = ["beforeAll", "before", "after", "afterAll"];
        if (!allowedValues.includes(position)) {
          throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
        }
        const helpEvent = `${position}Help`;
        this.on(helpEvent, (context) => {
          let helpStr;
          if (typeof text === "function") {
            helpStr = text({ error: context.error, command: context.command });
          } else {
            helpStr = text;
          }
          if (helpStr) {
            context.write(`${helpStr}
`);
          }
        });
        return this;
      }
      /**
       * Output help information if help flags specified
       *
       * @param {Array} args - array of options to search for help flags
       * @private
       */
      _outputHelpIfRequested(args) {
        const helpOption = this._getHelpOption();
        const helpRequested = helpOption && args.find((arg) => helpOption.is(arg));
        if (helpRequested) {
          this.outputHelp();
          this._exit(0, "commander.helpDisplayed", "(outputHelp)");
        }
      }
    };
    function incrementNodeInspectorPort(args) {
      return args.map((arg) => {
        if (!arg.startsWith("--inspect")) {
          return arg;
        }
        let debugOption;
        let debugHost = "127.0.0.1";
        let debugPort = "9229";
        let match;
        if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
          debugOption = match[1];
        } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
          debugOption = match[1];
          if (/^\d+$/.test(match[3])) {
            debugPort = match[3];
          } else {
            debugHost = match[3];
          }
        } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
          debugOption = match[1];
          debugHost = match[3];
          debugPort = match[4];
        }
        if (debugOption && debugPort !== "0") {
          return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
        }
        return arg;
      });
    }
    function useColor() {
      if (process2.env.NO_COLOR || process2.env.FORCE_COLOR === "0" || process2.env.FORCE_COLOR === "false")
        return false;
      if (process2.env.FORCE_COLOR || process2.env.CLICOLOR_FORCE !== void 0)
        return true;
      return void 0;
    }
    exports.Command = Command2;
    exports.useColor = useColor;
  }
});

// node_modules/.pnpm/commander@14.0.3/node_modules/commander/index.js
var require_commander = __commonJS({
  "node_modules/.pnpm/commander@14.0.3/node_modules/commander/index.js"(exports) {
    "use strict";
    var { Argument: Argument2 } = require_argument();
    var { Command: Command2 } = require_command();
    var { CommanderError: CommanderError2, InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var { Help: Help2 } = require_help();
    var { Option: Option2 } = require_option();
    exports.program = new Command2();
    exports.createCommand = (name) => new Command2(name);
    exports.createOption = (flags, description) => new Option2(flags, description);
    exports.createArgument = (name, description) => new Argument2(name, description);
    exports.Command = Command2;
    exports.Option = Option2;
    exports.Argument = Argument2;
    exports.Help = Help2;
    exports.CommanderError = CommanderError2;
    exports.InvalidArgumentError = InvalidArgumentError2;
    exports.InvalidOptionArgumentError = InvalidArgumentError2;
  }
});

// node_modules/.pnpm/picomatch@4.0.7/node_modules/picomatch/lib/constants.js
var require_constants = __commonJS({
  "node_modules/.pnpm/picomatch@4.0.7/node_modules/picomatch/lib/constants.js"(exports, module) {
    "use strict";
    var WIN_SLASH = "\\\\/";
    var WIN_NO_SLASH = `[^${WIN_SLASH}]`;
    var DEFAULT_MAX_EXTGLOB_RECURSION = 0;
    var DOT_LITERAL = "\\.";
    var PLUS_LITERAL = "\\+";
    var QMARK_LITERAL = "\\?";
    var SLASH_LITERAL = "\\/";
    var ONE_CHAR = "(?=.)";
    var QMARK = "[^/]";
    var END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
    var START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
    var DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
    var NO_DOT = `(?!${DOT_LITERAL})`;
    var NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
    var NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
    var NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
    var QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
    var STAR = `${QMARK}*?`;
    var SEP = "/";
    var POSIX_CHARS = {
      DOT_LITERAL,
      PLUS_LITERAL,
      QMARK_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      QMARK,
      END_ANCHOR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOTS,
      NO_DOT_SLASH,
      NO_DOTS_SLASH,
      QMARK_NO_DOT,
      STAR,
      START_ANCHOR,
      SEP
    };
    var WINDOWS_CHARS = {
      ...POSIX_CHARS,
      SLASH_LITERAL: `[${WIN_SLASH}]`,
      QMARK: WIN_NO_SLASH,
      STAR: `${WIN_NO_SLASH}*?`,
      DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
      NO_DOT: `(?!${DOT_LITERAL})`,
      NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
      NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
      START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
      END_ANCHOR: `(?:[${WIN_SLASH}]|$)`,
      SEP: "\\"
    };
    var POSIX_REGEX_SOURCE = {
      __proto__: null,
      alnum: "a-zA-Z0-9",
      alpha: "a-zA-Z",
      ascii: "\\x00-\\x7F",
      blank: " \\t",
      cntrl: "\\x00-\\x1F\\x7F",
      digit: "0-9",
      graph: "\\x21-\\x7E",
      lower: "a-z",
      print: "\\x20-\\x7E ",
      punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
      space: " \\t\\r\\n\\v\\f",
      upper: "A-Z",
      word: "A-Za-z0-9_",
      xdigit: "A-Fa-f0-9"
    };
    module.exports = {
      DEFAULT_MAX_EXTGLOB_RECURSION,
      MAX_LENGTH: 1024 * 64,
      POSIX_REGEX_SOURCE,
      // regular expressions
      REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
      REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
      REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
      REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
      REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
      REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
      // Replace globs with equivalent patterns to reduce parsing time.
      REPLACEMENTS: {
        __proto__: null,
        "***": "*",
        "**/**": "**",
        "**/**/**": "**"
      },
      // Digits
      CHAR_0: 48,
      /* 0 */
      CHAR_9: 57,
      /* 9 */
      // Alphabet chars.
      CHAR_UPPERCASE_A: 65,
      /* A */
      CHAR_LOWERCASE_A: 97,
      /* a */
      CHAR_UPPERCASE_Z: 90,
      /* Z */
      CHAR_LOWERCASE_Z: 122,
      /* z */
      CHAR_LEFT_PARENTHESES: 40,
      /* ( */
      CHAR_RIGHT_PARENTHESES: 41,
      /* ) */
      CHAR_ASTERISK: 42,
      /* * */
      // Non-alphabetic chars.
      CHAR_AMPERSAND: 38,
      /* & */
      CHAR_AT: 64,
      /* @ */
      CHAR_BACKWARD_SLASH: 92,
      /* \ */
      CHAR_CARRIAGE_RETURN: 13,
      /* \r */
      CHAR_CIRCUMFLEX_ACCENT: 94,
      /* ^ */
      CHAR_COLON: 58,
      /* : */
      CHAR_COMMA: 44,
      /* , */
      CHAR_DOT: 46,
      /* . */
      CHAR_DOUBLE_QUOTE: 34,
      /* " */
      CHAR_EQUAL: 61,
      /* = */
      CHAR_EXCLAMATION_MARK: 33,
      /* ! */
      CHAR_FORM_FEED: 12,
      /* \f */
      CHAR_FORWARD_SLASH: 47,
      /* / */
      CHAR_GRAVE_ACCENT: 96,
      /* ` */
      CHAR_HASH: 35,
      /* # */
      CHAR_HYPHEN_MINUS: 45,
      /* - */
      CHAR_LEFT_ANGLE_BRACKET: 60,
      /* < */
      CHAR_LEFT_CURLY_BRACE: 123,
      /* { */
      CHAR_LEFT_SQUARE_BRACKET: 91,
      /* [ */
      CHAR_LINE_FEED: 10,
      /* \n */
      CHAR_NO_BREAK_SPACE: 160,
      /* \u00A0 */
      CHAR_PERCENT: 37,
      /* % */
      CHAR_PLUS: 43,
      /* + */
      CHAR_QUESTION_MARK: 63,
      /* ? */
      CHAR_RIGHT_ANGLE_BRACKET: 62,
      /* > */
      CHAR_RIGHT_CURLY_BRACE: 125,
      /* } */
      CHAR_RIGHT_SQUARE_BRACKET: 93,
      /* ] */
      CHAR_SEMICOLON: 59,
      /* ; */
      CHAR_SINGLE_QUOTE: 39,
      /* ' */
      CHAR_SPACE: 32,
      /*   */
      CHAR_TAB: 9,
      /* \t */
      CHAR_UNDERSCORE: 95,
      /* _ */
      CHAR_VERTICAL_LINE: 124,
      /* | */
      CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
      /* \uFEFF */
      /**
       * Create EXTGLOB_CHARS
       */
      extglobChars(chars) {
        return {
          "!": { type: "negate", open: "(?:(?!(?:", close: `))${chars.STAR})` },
          "?": { type: "qmark", open: "(?:", close: ")?" },
          "+": { type: "plus", open: "(?:", close: ")+" },
          "*": { type: "star", open: "(?:", close: ")*" },
          "@": { type: "at", open: "(?:", close: ")" }
        };
      },
      /**
       * Create GLOB_CHARS
       */
      globChars(win32) {
        return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
      }
    };
  }
});

// node_modules/.pnpm/picomatch@4.0.7/node_modules/picomatch/lib/utils.js
var require_utils = __commonJS({
  "node_modules/.pnpm/picomatch@4.0.7/node_modules/picomatch/lib/utils.js"(exports) {
    "use strict";
    var {
      REGEX_BACKSLASH,
      REGEX_REMOVE_BACKSLASH,
      REGEX_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_GLOBAL
    } = require_constants();
    exports.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
    exports.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
    exports.isRegexChar = (str) => str.length === 1 && exports.hasRegexChars(str);
    exports.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
    exports.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
    exports.isWindows = () => {
      if (typeof navigator !== "undefined" && navigator.platform) {
        const platform = navigator.platform.toLowerCase();
        return platform === "win32" || platform === "windows";
      }
      if (typeof process !== "undefined" && process.platform) {
        return process.platform === "win32";
      }
      return false;
    };
    exports.removeBackslashes = (str) => {
      return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
        return match === "\\" ? "" : match;
      });
    };
    exports.escapeLast = (input, char, lastIdx) => {
      const idx = input.lastIndexOf(char, lastIdx);
      if (idx === -1) return input;
      if (input[idx - 1] === "\\") return exports.escapeLast(input, char, idx - 1);
      return `${input.slice(0, idx)}\\${input.slice(idx)}`;
    };
    exports.removePrefix = (input, state = {}) => {
      let output = input;
      if (output.startsWith("./")) {
        output = output.slice(2);
        state.prefix = "./";
      }
      return output;
    };
    exports.wrapOutput = (input, state = {}, options = {}) => {
      const prepend = options.contains ? "" : "^";
      const append = options.contains ? "" : "$";
      let output = `${prepend}(?:${input})${append}`;
      if (state.negated === true) {
        output = `(?:^(?!${output}).*$)`;
      }
      return output;
    };
    exports.basename = (path, { windows } = {}) => {
      const segs = path.split(windows ? /[\\/]/ : "/");
      const last = segs[segs.length - 1];
      if (last === "") {
        return segs[segs.length - 2];
      }
      return last;
    };
  }
});

// node_modules/.pnpm/picomatch@4.0.7/node_modules/picomatch/lib/scan.js
var require_scan = __commonJS({
  "node_modules/.pnpm/picomatch@4.0.7/node_modules/picomatch/lib/scan.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var {
      CHAR_ASTERISK,
      /* * */
      CHAR_AT,
      /* @ */
      CHAR_BACKWARD_SLASH,
      /* \ */
      CHAR_COMMA,
      /* , */
      CHAR_DOT,
      /* . */
      CHAR_EXCLAMATION_MARK,
      /* ! */
      CHAR_FORWARD_SLASH,
      /* / */
      CHAR_LEFT_CURLY_BRACE,
      /* { */
      CHAR_LEFT_PARENTHESES,
      /* ( */
      CHAR_LEFT_SQUARE_BRACKET,
      /* [ */
      CHAR_PLUS,
      /* + */
      CHAR_QUESTION_MARK,
      /* ? */
      CHAR_RIGHT_CURLY_BRACE,
      /* } */
      CHAR_RIGHT_PARENTHESES,
      /* ) */
      CHAR_RIGHT_SQUARE_BRACKET
      /* ] */
    } = require_constants();
    var isPathSeparator = (code) => {
      return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
    };
    var depth = (token) => {
      if (token.isPrefix !== true) {
        token.depth = token.isGlobstar ? Infinity : 1;
      }
    };
    var scan = (input, options) => {
      const opts = options || {};
      const length = input.length - 1;
      const scanToEnd = opts.parts === true || opts.tokens === true || opts.scanToEnd === true;
      const slashes = [];
      const tokens = [];
      const parts = [];
      let str = input;
      let index = -1;
      let start = 0;
      let lastIndex = 0;
      let isBrace = false;
      let isBracket = false;
      let isGlob = false;
      let isExtglob = false;
      let isGlobstar = false;
      let braceEscaped = false;
      let backslashes = false;
      let negated = false;
      let negatedExtglob = false;
      let finished = false;
      let braces = 0;
      let prev;
      let code;
      let token = { value: "", depth: 0, isGlob: false };
      const eos = () => index >= length;
      const peek = () => str.charCodeAt(index + 1);
      const advance = () => {
        prev = code;
        return str.charCodeAt(++index);
      };
      while (index < length) {
        code = advance();
        let next;
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          code = advance();
          if (code === CHAR_LEFT_CURLY_BRACE) {
            braceEscaped = true;
          }
          continue;
        }
        if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (code === CHAR_LEFT_CURLY_BRACE) {
              braces++;
              continue;
            }
            if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (braceEscaped !== true && code === CHAR_COMMA) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (code === CHAR_RIGHT_CURLY_BRACE) {
              braces--;
              if (braces === 0) {
                braceEscaped = false;
                isBrace = token.isBrace = true;
                finished = true;
                break;
              }
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_FORWARD_SLASH) {
          slashes.push(index);
          tokens.push(token);
          token = { value: "", depth: 0, isGlob: false };
          if (finished === true) continue;
          if (prev === CHAR_DOT && index === start + 1) {
            start += 2;
            continue;
          }
          lastIndex = index + 1;
          continue;
        }
        if (opts.noext !== true) {
          const isExtglobChar = code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK;
          if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
            isGlob = token.isGlob = true;
            isExtglob = token.isExtglob = true;
            finished = true;
            if (code === CHAR_EXCLAMATION_MARK && index === start) {
              negatedExtglob = true;
            }
            if (scanToEnd === true) {
              let parens = 0;
              while (eos() !== true && (code = advance())) {
                if (code === CHAR_BACKWARD_SLASH) {
                  backslashes = token.backslashes = true;
                  advance();
                  continue;
                }
                if (code === CHAR_LEFT_PARENTHESES) {
                  parens++;
                  continue;
                }
                if (code === CHAR_RIGHT_PARENTHESES && --parens === 0) {
                  finished = true;
                  break;
                }
              }
              continue;
            }
            break;
          }
        }
        if (code === CHAR_ASTERISK) {
          if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_QUESTION_MARK) {
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_LEFT_SQUARE_BRACKET) {
          while (eos() !== true && (next = advance())) {
            if (next === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (next === CHAR_RIGHT_SQUARE_BRACKET) {
              isBracket = token.isBracket = true;
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
          negated = token.negated = true;
          start++;
          continue;
        }
        if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
          isGlob = token.isGlob = true;
          if (scanToEnd === true) {
            let parens = 1;
            while (eos() !== true && (code = advance())) {
              if (code === CHAR_BACKWARD_SLASH) {
                backslashes = token.backslashes = true;
                advance();
                continue;
              }
              if (code === CHAR_LEFT_PARENTHESES) {
                parens++;
                continue;
              }
              if (code === CHAR_RIGHT_PARENTHESES && --parens === 0) {
                finished = true;
                break;
              }
            }
            continue;
          }
          break;
        }
        if (isGlob === true) {
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
      }
      if (opts.noext === true) {
        isExtglob = false;
        isGlob = false;
      }
      let base = str;
      let prefix = "";
      let glob = "";
      if (start > 0) {
        prefix = str.slice(0, start);
        str = str.slice(start);
        lastIndex -= start;
      }
      if (base && isGlob === true && lastIndex > 0) {
        base = str.slice(0, lastIndex);
        glob = str.slice(lastIndex);
      } else if (isGlob === true) {
        base = "";
        glob = str;
      } else {
        base = str;
      }
      if (base && base !== "" && base !== "/" && base !== str) {
        if (isPathSeparator(base.charCodeAt(base.length - 1))) {
          base = base.slice(0, -1);
        }
      }
      if (opts.unescape === true) {
        if (glob) glob = utils.removeBackslashes(glob);
        if (base && backslashes === true) {
          base = utils.removeBackslashes(base);
        }
      }
      const state = {
        prefix,
        input,
        start,
        base,
        glob,
        isBrace,
        isBracket,
        isGlob,
        isExtglob,
        isGlobstar,
        negated,
        negatedExtglob
      };
      if (opts.tokens === true) {
        state.maxDepth = 0;
        if (!isPathSeparator(code)) {
          tokens.push(token);
        }
        state.tokens = tokens;
      }
      if (opts.parts === true || opts.tokens === true) {
        let prevIndex;
        for (let idx = 0; idx < slashes.length; idx++) {
          const n2 = prevIndex !== void 0 ? prevIndex + 1 : start;
          const i = slashes[idx];
          const value2 = input.slice(n2, i);
          if (opts.tokens) {
            if (idx === 0 && start !== 0) {
              tokens[idx].isPrefix = true;
              tokens[idx].value = prefix;
            } else {
              tokens[idx].value = value2;
            }
            depth(tokens[idx]);
            state.maxDepth += tokens[idx].depth;
          }
          if (i >= start) {
            parts.push(value2);
            prevIndex = i;
          }
        }
        const n = prevIndex !== void 0 ? prevIndex + 1 : start;
        const value = input.slice(n);
        parts.push(value);
        if (opts.tokens && prevIndex && prevIndex + 1 < input.length) {
          tokens[tokens.length - 1].value = value;
          depth(tokens[tokens.length - 1]);
          state.maxDepth += tokens[tokens.length - 1].depth;
        }
        state.slashes = slashes;
        state.parts = parts;
      }
      return state;
    };
    module.exports = scan;
  }
});

// node_modules/.pnpm/picomatch@4.0.7/node_modules/picomatch/lib/parse.js
var require_parse = __commonJS({
  "node_modules/.pnpm/picomatch@4.0.7/node_modules/picomatch/lib/parse.js"(exports, module) {
    "use strict";
    var constants = require_constants();
    var utils = require_utils();
    var {
      MAX_LENGTH,
      POSIX_REGEX_SOURCE,
      REGEX_NON_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_BACKREF,
      REPLACEMENTS
    } = constants;
    var expandRange = (args, options) => {
      if (typeof options.expandRange === "function") {
        return options.expandRange(...args, options);
      }
      args.sort();
      const value = `[${args.join("-")}]`;
      try {
        new RegExp(value);
      } catch (ex) {
        return args.map((v) => utils.escapeRegex(v)).join("..");
      }
      return value;
    };
    var syntaxError = (type, char) => {
      return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
    };
    var splitTopLevel = (input) => {
      const parts = [];
      let bracket = 0;
      let paren = 0;
      let quote = 0;
      let value = "";
      let escaped = false;
      for (const ch of input) {
        if (escaped === true) {
          value += ch;
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          value += ch;
          escaped = true;
          continue;
        }
        if (ch === '"') {
          quote = quote === 1 ? 0 : 1;
          value += ch;
          continue;
        }
        if (quote === 0) {
          if (ch === "[") {
            bracket++;
          } else if (ch === "]" && bracket > 0) {
            bracket--;
          } else if (bracket === 0) {
            if (ch === "(") {
              paren++;
            } else if (ch === ")" && paren > 0) {
              paren--;
            } else if (ch === "|" && paren === 0) {
              parts.push(value);
              value = "";
              continue;
            }
          }
        }
        value += ch;
      }
      parts.push(value);
      return parts;
    };
    var isPlainBranch = (branch) => {
      let escaped = false;
      for (const ch of branch) {
        if (escaped === true) {
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          continue;
        }
        if (/[?*+@!()[\]{}]/.test(ch)) {
          return false;
        }
      }
      return true;
    };
    var normalizeSimpleBranch = (branch) => {
      let value = branch.trim();
      let changed = true;
      while (changed === true) {
        changed = false;
        if (/^@\([^\\()[\]{}|]+\)$/.test(value)) {
          value = value.slice(2, -1);
          changed = true;
        }
      }
      if (!isPlainBranch(value)) {
        return;
      }
      return value.replace(/\\(.)/g, "$1");
    };
    var hasRepeatedCharPrefixOverlap = (branches) => {
      const values = branches.map(normalizeSimpleBranch).filter(Boolean);
      for (let i = 0; i < values.length; i++) {
        for (let j = i + 1; j < values.length; j++) {
          const a = values[i];
          const b = values[j];
          const char = a[0];
          if (!char || a !== char.repeat(a.length) || b !== char.repeat(b.length)) {
            continue;
          }
          if (a === b || a.startsWith(b) || b.startsWith(a)) {
            return true;
          }
        }
      }
      return false;
    };
    var parseRepeatedExtglob = (pattern, requireEnd = true) => {
      if (pattern[0] !== "+" && pattern[0] !== "*" || pattern[1] !== "(") {
        return;
      }
      let bracket = 0;
      let paren = 0;
      let quote = 0;
      let escaped = false;
      for (let i = 1; i < pattern.length; i++) {
        const ch = pattern[i];
        if (escaped === true) {
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          continue;
        }
        if (ch === '"') {
          quote = quote === 1 ? 0 : 1;
          continue;
        }
        if (quote === 1) {
          continue;
        }
        if (ch === "[") {
          bracket++;
          continue;
        }
        if (ch === "]" && bracket > 0) {
          bracket--;
          continue;
        }
        if (bracket > 0) {
          continue;
        }
        if (ch === "(") {
          paren++;
          continue;
        }
        if (ch === ")") {
          paren--;
          if (paren === 0) {
            if (requireEnd === true && i !== pattern.length - 1) {
              return;
            }
            return {
              type: pattern[0],
              body: pattern.slice(2, i),
              end: i
            };
          }
        }
      }
    };
    var buildCharClassStar = (chars) => {
      const source = chars.length === 1 ? utils.escapeRegex(chars[0]) : `[${chars.map((ch) => utils.escapeRegex(ch)).join("")}]`;
      return `${source}*`;
    };
    var getStarExtglobSequenceChars = (pattern) => {
      let index = 0;
      const chars = [];
      while (index < pattern.length) {
        const match = parseRepeatedExtglob(pattern.slice(index), false);
        if (!match || match.type !== "*") {
          return;
        }
        const branches = splitTopLevel(match.body).map((branch2) => branch2.trim());
        if (branches.length !== 1) {
          return;
        }
        const branch = normalizeSimpleBranch(branches[0]);
        if (!branch || branch.length !== 1) {
          return;
        }
        chars.push(branch);
        index += match.end + 1;
      }
      if (chars.length < 1) {
        return;
      }
      return chars;
    };
    var repeatedExtglobRecursion = (pattern) => {
      let depth = 0;
      let value = pattern.trim();
      let match = parseRepeatedExtglob(value);
      while (match) {
        depth++;
        value = match.body.trim();
        match = parseRepeatedExtglob(value);
      }
      return depth;
    };
    var analyzeRepeatedExtglob = (body, options) => {
      if (options.maxExtglobRecursion === false) {
        return { risky: false };
      }
      const max = typeof options.maxExtglobRecursion === "number" ? options.maxExtglobRecursion : constants.DEFAULT_MAX_EXTGLOB_RECURSION;
      const branches = splitTopLevel(body).map((branch) => branch.trim());
      if (branches.length > 1) {
        if (branches.some((branch) => branch === "") || branches.some((branch) => /^[*?]+$/.test(branch)) || hasRepeatedCharPrefixOverlap(branches)) {
          return { risky: true };
        }
      }
      const safeChars = [];
      let sawStarSequence = false;
      let combinable = true;
      for (const branch of branches) {
        const chars = getStarExtglobSequenceChars(branch);
        if (chars) {
          sawStarSequence = true;
          safeChars.push(...chars);
          continue;
        }
        const literal = normalizeSimpleBranch(branch);
        if (literal && literal.length === 1) {
          safeChars.push(literal);
          continue;
        }
        combinable = false;
        if (repeatedExtglobRecursion(branch) > max) {
          return { risky: true };
        }
      }
      if (sawStarSequence) {
        return combinable ? { risky: true, safeOutput: buildCharClassStar([...new Set(safeChars)]) } : { risky: true };
      }
      return { risky: false };
    };
    var parse = (input, options) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected a string");
      }
      input = REPLACEMENTS[input] || input;
      const opts = { ...options };
      const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      let len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      const bos = { type: "bos", value: "", output: opts.prepend || "" };
      const tokens = [bos];
      const capture = opts.capture ? "" : "?:";
      const PLATFORM_CHARS = constants.globChars(opts.windows);
      const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
      const {
        DOT_LITERAL,
        PLUS_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOT_SLASH,
        NO_DOTS_SLASH,
        QMARK,
        QMARK_NO_DOT,
        STAR,
        START_ANCHOR
      } = PLATFORM_CHARS;
      const globstar = (opts2) => {
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const nodot = opts.dot ? "" : NO_DOT;
      const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
      let star = opts.bash === true ? globstar(opts) : STAR;
      if (opts.capture) {
        star = `(${star})`;
      }
      if (typeof opts.noext === "boolean") {
        opts.noextglob = opts.noext;
      }
      const state = {
        input,
        index: -1,
        start: 0,
        dot: opts.dot === true,
        consumed: "",
        output: "",
        prefix: "",
        backtrack: false,
        negated: false,
        brackets: 0,
        braces: 0,
        parens: 0,
        quotes: 0,
        globstar: false,
        tokens
      };
      input = utils.removePrefix(input, state);
      len = input.length;
      const extglobs = [];
      const braces = [];
      const stack = [];
      let prev = bos;
      let value;
      const eos = () => state.index === len - 1;
      const peek = state.peek = (n = 1) => input[state.index + n];
      const advance = state.advance = () => input[++state.index] || "";
      const remaining = () => input.slice(state.index + 1);
      const consume = (value2 = "", num = 0) => {
        state.consumed += value2;
        state.index += num;
      };
      const append = (token) => {
        state.output += token.output != null ? token.output : token.value;
        consume(token.value);
      };
      const negate = () => {
        let count2 = 1;
        while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
          advance();
          state.start++;
          count2++;
        }
        if (count2 % 2 === 0) {
          return false;
        }
        state.negated = true;
        state.start++;
        return true;
      };
      const increment = (type) => {
        state[type]++;
        stack.push(type);
      };
      const decrement = (type) => {
        state[type]--;
        stack.pop();
      };
      const push = (tok) => {
        if (prev.type === "globstar") {
          const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
          const isExtglob = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
          if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
            state.output = state.output.slice(0, -prev.output.length);
            prev.type = "star";
            prev.value = "*";
            prev.output = star;
            state.output += prev.output;
          }
        }
        if (extglobs.length && tok.type !== "paren") {
          extglobs[extglobs.length - 1].inner += tok.value;
        }
        if (tok.value || tok.output) append(tok);
        if (prev && prev.type === "text" && tok.type === "text") {
          prev.output = (prev.output || prev.value) + tok.value;
          prev.value += tok.value;
          return;
        }
        tok.prev = prev;
        tokens.push(tok);
        prev = tok;
      };
      const extglobOpen = (type, value2) => {
        const token = { ...EXTGLOB_CHARS[value2], conditions: 1, inner: "" };
        token.prev = prev;
        token.parens = state.parens;
        token.output = state.output;
        token.startIndex = state.index;
        token.tokensIndex = tokens.length;
        const output = (opts.capture ? "(" : "") + token.open;
        increment("parens");
        push({ type, value: value2, output: state.output ? "" : ONE_CHAR });
        push({ type: "paren", extglob: true, value: advance(), output });
        extglobs.push(token);
      };
      const extglobClose = (token) => {
        const literal = input.slice(token.startIndex, state.index + 1);
        const body = input.slice(token.startIndex + 2, state.index);
        const analysis = analyzeRepeatedExtglob(body, opts);
        if ((token.type === "plus" || token.type === "star") && analysis.risky) {
          const safeOutput = analysis.safeOutput ? (token.output ? "" : ONE_CHAR) + (opts.capture ? `(${analysis.safeOutput})` : analysis.safeOutput) : void 0;
          const open = tokens[token.tokensIndex];
          open.type = "text";
          open.value = literal;
          open.output = safeOutput || utils.escapeRegex(literal);
          for (let i = token.tokensIndex + 1; i < tokens.length; i++) {
            tokens[i].value = "";
            tokens[i].output = "";
            delete tokens[i].suffix;
          }
          state.output = token.output + open.output;
          state.backtrack = true;
          push({ type: "paren", extglob: true, value, output: "" });
          decrement("parens");
          return;
        }
        let output = token.close + (opts.capture ? ")" : "");
        let rest;
        if (token.type === "negate") {
          let extglobStar = star;
          if (token.inner && token.inner.length > 1 && token.inner.includes("/")) {
            extglobStar = globstar(opts);
          }
          if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
            output = token.close = `)$))${extglobStar}`;
          }
          if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
            const expression = parse(rest, { ...options, fastpaths: false }).output;
            output = token.close = `)${expression})${extglobStar})`;
          }
          if (token.prev.type === "bos") {
            state.negatedExtglob = true;
          }
        }
        push({ type: "paren", extglob: true, value, output });
        decrement("parens");
      };
      if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
        let backslashes = false;
        let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
          if (first === "\\") {
            backslashes = true;
            return m;
          }
          if (first === "?") {
            if (esc) {
              return esc + first + (rest ? QMARK.repeat(rest.length) : "");
            }
            if (index === 0) {
              return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
            }
            return QMARK.repeat(chars.length);
          }
          if (first === ".") {
            return DOT_LITERAL.repeat(chars.length);
          }
          if (first === "*") {
            if (esc) {
              return esc + first + (rest ? star : "");
            }
            return star;
          }
          return esc ? m : `\\${m}`;
        });
        if (backslashes === true) {
          if (opts.unescape === true) {
            output = output.replace(/\\/g, "");
          } else {
            output = output.replace(/\\+/g, (m) => {
              return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
            });
          }
        }
        if (output === input && opts.contains === true) {
          state.output = input;
          return state;
        }
        state.output = utils.wrapOutput(output, state, options);
        return state;
      }
      while (!eos()) {
        value = advance();
        if (value === "\0") {
          continue;
        }
        if (value === "\\") {
          const next = peek();
          if (next === "/" && opts.bash !== true) {
            continue;
          }
          if (next === "." || next === ";") {
            continue;
          }
          if (!next) {
            value += "\\";
            push({ type: "text", value });
            continue;
          }
          const match = /^\\+/.exec(remaining());
          let slashes = 0;
          if (match && match[0].length > 2) {
            slashes = match[0].length;
            state.index += slashes;
            if (slashes % 2 !== 0) {
              value += "\\";
            }
          }
          if (opts.unescape === true) {
            value = advance();
          } else {
            value += advance();
          }
          if (state.brackets === 0) {
            push({ type: "text", value });
            continue;
          }
        }
        if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
          if (opts.posix !== false && value === ":") {
            const inner = prev.value.slice(1);
            if (inner.includes("[")) {
              prev.posix = true;
              if (inner.includes(":")) {
                const idx = prev.value.lastIndexOf("[");
                const pre = prev.value.slice(0, idx);
                const rest2 = prev.value.slice(idx + 2);
                const posix = POSIX_REGEX_SOURCE[rest2];
                if (posix) {
                  prev.value = pre + posix;
                  state.backtrack = true;
                  advance();
                  if (!bos.output && tokens.indexOf(prev) === 1) {
                    bos.output = ONE_CHAR;
                  }
                  continue;
                }
              }
            }
          }
          if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") {
            value = `\\${value}`;
          }
          if (value === "]" && (prev.value === "[" || prev.value === "[^")) {
            value = `\\${value}`;
          }
          if (opts.posix === true && value === "!" && prev.value === "[") {
            value = "^";
          }
          prev.value += value;
          append({ value });
          continue;
        }
        if (state.quotes === 1 && value !== '"') {
          value = utils.escapeRegex(value);
          prev.value += value;
          append({ value });
          continue;
        }
        if (value === '"') {
          state.quotes = state.quotes === 1 ? 0 : 1;
          if (opts.keepQuotes === true) {
            push({ type: "text", value });
          }
          continue;
        }
        if (value === "(") {
          increment("parens");
          push({ type: "paren", value });
          continue;
        }
        if (value === ")") {
          if (state.parens === 0 && opts.strictBrackets === true) {
            throw new SyntaxError(syntaxError("opening", "("));
          }
          const extglob = extglobs[extglobs.length - 1];
          if (extglob && state.parens === extglob.parens + 1) {
            extglobClose(extglobs.pop());
            continue;
          }
          push({ type: "paren", value, output: state.parens ? ")" : "\\)" });
          decrement("parens");
          continue;
        }
        if (value === "[") {
          if (opts.nobracket === true || !remaining().includes("]")) {
            if (opts.nobracket !== true && opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("closing", "]"));
            }
            value = `\\${value}`;
          } else {
            increment("brackets");
          }
          push({ type: "bracket", value });
          continue;
        }
        if (value === "]") {
          if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
            push({ type: "text", value, output: `\\${value}` });
            continue;
          }
          if (state.brackets === 0) {
            if (opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("opening", "["));
            }
            push({ type: "text", value, output: `\\${value}` });
            continue;
          }
          decrement("brackets");
          const prevValue = prev.value.slice(1);
          if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) {
            value = `/${value}`;
          }
          prev.value += value;
          append({ value });
          if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
            continue;
          }
          const escaped = utils.escapeRegex(prev.value);
          state.output = state.output.slice(0, -prev.value.length);
          if (opts.literalBrackets === true) {
            state.output += escaped;
            prev.value = escaped;
            continue;
          }
          prev.value = `(${capture}${escaped}|${prev.value})`;
          state.output += prev.value;
          continue;
        }
        if (value === "{" && opts.nobrace !== true) {
          increment("braces");
          const open = {
            type: "brace",
            value,
            output: "(",
            outputIndex: state.output.length,
            tokensIndex: state.tokens.length
          };
          braces.push(open);
          push(open);
          continue;
        }
        if (value === "}") {
          const brace = braces[braces.length - 1];
          if (opts.nobrace === true || !brace) {
            push({ type: "text", value, output: value });
            continue;
          }
          let output = ")";
          if (brace.dots === true) {
            const arr = tokens.slice();
            const range = [];
            for (let i = arr.length - 1; i >= 0; i--) {
              tokens.pop();
              if (arr[i].type === "brace") {
                break;
              }
              if (arr[i].type !== "dots") {
                range.unshift(arr[i].value);
              }
            }
            output = expandRange(range, opts);
            state.backtrack = true;
          }
          if (brace.comma !== true && brace.dots !== true) {
            const out = state.output.slice(0, brace.outputIndex);
            const toks = state.tokens.slice(brace.tokensIndex);
            brace.value = brace.output = "\\{";
            value = output = "\\}";
            state.output = out;
            for (const t of toks) {
              state.output += t.output || t.value;
            }
          }
          push({ type: "brace", value, output });
          decrement("braces");
          braces.pop();
          continue;
        }
        if (value === "|") {
          if (extglobs.length > 0) {
            extglobs[extglobs.length - 1].conditions++;
          }
          push({ type: "text", value });
          continue;
        }
        if (value === ",") {
          let output = value;
          const brace = braces[braces.length - 1];
          if (brace && stack[stack.length - 1] === "braces") {
            brace.comma = true;
            output = "|";
          }
          push({ type: "comma", value, output });
          continue;
        }
        if (value === "/") {
          if (prev.type === "dot" && state.index === state.start + 1) {
            state.start = state.index + 1;
            state.consumed = "";
            state.output = "";
            tokens.pop();
            prev = bos;
            continue;
          }
          push({ type: "slash", value, output: SLASH_LITERAL });
          continue;
        }
        if (value === ".") {
          if (state.braces > 0 && prev.type === "dot") {
            if (prev.value === ".") prev.output = DOT_LITERAL;
            const brace = braces[braces.length - 1];
            prev.type = "dots";
            prev.output += value;
            prev.value += value;
            brace.dots = true;
            continue;
          }
          if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
            push({ type: "text", value, output: DOT_LITERAL });
            continue;
          }
          push({ type: "dot", value, output: DOT_LITERAL });
          continue;
        }
        if (value === "?") {
          const isGroup = prev && prev.value === "(";
          if (!isGroup && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            extglobOpen("qmark", value);
            continue;
          }
          if (prev && prev.type === "paren") {
            const next = peek();
            let output = value;
            if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) {
              output = `\\${value}`;
            }
            push({ type: "text", value, output });
            continue;
          }
          if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
            push({ type: "qmark", value, output: QMARK_NO_DOT });
            continue;
          }
          push({ type: "qmark", value, output: QMARK });
          continue;
        }
        if (value === "!") {
          if (opts.noextglob !== true && peek() === "(") {
            if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
              extglobOpen("negate", value);
              continue;
            }
          }
          if (opts.nonegate !== true && state.index === 0) {
            negate();
            continue;
          }
        }
        if (value === "+") {
          if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            extglobOpen("plus", value);
            continue;
          }
          if (prev && prev.value === "(" || opts.regex === false) {
            push({ type: "plus", value, output: PLUS_LITERAL });
            continue;
          }
          if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
            push({ type: "plus", value });
            continue;
          }
          push({ type: "plus", value: PLUS_LITERAL });
          continue;
        }
        if (value === "@") {
          if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            push({ type: "at", extglob: true, value, output: "" });
            continue;
          }
          push({ type: "text", value });
          continue;
        }
        if (value !== "*") {
          if (value === "$" || value === "^") {
            value = `\\${value}`;
          }
          const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
          if (match) {
            value += match[0];
            state.index += match[0].length;
          }
          push({ type: "text", value });
          continue;
        }
        if (prev && (prev.type === "globstar" || prev.star === true)) {
          prev.type = "star";
          prev.star = true;
          prev.value += value;
          prev.output = star;
          state.backtrack = true;
          state.globstar = true;
          consume(value);
          continue;
        }
        let rest = remaining();
        if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
          extglobOpen("star", value);
          continue;
        }
        if (prev.type === "star") {
          if (opts.noglobstar === true) {
            consume(value);
            continue;
          }
          const prior = prev.prev;
          const before = prior.prev;
          const isStart = prior.type === "slash" || prior.type === "bos";
          const afterStar = before && (before.type === "star" || before.type === "globstar");
          if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
            push({ type: "star", value, output: "" });
            continue;
          }
          const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
          const isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
          if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
            push({ type: "star", value, output: "" });
            continue;
          }
          while (rest.slice(0, 3) === "/**") {
            const after = input[state.index + 4];
            if (after && after !== "/") {
              break;
            }
            rest = rest.slice(3);
            consume("/**", 3);
          }
          const isEnd = eos() || state.parens > 0 && rest === ")".repeat(state.parens) && !extglobs.some((extglob) => extglob.type === "negate");
          if (prior.type === "bos" && eos()) {
            prev.type = "globstar";
            prev.value += value;
            prev.output = globstar(opts);
            state.output = prev.output;
            state.globstar = true;
            consume(value);
            continue;
          }
          if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && isEnd) {
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = "globstar";
            prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
            prev.value += value;
            state.globstar = true;
            state.output += prior.output + prev.output;
            consume(value);
            continue;
          }
          if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
            const end = rest[1] !== void 0 ? "|$" : "";
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = "globstar";
            prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
            prev.value += value;
            state.output += prior.output + prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: "slash", value: "/", output: "" });
            continue;
          }
          if (prior.type === "bos" && rest[0] === "/") {
            prev.type = "globstar";
            prev.value += value;
            prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
            state.output = prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: "slash", value: "/", output: "" });
            continue;
          }
          state.output = state.output.slice(0, -prev.output.length);
          prev.type = "globstar";
          prev.output = globstar(opts);
          prev.value += value;
          state.output += prev.output;
          state.globstar = true;
          consume(value);
          continue;
        }
        const token = { type: "star", value, output: star };
        if (opts.bash === true) {
          token.output = ".*?";
          if (prev.type === "bos" || prev.type === "slash") {
            token.output = nodot + token.output;
          }
          push(token);
          continue;
        }
        if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
          token.output = value;
          push(token);
          continue;
        }
        if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
          if (prev.type === "dot") {
            state.output += NO_DOT_SLASH;
            prev.output += NO_DOT_SLASH;
          } else if (opts.dot === true) {
            state.output += NO_DOTS_SLASH;
            prev.output += NO_DOTS_SLASH;
          } else {
            state.output += nodot;
            prev.output += nodot;
          }
          if (peek() !== "*") {
            state.output += ONE_CHAR;
            prev.output += ONE_CHAR;
          }
        }
        push(token);
      }
      while (state.brackets > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
        state.output = utils.escapeLast(state.output, "[");
        decrement("brackets");
      }
      while (state.parens > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
        state.output = utils.escapeLast(state.output, "(");
        decrement("parens");
      }
      while (state.braces > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
        state.output = utils.escapeLast(state.output, "{");
        decrement("braces");
      }
      if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) {
        push({ type: "maybe_slash", value: "", output: `${SLASH_LITERAL}?` });
      }
      if (state.backtrack === true) {
        state.output = "";
        for (const token of state.tokens) {
          state.output += token.output != null ? token.output : token.value;
          if (token.suffix) {
            state.output += token.suffix;
          }
        }
      }
      return state;
    };
    parse.fastpaths = (input, options) => {
      const opts = { ...options };
      const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      const len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      input = REPLACEMENTS[input] || input;
      const {
        DOT_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOTS,
        NO_DOTS_SLASH,
        STAR,
        START_ANCHOR
      } = constants.globChars(opts.windows);
      const nodot = opts.dot ? NO_DOTS : NO_DOT;
      const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
      const capture = opts.capture ? "" : "?:";
      const state = { negated: false, prefix: "" };
      let star = opts.bash === true ? ".*?" : STAR;
      if (opts.capture) {
        star = `(${star})`;
      }
      const globstar = (opts2) => {
        if (opts2.noglobstar === true) return star;
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const create = (str) => {
        switch (str) {
          case "*":
            return `${nodot}${ONE_CHAR}${star}`;
          case ".*":
            return `${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "*.*":
            return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "*/*":
            return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
          case "**":
            return nodot + globstar(opts);
          case "**/*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
          case "**/*.*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "**/.*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
          default: {
            const match = /^(.*?)\.(\w+)$/.exec(str);
            if (!match) return;
            const source2 = create(match[1]);
            if (!source2) return;
            return source2 + DOT_LITERAL + match[2];
          }
        }
      };
      const output = utils.removePrefix(input, state);
      let source = create(output);
      if (source && opts.strictSlashes !== true) {
        source += `${SLASH_LITERAL}?`;
      }
      return source;
    };
    module.exports = parse;
  }
});

// node_modules/.pnpm/picomatch@4.0.7/node_modules/picomatch/lib/picomatch.js
var require_picomatch = __commonJS({
  "node_modules/.pnpm/picomatch@4.0.7/node_modules/picomatch/lib/picomatch.js"(exports, module) {
    "use strict";
    var scan = require_scan();
    var parse = require_parse();
    var utils = require_utils();
    var constants = require_constants();
    var isObject5 = (val) => val && typeof val === "object" && !Array.isArray(val);
    var picomatch5 = (glob, options, returnState = false) => {
      if (Array.isArray(glob)) {
        const fns = glob.map((input) => picomatch5(input, options, returnState));
        const arrayMatcher = (str) => {
          for (const isMatch of fns) {
            const state2 = isMatch(str);
            if (state2) return state2;
          }
          return false;
        };
        return arrayMatcher;
      }
      const isState = isObject5(glob) && glob.tokens && glob.input;
      if (glob === "" || typeof glob !== "string" && !isState) {
        throw new TypeError("Expected pattern to be a non-empty string");
      }
      const opts = options || {};
      const posix = opts.windows;
      const regex = isState ? picomatch5.compileRe(glob, options) : picomatch5.makeRe(glob, options, false, true);
      const state = regex.state;
      delete regex.state;
      let isIgnored = () => false;
      if (opts.ignore) {
        const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
        isIgnored = picomatch5(opts.ignore, ignoreOpts, returnState);
      }
      const matcher = (input, returnObject = false) => {
        const { isMatch, match, output } = picomatch5.test(input, regex, options, { glob, posix });
        const result = { glob, state, regex, posix, input, output, match, isMatch };
        if (typeof opts.onResult === "function") {
          opts.onResult(result);
        }
        if (isMatch === false) {
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (isIgnored(input)) {
          if (typeof opts.onIgnore === "function") {
            opts.onIgnore(result);
          }
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (typeof opts.onMatch === "function") {
          opts.onMatch(result);
        }
        return returnObject ? result : true;
      };
      if (returnState) {
        matcher.state = state;
      }
      return matcher;
    };
    picomatch5.test = (input, regex, options, { glob, posix } = {}) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected input to be a string");
      }
      if (input === "") {
        return { isMatch: false, output: "" };
      }
      const opts = options || {};
      const format = opts.format || (posix ? utils.toPosixSlashes : null);
      let match = input === glob;
      let output = match && format ? format(input) : input;
      if (match === false) {
        output = format ? format(input) : input;
        match = output === glob;
      }
      if (match === false || opts.capture === true) {
        if (opts.matchBase === true || opts.basename === true) {
          match = picomatch5.matchBase(input, regex, options, posix);
        } else {
          match = regex.exec(output);
        }
      }
      return { isMatch: Boolean(match), match, output };
    };
    picomatch5.matchBase = (input, glob, options, posix = options && options.windows) => {
      const regex = glob instanceof RegExp ? glob : picomatch5.makeRe(glob, options);
      return regex.test(utils.basename(input, { windows: posix }));
    };
    picomatch5.isMatch = (str, patterns, options) => picomatch5(patterns, options)(str);
    picomatch5.parse = (pattern, options) => {
      if (Array.isArray(pattern)) return pattern.map((p) => picomatch5.parse(p, options));
      return parse(pattern, { ...options, fastpaths: false });
    };
    picomatch5.scan = (input, options) => scan(input, options);
    picomatch5.compileRe = (state, options, returnOutput = false, returnState = false) => {
      if (returnOutput === true) {
        return state.output;
      }
      const opts = options || {};
      const prepend = opts.contains ? "" : "^";
      const append = opts.contains ? "" : "$";
      let source = `${prepend}(?:${state.output})${append}`;
      if (state && state.negated === true) {
        source = `^(?!${source}).*$`;
      }
      const regex = picomatch5.toRegex(source, options);
      if (returnState === true) {
        regex.state = state;
      }
      return regex;
    };
    picomatch5.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
      if (!input || typeof input !== "string") {
        throw new TypeError("Expected a non-empty string");
      }
      let parsed = { negated: false, fastpaths: true };
      if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) {
        parsed.output = parse.fastpaths(input, options);
      }
      if (!parsed.output) {
        parsed = parse(input, options);
      }
      return picomatch5.compileRe(parsed, options, returnOutput, returnState);
    };
    picomatch5.toRegex = (source, options) => {
      try {
        const opts = options || {};
        return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
      } catch (err) {
        if (options && options.debug === true) throw err;
        return /$^/;
      }
    };
    picomatch5.constants = constants;
    module.exports = picomatch5;
  }
});

// node_modules/.pnpm/picomatch@4.0.7/node_modules/picomatch/index.js
var require_picomatch2 = __commonJS({
  "node_modules/.pnpm/picomatch@4.0.7/node_modules/picomatch/index.js"(exports, module) {
    "use strict";
    var pico = require_picomatch();
    var utils = require_utils();
    function picomatch5(glob, options, returnState = false) {
      if (options && (options.windows === null || options.windows === void 0)) {
        options = { ...options, windows: utils.isWindows() };
      }
      return pico(glob, options, returnState);
    }
    Object.assign(picomatch5, pico);
    module.exports = picomatch5;
  }
});

// src/bin.ts
var import_picocolors2 = __toESM(require_picocolors(), 1);
import { createInterface } from "readline/promises";

// src/cli.ts
import {
  appendFileSync,
  mkdirSync as mkdirSync3,
  readFileSync as readFileSync8,
  writeFileSync as writeFileSync3
} from "fs";
import { dirname as dirname3, resolve as resolve7 } from "path";

// node_modules/.pnpm/commander@14.0.3/node_modules/commander/esm.mjs
var import_index = __toESM(require_commander(), 1);
var {
  program,
  createCommand,
  createArgument,
  createOption,
  CommanderError,
  InvalidArgumentError,
  InvalidOptionArgumentError,
  // deprecated old name
  Command,
  Argument,
  Option,
  Help
} = import_index.default;

// src/cli.ts
var import_picocolors = __toESM(require_picocolors(), 1);

// package.json
var package_default = {
  name: "test-guard",
  version: "0.3.0",
  description: "Detect and block AI coding agents from deleting, skipping or weakening tests.",
  keywords: [
    "testing",
    "ai",
    "agents",
    "claude-code",
    "codex",
    "git-hooks",
    "github-action",
    "test-integrity",
    "guard"
  ],
  homepage: "https://github.com/kwangtaeko/test-guard#readme",
  bugs: {
    url: "https://github.com/kwangtaeko/test-guard/issues"
  },
  repository: {
    type: "git",
    url: "git+https://github.com/kwangtaeko/test-guard.git"
  },
  license: "MIT",
  author: "tonygwangsk",
  type: "module",
  bin: {
    "test-guard": "dist/cli.js"
  },
  files: [
    "dist",
    ".claude-plugin",
    "hooks",
    "skills",
    "README.md",
    "README.ko.md",
    "CHANGELOG.md",
    "LICENSE"
  ],
  engines: {
    node: ">=20"
  },
  packageManager: "pnpm@10.33.2",
  scripts: {
    build: "tsup",
    prepublishOnly: "npm run build",
    typecheck: "tsc --noEmit",
    lint: "biome check .",
    test: "vitest run"
  },
  devDependencies: {
    "@biomejs/biome": "^2.5.15",
    "@types/node": "^20.19.43",
    "@types/picomatch": "^4.0.3",
    commander: "^14.0.3",
    picocolors: "^1.1.1",
    picomatch: "^4.0.7",
    tsup: "^8.5.1",
    typescript: "^7.0.2",
    vitest: "^4.1.11"
  }
};

// src/adapters/claude-code.ts
import { existsSync as existsSync5, readFileSync as readFileSync4 } from "fs";
import { resolve as resolve4 } from "path";

// src/hook-io/common.ts
var HookInputError = class extends Error {
};
function parseHookInput(text) {
  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new HookInputError("stdin is not valid JSON");
  }
  if (!isObject(raw) || typeof raw.cwd !== "string") {
    throw new HookInputError('stdin JSON has no "cwd"');
  }
  const sessionId = typeof raw.session_id === "string" && raw.session_id !== "" ? raw.session_id : void 0;
  if (raw.hook_event_name === "PreToolUse") {
    if (typeof raw.tool_name !== "string" || !isObject(raw.tool_input)) {
      throw new HookInputError("PreToolUse input has no tool_name/tool_input");
    }
    return {
      event: "PreToolUse",
      cwd: raw.cwd,
      sessionId,
      toolName: raw.tool_name,
      toolInput: raw.tool_input
    };
  }
  if (raw.hook_event_name === "Stop") {
    return {
      event: "Stop",
      cwd: raw.cwd,
      sessionId,
      stopHookActive: raw.stop_hook_active === true
    };
  }
  throw new HookInputError(
    `unsupported hook event: ${String(raw.hook_event_name)}`
  );
}
function denyToolUse(reason) {
  return json({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: reason
    }
  });
}
function blockStop(reason) {
  return json({ decision: "block", reason });
}
function notifyUser(message) {
  return json({ systemMessage: message });
}
function json(value) {
  return `${JSON.stringify(value)}
`;
}
function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// src/hook-io/claude-code.ts
function fileEdit(input) {
  const { toolName, toolInput: t } = input;
  if (typeof t.file_path !== "string") return null;
  if (toolName === "Write" && typeof t.content === "string") {
    return { kind: "write", filePath: t.file_path, content: t.content };
  }
  if (toolName === "Edit" && typeof t.old_string === "string" && typeof t.new_string === "string") {
    return {
      kind: "edit",
      filePath: t.file_path,
      oldString: t.old_string,
      newString: t.new_string,
      replaceAll: t.replace_all === true
    };
  }
  return null;
}
function shellCommand(input) {
  if (input.toolName !== "Bash" && input.toolName !== "PowerShell") {
    return null;
  }
  return typeof input.toolInput.command === "string" ? input.toolInput.command : null;
}

// src/adapters/agent.ts
var import_picomatch4 = __toESM(require_picomatch2(), 1);
import { existsSync as existsSync4, readdirSync as readdirSync3, readFileSync as readFileSync3, statSync as statSync4 } from "fs";
import { dirname, isAbsolute, join as join4, relative, resolve as resolve3 } from "path";

// src/approval.ts
var TRAILER = /^Test-Guard-Approved:[ \t]*(\S.*?)\s*$/i;
var SCISSORS = /^# -+ >8 -+$/;
function findApproval(message) {
  for (const line of message.replace(/\r\n?/g, "\n").split("\n")) {
    if (SCISSORS.test(line)) break;
    if (line.startsWith("#")) continue;
    const match = TRAILER.exec(line);
    if (match?.[1]) return match[1];
  }
  return void 0;
}

// src/config.ts
var import_picomatch2 = __toESM(require_picomatch2(), 1);

// src/paths.ts
var import_picomatch = __toESM(require_picomatch2(), 1);
var JS_EXT = "{js,jsx,mjs,cjs,ts,tsx,mts,cts}";
var DEFAULT_TEST_PATTERNS = {
  js: [`**/*.{test,spec}.${JS_EXT}`, `**/__tests__/**/*.${JS_EXT}`],
  python: ["**/test_*.py", "**/*_test.py"],
  java: ["**/src/test/**/*Test.java", "**/*Tests.java", "**/*IT.java"]
};
var PYTEST_SKIPPED_DIR = /^(?:\..*|build|dist|node_modules|venv|_darcs|CVS|\{arch\}|.*\.egg)$/;
function inPytestSkippedDir(path) {
  return path.split("/").slice(0, -1).some((d) => PYTEST_SKIPPED_DIR.test(d));
}
function normalizePath(path) {
  return path.replace(/\\/g, "/").replace(/^(?:\.\/)+/, "");
}
function createTestFileMatcher(patterns = DEFAULT_TEST_PATTERNS, include = {}) {
  const matchers = Object.keys(patterns).map((language) => {
    const isDefault = (0, import_picomatch.default)(patterns[language], { dot: true });
    const isIncluded = (0, import_picomatch.default)(include[language] ?? [], { dot: true });
    const isMatch = (path) => isDefault(path) && !(language === "python" && inPytestSkippedDir(path)) && !(language === "js" && /(?:^|\/)node_modules\//.test(path)) || isIncluded(path);
    return [language, isMatch];
  });
  return (path) => {
    const normalized = normalizePath(path);
    for (const [language, isMatch] of matchers) {
      if (isMatch(normalized)) return language;
    }
    return null;
  };
}

// src/config.ts
var CONFIG_FILE = ".test-guard.json";
var ConfigError = class extends Error {
};
var LANGUAGES = ["js", "python", "java"];
var RULE_LEVELS = ["error", "warn", "off"];
function parseConfig(text) {
  const config = {
    languages: [...LANGUAGES],
    include: [],
    exclude: [],
    rules: {}
  };
  if (text === null) return config;
  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new ConfigError(`${CONFIG_FILE}: invalid JSON`);
  }
  if (!isObject2(raw))
    throw new ConfigError(`${CONFIG_FILE}: expected an object`);
  if (raw.languages !== void 0) {
    const languages = stringArray(raw.languages, "languages");
    for (const language of languages) {
      if (!LANGUAGES.includes(language)) {
        throw new ConfigError(`${CONFIG_FILE}: unknown language "${language}"`);
      }
    }
    config.languages = languages;
  }
  if (raw.include !== void 0) {
    config.include = stringArray(raw.include, "include");
  }
  if (raw.exclude !== void 0) {
    config.exclude = stringArray(raw.exclude, "exclude");
  }
  if (raw.rules !== void 0) {
    if (!isObject2(raw.rules)) {
      throw new ConfigError(`${CONFIG_FILE}: "rules" must be an object`);
    }
    for (const [id, level] of Object.entries(raw.rules)) {
      if (typeof level !== "string" || !RULE_LEVELS.includes(level)) {
        throw new ConfigError(
          `${CONFIG_FILE}: rule ${id} must be "error", "warn" or "off"`
        );
      }
      config.rules[id] = level;
    }
  }
  return config;
}
function createContext(config) {
  const patterns = {};
  const include = {};
  for (const language of LANGUAGES) {
    const enabled = config.languages.includes(language);
    patterns[language] = enabled ? DEFAULT_TEST_PATTERNS[language] : [];
    include[language] = enabled ? config.include.filter((p) => patternLanguage(p) === language) : [];
  }
  const match = createTestFileMatcher(patterns, include);
  const isExcluded = config.exclude.length > 0 ? (0, import_picomatch2.default)(config.exclude, { dot: true }) : () => false;
  const excluded = (path) => isExcluded(normalizePath(path));
  return {
    detect: (path) => excluded(path) ? null : match(normalizePath(path)),
    excluded
  };
}
function patternLanguage(pattern) {
  if (pattern.endsWith(".py")) return "python";
  if (pattern.endsWith(".java")) return "java";
  return "js";
}
function isObject2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function stringArray(value, key) {
  if (!Array.isArray(value) || !value.every((v) => typeof v === "string")) {
    throw new ConfigError(
      `${CONFIG_FILE}: "${key}" must be an array of strings`
    );
  }
  return value;
}

// src/rules/tg001.ts
var tg001 = ({ before, after, afterPath }) => {
  if (!before || after) return [];
  return [
    {
      ruleId: "TG001",
      path: before.stats.path,
      message: afterPath ? `moved test file to non-test path ${afterPath}` : "deleted test file"
    }
  ];
};

// src/rules/tg002.ts
var tg002 = ({ before, after }) => {
  if (!before || !after || after.stats.tests >= before.stats.tests) return [];
  return [
    {
      ruleId: "TG002",
      path: after.stats.path,
      message: `test cases ${before.stats.tests} \u2192 ${after.stats.tests}`,
      before: before.stats.tests,
      after: after.stats.tests
    }
  ];
};

// src/rules/tg003.ts
var tg003 = ({ before, after }) => {
  if (!before || !after || after.stats.assertions >= before.stats.assertions) {
    return [];
  }
  const swallowed = after.swallowed - before.swallowed;
  return [
    {
      ruleId: "TG003",
      path: after.stats.path,
      message: `assertions ${before.stats.assertions} \u2192 ${after.stats.assertions}${swallowed > 0 ? ` (${swallowed} inside a try/catch that ignores failures)` : ""}`,
      before: before.stats.assertions,
      after: after.stats.assertions
    }
  ];
};

// src/rules/tg004.ts
var tg004 = ({ before, after, hunks }) => {
  if (!after) return [];
  const beforeSkips = before?.stats.skips ?? 0;
  const afterSkips = after.stats.skips;
  if (afterSkips <= beforeSkips) return [];
  const added2 = new Set(hunks.flatMap((hunk) => hunk.added));
  const hits2 = after.skips.filter((skip) => added2.has(skip.line));
  if (hits2.length === 0) {
    return [
      {
        ruleId: "TG004",
        path: after.stats.path,
        message: `skips ${beforeSkips} \u2192 ${afterSkips}`,
        before: beforeSkips,
        after: afterSkips
      }
    ];
  }
  return hits2.map((skip) => ({
    ruleId: "TG004",
    path: after.stats.path,
    line: skip.line,
    message: `added \`${skip.text}\``
  }));
};

// src/rules/tg006.ts
var tg006 = ({
  guardFile,
  beforePath,
  afterPath,
  beforeLines,
  afterLines
}) => {
  if (guardFile === "config") {
    const what = !beforePath ? "added" : !afterPath ? "deleted" : "changed";
    return [
      {
        ruleId: "TG006",
        path: CONFIG_FILE,
        message: `${what} test-guard config (needs human approval)`
      }
    ];
  }
  if (guardFile !== "hook") return [];
  const path = afterPath ?? beforePath ?? "";
  const findings = [];
  const add = (message, extra = {}) => findings.push({ ruleId: "TG006", path, message, ...extra });
  const mentions2 = (line) => line.includes("test-guard");
  if (beforePath && afterPath && beforePath !== afterPath && beforeLines.some(mentions2) && !/^\.github\/workflows\/[^/]+\.ya?ml$/.test(afterPath)) {
    add(`renamed ${beforePath}, which ran test-guard`);
  }
  const beforeHooks = agentHooks(beforeLines);
  const afterHooks = agentHooks(afterLines);
  if (beforeHooks && afterHooks) {
    const lost = (a, b) => [...a].filter((k) => !b.has(k));
    const hooks = lost(beforeHooks.hooks, afterHooks.hooks);
    if (hooks.length > 0) {
      add(`removed or changed test-guard's hook (${hooks[0]?.split(" ")[0]})`);
    }
    const matchers = lost(beforeHooks.matchers, afterHooks.matchers);
    if (matchers.length > 0) {
      add(`changed the matcher of test-guard's hook (${matchers.join(", ")})`);
    }
  } else {
    lineChanges(beforeLines.filter(mentions2), afterLines.filter(mentions2), add);
  }
  const disables = (lines) => lines.filter((line) => /"disableAllHooks"\s*:\s*true/.test(line)).length;
  if (disables(afterLines) > disables(beforeLines)) {
    add("turned on `disableAllHooks`, which stops test-guard\u2019s agent hooks");
  }
  const nonBlocking = (lines) => lines.filter((_, i) => continuesOnError(lines, i)).length;
  if (nonBlocking(afterLines) > nonBlocking(beforeLines)) {
    add("made test-guard\u2019s CI step non-blocking (`continue-on-error`)");
  }
  const script = !/\.(?:ya?ml|json)$/.test(path);
  const skipped = added(
    conditions(beforeLines, script),
    conditions(afterLines, script)
  );
  if (skipped.length > 0) {
    add(
      `added a condition that can keep test-guard from running: \`${skipped[0]}\``
    );
  }
  return findings;
};
function lineChanges(before, after, add) {
  const lost = added(after, before);
  if (after.length < before.length) {
    add(
      `removed test-guard from hook config (lines ${before.length} \u2192 ${after.length})`,
      { before: before.length, after: after.length }
    );
  } else if (lost.length > 0) {
    add(`changed how test-guard runs: \`${lost[0]}\``);
  }
}
var normalize = (line) => line.trim().replace(/,$/, "").replace(/(test-guard)@[\w.^~<>=*-]+/g, "$1").replace(/^("test-guard"\s*:\s*)"[^"]*"$/, '$1"*"');
function added(before, after) {
  const remaining = /* @__PURE__ */ new Map();
  for (const line of before) {
    remaining.set(normalize(line), (remaining.get(normalize(line)) ?? 0) + 1);
  }
  return after.filter((line) => {
    const left = remaining.get(normalize(line)) ?? 0;
    if (left > 0) remaining.set(normalize(line), left - 1);
    return left === 0;
  }).map(normalize);
}
function agentHooks(lines) {
  let settings;
  try {
    settings = JSON.parse(lines.join("\n"));
  } catch {
    return null;
  }
  const hooks = isObject3(settings) ? settings.hooks : void 0;
  if (!isObject3(hooks)) return null;
  const found = { hooks: /* @__PURE__ */ new Set(), matchers: /* @__PURE__ */ new Set() };
  for (const [event, entries] of Object.entries(hooks)) {
    if (!Array.isArray(entries)) continue;
    for (const entry of entries) {
      if (!isObject3(entry) || !Array.isArray(entry.hooks)) continue;
      const guards = entry.hooks.filter(
        (h) => JSON.stringify(h).includes("test-guard")
      );
      if (guards.length === 0) continue;
      for (const hook2 of guards) {
        found.hooks.add(`${event} ${JSON.stringify(hook2)}`);
      }
      const matcher = typeof entry.matcher === "string" ? entry.matcher : "*";
      for (const alt of matcher.split("|")) {
        found.matchers.add(`${event} ${alt.trim() || "*"}`);
      }
    }
  }
  return found.hooks.size > 0 ? found : null;
}
var indent = (s) => s.length - s.trimStart().length;
function yamlBlock(lines, index) {
  const [start, end] = yamlBlockRange(lines, index);
  return lines.slice(start, end);
}
function yamlBlockRange(lines, index) {
  const line = lines[index] ?? "";
  const own = indent(line.replace(/-\s*/, (m) => " ".repeat(m.length)));
  let start = index;
  while (start > 0 && indent(lines[start] ?? "") >= own) start--;
  const parent = indent(lines[start] ?? "");
  let end = index + 1;
  while (end < lines.length && ((lines[end] ?? "").trim() === "" || indent(lines[end] ?? "") > parent)) {
    end++;
  }
  return [start, end];
}
function continuesOnError(lines, index) {
  const line = lines[index] ?? "";
  if (!/^\s*-?\s*continue-on-error\s*:\s*(?!false\b)\S/.test(line)) {
    return false;
  }
  return yamlBlock(lines, index).some((l) => l.includes("test-guard"));
}
function conditions(lines, script) {
  const last = lines.map((l) => l.includes("test-guard")).lastIndexOf(true);
  return lines.filter((line, i) => {
    if (/^\s*-?\s*(?:if|skip|only|stages|files|exclude|glob|exclude_tags|piped|types|types_or|exclude_types)\s*:/.test(
      line
    )) {
      return yamlBlock(lines, i).some((l) => l.includes("test-guard"));
    }
    if (!script || i >= last) return false;
    const text = line.trim();
    if (text.includes("husky.sh")) return false;
    if (/\b(?:exit|return|exec|kill)\b|^(?:\.|source|eval|trap)\s|^cd\b|\w+\s*\(\)\s*\{|\bPATH=/.test(
      text
    )) {
      return true;
    }
    const open = /^(?:if|while|until|case)\b/.exec(text);
    return open !== null && blockEnd(lines, i) > last;
  });
}
function blockEnd(lines, start) {
  let depth = 0;
  for (let i = start; i < lines.length; i++) {
    const text = lines[i] ?? "";
    depth += (text.match(/(?:^|[;\s])(?:if|while|until|case)\b/g) ?? []).length;
    depth -= (text.match(/(?:^|[;\s])(?:fi|done|esac)\b/g) ?? []).length;
    if (depth <= 0) return i;
  }
  return lines.length;
}
function isObject3(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// src/rules/tg005.ts
var word = (w) => ({ re: new RegExp(`\\b${w}\\b`), label: w });
var JEST = [
  "passWithNoTests",
  "testPathIgnorePatterns",
  "modulePathIgnorePatterns",
  "testMatch",
  "testRegex",
  "testNamePattern",
  // Code that runs before every test file can stub out what is tested.
  "setupFiles",
  "setupFilesAfterEnv",
  "globalSetup"
];
var VITEST = [
  "passWithNoTests",
  "exclude",
  "include",
  "testNamePattern",
  "allowOnly",
  "setupFiles",
  "globalSetup",
  "projects",
  "dir"
].map(word);
var TOKENS = {
  "package.json": JEST.map(word),
  jest: JEST.map(word),
  vitest: VITEST,
  // Vitest reads `test` from vite.config.* too; other keys there aren't tests.
  vite: VITEST,
  mocha: ["ignore", "exclude", "spec", "grep", "fgrep", "invert"].map(word),
  pytest: [
    { re: /(?:^|[\s"'=[,])-k(?=[\s"'=]|$)/, label: "-k" },
    { re: /--deselect\b/, label: "--deselect" },
    { re: /--ignore(?:-glob)?\b/, label: "--ignore" },
    // Only plugins that collect tests; `-p no:cacheprovider` is routine.
    {
      re: /-p\s*no:(?:python|unittest|doctest|nose)\b/,
      label: "-p no:"
    },
    // A marker filter; `python -m pytest` in tox.ini is not one.
    {
      re: /(?<!\b(?:py(?:thon)?[\d.]*|coverage\s+run(?:\s+-{1,2}[\w-]+)*)\s*)(?:^|[\s"'=[,])-m(?=[\s"'=]|$)/,
      label: "-m"
    },
    { re: /--co\b|--collect-only\b/, label: "--collect-only" },
    // Collection settings decide which tests exist at all.
    ...[
      "testpaths",
      "norecursedirs",
      "python_files",
      "python_functions",
      "python_classes"
    ].map(word)
  ],
  conftest: [
    word("pytest_collection_modifyitems"),
    word("pytest_ignore_collect"),
    { re: /\bcollect_ignore(?:_glob)?\b/, label: "collect_ignore" },
    word("pytest_plugins"),
    // Any other pytest hook can change what runs or how it is reported;
    // registering markers and options is routine.
    {
      re: /\bdef\s+pytest_(?!configure\b|addoption\b)\w+/,
      label: "pytest_* hook"
    }
  ],
  maven: [
    word("skipTests"),
    word("skipITs"),
    { re: /\bmaven\.test\.skip\b/, label: "maven.test.skip" },
    {
      re: /\bmaven\.test\.failure\.ignore\b/,
      label: "maven.test.failure.ignore"
    },
    { re: /<skip>/, label: "<skip>" },
    { re: /<excludes?>/, label: "<exclude>" },
    word("testFailureIgnore"),
    { re: /<(?:excludedGroups|groups)>/, label: "<groups>" },
    { re: /<includes?>/, label: "<include>" },
    { re: /<test>/, label: "<test>" },
    word("testSourceDirectory")
  ],
  gradle: [
    { re: /\benabled\s*=?\s*false\b/, label: "enabled = false" },
    word("onlyIf"),
    // Dependency excludes (`exclude group: ...`) are not test filters.
    {
      re: /\bexclude(?:TestsMatching)?\b(?!.*\b(?:group|module)\b)/,
      label: "exclude"
    },
    word("ignoreFailures"),
    ...[
      "excludeTags",
      "includeTags",
      "excludeCategories",
      "includeCategories",
      "includeTestsMatching",
      "includeEngines",
      "excludeEngines",
      "excludedTaskNames"
    ].map(word)
  ],
  // Judged per step in `workflowToken`.
  workflow: []
};
var TEST_COMMAND = /\b(?:npm|pnpm|yarn|bun|nub|deno|turbo|nx|make|just|task)\s+(?:run\s+)?test\b|(?<![\w.@-])(?:jest|vitest|mocha|pytest|tox|nox)(?![\w@.:-])|\bpython3?\s+-m\s+(?:pytest|unittest)\b|\bnode\s+--test\b|(?<![\w@-])(?:\.\/)?mvnw?(?![\w@:-]).*\b(?:test|verify|install|package)\b|(?<![\w@-])(?:\.\/)?gradlew?(?![\w@:-]).*\b(?:test|check|build)\b|\b(?:go|cargo|dotnet)\s+test\b/;
var UNABLE_TO_FAIL = {
  re: /\|\|\s*(?:\S*\/)?(?:true|:|exit\s+0|echo)\b|\|\|\s*:\s*$|;\s*exit\s+0\b/,
  label: "|| true"
};
var TEST_STEP = [
  UNABLE_TO_FAIL,
  ...TOKENS.pytest,
  ...["testNamePattern", "testPathIgnorePatterns", "passWithNoTests"].map(word),
  {
    re: /(?:^|\s)(?:-t|--grep|--fgrep|--invert)(?=[\s=]|$)/,
    label: "-t/--grep"
  },
  {
    re: /--(?:testPathPatterns?|onlyChanged|changedSince|lf|last-failed|exclude|project|filter|skip)\b|(?:^|\s)-(?:run|skip)(?=[\s=])/,
    label: "test filter"
  },
  {
    re: /(?:^|\s)(?:-u|--updateSnapshot|--update-snapshots?|--snapshot-update)(?=[\s=]|$)/,
    label: "-u"
  },
  {
    re: /-D(?:[\w.]*skip\w*|maven\.test\.failure\.ignore|test=|testFailureIgnore)|(?:^|\s)(?:-fn|--fail-never)(?=\s|$)/i,
    label: "-DskipTests"
  }
];
var GRADLE_EXCLUDE = {
  re: /(?:\s-x|--exclude-task)\s+\S*test\b|\s--tests\b/i,
  label: "-x test"
};
var ALWAYS_RUNS = /^\s*-?\s*if\s*:\s*(?:\$\{\{\s*)?(?:always\(\)|success\(\)|!\s*cancelled\(\))\s*(?:\}\})?\s*$/;
var NEVER_RUNS = /^\s*-?\s*if\s*:\s*(?:\$\{\{\s*)?(?:false|0)\s*(?:\}\})?\s*$/;
function runBlock(lines, index) {
  const indent2 = (s) => s.length - s.trimStart().length;
  let own = indent2(lines[index] ?? "");
  for (let i = index - 1; i >= 0; i--) {
    const line = lines[i] ?? "";
    if (line.trim() === "" || indent2(line) >= own) continue;
    if (!/^\s*-?\s*run\s*:\s*[|>]/.test(line)) {
      if (/^\s*-?\s*[\w-]+\s*:/.test(line)) return [];
      own = indent2(line);
      continue;
    }
    const block = [line];
    for (let j = i + 1; j < lines.length; j++) {
      const next = lines[j] ?? "";
      if (next.trim() !== "" && indent2(next) <= indent2(line)) break;
      block.push(next);
    }
    return block;
  }
  return [];
}
function workflowToken(lines, index, before) {
  const text = (lines[index] ?? "").replace(/(?:^|\s)#.*$/, "");
  if (text.includes("test-guard")) return void 0;
  const existed = (l) => {
    const command2 = TEST_COMMAND.exec(l)?.[0];
    return command2 !== void 0 && before.lines.some((b) => b.includes(command2));
  };
  const block = () => yamlBlock(lines, index);
  const runsTests = () => {
    const [start] = yamlBlockRange(lines, index);
    const old = !before.added.has(start) || before.deleted.some((l) => TEST_COMMAND.test(l));
    return old && block().some((l) => TEST_COMMAND.test(l) && existed(l)) && !block().some((l) => l.includes("test-guard"));
  };
  const flag = (label) => ({ re: /./, label });
  if (/^\s*-?\s*continue-on-error\s*:\s*(?!false\b)\S/.test(text)) {
    return runsTests() ? flag("continue-on-error") : void 0;
  }
  if (/^\s*-?\s*shell\s*:.*\{0\}/.test(text)) {
    return runsTests() ? flag("shell: {0}") : void 0;
  }
  if (/^\s*-?\s*if\s*:/.test(text)) {
    if (ALWAYS_RUNS.test(text) || !runsTests()) return void 0;
    return /^\s*-/.test(block()[0] ?? "") || NEVER_RUNS.test(text) ? flag("if:") : void 0;
  }
  const command = TEST_COMMAND.exec(text);
  if (command) {
    const previous2 = before.deleted.filter((l) => TEST_COMMAND.test(l));
    if (previous2.length === 0) return void 0;
    const rest = text.slice(command.index);
    const tokens = /\bgradlew?\b/.test(text) ? [...TEST_STEP, GRADLE_EXCLUDE] : TEST_STEP;
    return tokens.find(
      (t) => t.re.test(rest) && !previous2.some((l) => t.re.test(l))
    );
  }
  const script = runBlock(lines, index);
  if (!script.some((l) => TEST_COMMAND.test(l) && existed(l))) return void 0;
  if (/^\s*set\s+\+e\b/.test(text)) return flag("set +e");
  const previous = lines[index - 1] ?? "";
  return /\\\s*$/.test(previous) && UNABLE_TO_FAIL.re.test(text) ? UNABLE_TO_FAIL : void 0;
}
function removedTestCommands(before, after) {
  const commands = (lines) => lines.map((l) => l.replace(/(?:^|\s)#.*$/, "").trim()).filter((l) => TEST_COMMAND.test(l) && !l.includes("test-guard"));
  const left = commands(after);
  const removed = commands(before).filter((l) => {
    const i = left.indexOf(l);
    if (i === -1) return true;
    left.splice(i, 1);
    return false;
  });
  return removed.slice(left.length);
}
var TEST_SCRIPT = /"test(?::[^"]*)?"\s*:/;
function outOfScope(kind, lines, index) {
  if (kind === "vitest" || kind === "vite") {
    const indent2 = (s) => s.length - s.trimStart().length;
    let own = Number.POSITIVE_INFINITY;
    for (let i = index; i >= 0; i--) {
      const line = lines[i] ?? "";
      if (line.trim() === "" || i < index && indent2(line) >= own) continue;
      if (/\bcoverage\b/.test(line)) return true;
      if (kind === "vite" && /\btest\s*:/.test(line)) return false;
      own = indent2(line);
      if (own === 0) break;
    }
    return kind === "vite";
  }
  if (kind === "maven") {
    for (let i = index; i >= 0; i--) {
      const line = lines[i] ?? "";
      if (/<\/?(?:testR|r)esources?>|<configuration>|<\/build>/.test(line)) {
        if (/<(?:testR|r)esources?>/.test(line)) return true;
        break;
      }
    }
    const plugin = enclosingPlugin(lines, index);
    return plugin !== null && !/surefire|failsafe/.test(plugin);
  }
  return false;
}
function enclosingPlugin(lines, index) {
  let depth = 0;
  for (let i = index; i >= 0; i--) {
    const line = lines[i] ?? "";
    if (/<\/plugin>/.test(line) && i !== index) depth++;
    if (/<plugin>/.test(line)) {
      if (depth > 0) {
        depth--;
        continue;
      }
      for (let j = i; j <= index; j++) {
        const id = /<artifactId>([^<]*)<\/artifactId>/.exec(lines[j] ?? "");
        if (id) return id[1] ?? "";
      }
      return "";
    }
    if (/<\/?plugins>/.test(line)) return null;
  }
  return null;
}
var tg005 = ({
  runnerConfig,
  beforePath,
  afterPath,
  beforeLines,
  afterLines,
  hunks,
  addedToExistingDir
}) => {
  const findings = [];
  const path = afterPath ?? beforePath;
  if (runnerConfig === "workflow" && beforePath && path) {
    const [removed] = removedTestCommands(beforeLines, afterLines);
    if (removed) {
      findings.push({
        ruleId: "TG005",
        path,
        message: `removed test command \`${removed}\` from CI`
      });
    }
  }
  if (!runnerConfig || !afterPath) return findings;
  if (!beforePath && !addedToExistingDir) return findings;
  const before = {
    lines: beforeLines,
    added: new Set(hunks.flatMap((hunk) => hunk.added.map((line) => line - 1))),
    deleted: hunks.flatMap(
      (hunk) => hunk.deleted.map((line) => beforeLines[line - 1] ?? "")
    )
  };
  for (const line of hunks.flatMap((hunk) => hunk.added)) {
    const text = afterLines[line - 1] ?? "";
    const token = runnerConfig === "workflow" ? workflowToken(afterLines, line - 1, before) : outOfScope(runnerConfig, afterLines, line - 1) ? void 0 : TOKENS[runnerConfig].find((t) => t.re.test(text));
    const key = TEST_SCRIPT.exec(text)?.[0].replace(/\s*:$/, "");
    const bare = (l) => l.trim().replace(/,$/, "");
    const testScript = beforePath !== null && runnerConfig === "package.json" && key !== void 0 && beforeLines.some((l) => l.includes(key)) && !beforeLines.some((l) => bare(l) === bare(text));
    if (!token && !testScript) continue;
    findings.push({
      ruleId: "TG005",
      path: afterPath,
      line,
      message: token ? `added \`${token.label}\`${testScript ? ' to "test" script' : ""}` : 'changed "test" script'
    });
  }
  return findings;
};

// src/rules/tg007.ts
var SPECS = {
  js: {
    strong: [
      {
        re: /(?<!\.not)\.(?:toBe|toEqual|toStrictEqual|toHaveLength)\s*\(/,
        group: "value"
      },
      { re: /\.toThrow\s*\(\s*[^\s)]/, group: "throw", label: "toThrow(X)" }
    ],
    weak: [
      {
        re: /\.(?:toBeDefined|toBeTruthy|not\.toBeNull|not\.toBeUndefined)\s*\(/,
        group: "value"
      },
      // An exact value replaced by "anything but" or a range.
      {
        re: /\.(?:not\.(?:toBe|toEqual|toStrictEqual|toHaveLength)|toBeGreaterThan(?:OrEqual)?|toBeLessThan(?:OrEqual)?)\s*\(/,
        group: "value"
      },
      { re: /\.toThrow\s*\(\s*\)/, group: "throw", label: "toThrow()" }
    ],
    trivial: [
      /(?<![\w$.])expect\s*\(\s*(true|false|null|undefined|\d+)\s*\)\s*\.(?:toBe|toEqual|toStrictEqual)\s*\(\s*\1\s*\)/,
      /(?<![\w$.])expect\s*\(\s*true\s*\)\s*\.toBeTruthy\s*\(\s*\)/,
      /(?<![\w$.])assert(?:\.ok)?\s*\(\s*true\s*\)/
    ]
  },
  python: {
    strong: [
      { re: /(?<![\w.])self\.assertEquals?\s*\(/, group: "value" },
      {
        re: /(?<![\w.])assert(?=[\s(]).*==/,
        group: "value",
        label: "assert x == y"
      },
      {
        re: /(?<![\w.])pytest\.raises\s*\(\s*(?!(?:Exception|BaseException)\b)\w/,
        group: "throw",
        label: "pytest.raises(SpecificError)"
      }
    ],
    weak: [
      {
        re: /(?<![\w.])self\.assert(?:True|IsNotNone|NotEqual|Greater|GreaterEqual|Less|LessEqual)\s*\(/,
        group: "value"
      },
      {
        // A line ending in `(` continues (Black's multi-line `assert (`).
        // `is` (but not `is not`) is as exact as `==`.
        re: /(?<![\w.])assert(?=[\s(])(?!.*(?:==|!=|<|>|\bin\b|\bis\b(?!\s+not\b)))(?!.*\(\s*$)/,
        group: "value",
        label: "assert x"
      },
      {
        re: /(?<![\w.])assert(?=[\s(])(?!.*==).*!=/,
        group: "value",
        label: "assert x != y"
      },
      {
        re: /(?<![\w.])assert(?=[\s(])(?!.*[=!]=).*[<>]/,
        group: "value",
        label: "assert x < y"
      },
      {
        re: /(?<![\w.])pytest\.raises\s*\(\s*(?:Exception|BaseException)\b/,
        group: "throw",
        label: "pytest.raises(Exception)"
      }
    ],
    trivial: [
      /(?<![\w.])assert\s*\(?\s*True\s*\)?\s*(?:,|$)/,
      /(?<![\w.])self\.assertTrue\s*\(\s*True\s*\)/
    ]
  },
  java: {
    strong: [
      { re: /(?<![\w$])assertEquals\s*\(/, group: "value" },
      {
        re: /(?<![\w$])assertThrows\s*\(\s*(?!(?:java\.lang\.)?(?:Exception|Throwable)\.class)[\w$.]+\.class/,
        group: "throw",
        label: "assertThrows(SpecificException.class)"
      }
    ],
    weak: [
      {
        re: /(?<![\w$])(?:assertNotNull|assertTrue|assertNotEquals|assertNotSame)\s*\(/,
        group: "value"
      },
      {
        re: /(?<![\w$])assertThrows\s*\(\s*(?:java\.lang\.)?(?:Exception|Throwable)\.class/,
        group: "throw",
        label: "assertThrows(Exception.class)"
      }
    ],
    trivial: [
      /(?<![\w$])assertTrue\s*\(\s*true\s*\)/,
      /(?<![\w$])assertFalse\s*\(\s*false\s*\)/
    ]
  }
};
function hits(matchers, lineNumbers, lines) {
  const result = [];
  for (const line of lineNumbers) {
    const text = lines[line - 1] ?? "";
    for (const matcher of matchers) {
      const match = matcher.re.exec(text);
      if (!match) continue;
      const label = matcher.label ?? match[0].replace(/^[.\s]+/, "").replace(/\s*\($/, "");
      result.push({ line, group: matcher.group, label });
      break;
    }
  }
  return result;
}
var tg007 = ({ before, after, hunks }) => {
  if (!after) return [];
  const spec = SPECS[after.stats.language];
  const path = after.stats.path;
  const findings = [];
  const pairedPerGroup = { value: 0, throw: 0 };
  for (const hunk of hunks) {
    const reported = /* @__PURE__ */ new Set();
    if (before) {
      const strongAdded = hits(spec.strong, hunk.added, after.lines);
      const weakAdded = hits(spec.weak, hunk.added, after.lines);
      for (const strong of hits(spec.strong, hunk.deleted, before.lines)) {
        const kept = strongAdded.findIndex((h) => h.group === strong.group);
        if (kept !== -1) {
          strongAdded.splice(kept, 1);
          continue;
        }
        const weak = weakAdded.findIndex((h) => h.group === strong.group);
        if (weak === -1) continue;
        const [hit] = weakAdded.splice(weak, 1);
        if (!hit) continue;
        reported.add(hit.line);
        pairedPerGroup[strong.group]++;
        findings.push({
          ruleId: "TG007",
          path,
          line: hit.line,
          message: `weakened assertion \`${strong.label}\` \u2192 \`${hit.label}\``
        });
      }
    }
    for (const line of hunk.added) {
      if (reported.has(line)) continue;
      const text = after.lines[line - 1] ?? "";
      const match = spec.trivial.map((re) => re.exec(text)).find(Boolean);
      if (!match) continue;
      findings.push({
        ruleId: "TG007",
        path,
        line,
        message: `added meaningless assertion \`${match[0].trim()}\``
      });
    }
  }
  if (before) {
    const all = (lines) => lines.map((_, i) => i + 1);
    const added2 = new Set(hunks.flatMap((hunk) => hunk.added));
    for (const group of ["value", "throw"]) {
      const count2 = (matchers, lines) => hits(matchers, all(lines), lines).filter((h) => h.group === group);
      const strongDrop = count2(spec.strong, before.lines).length - count2(spec.strong, after.lines).length;
      const weakAfter = count2(spec.weak, after.lines);
      const weakRise = weakAfter.length - count2(spec.weak, before.lines).length;
      if (Math.min(strongDrop, weakRise) <= pairedPerGroup[group]) continue;
      const where = weakAfter.find((h) => added2.has(h.line));
      findings.push({
        ruleId: "TG007",
        path,
        line: where?.line,
        message: `weakened assertions: strong matchers \u2212${strongDrop}, weak matchers +${weakRise}`
      });
    }
  }
  return findings.sort((a, b) => (a.line ?? 0) - (b.line ?? 0));
};

// src/languages/strip.ts
function scanString(src, start, quote, multiline) {
  let j = start;
  while (j < src.length) {
    const ch = src[j];
    if (ch === "\\") {
      j += 2;
    } else if (!multiline && ch === "\n") {
      return { contentEnd: j, next: j };
    } else if (src.startsWith(quote, j)) {
      return { contentEnd: j, next: j + quote.length };
    } else {
      j++;
    }
  }
  return { contentEnd: src.length, next: src.length };
}
function lineEnd(src, from) {
  const end = src.indexOf("\n", from);
  return end === -1 ? src.length : end;
}
function createBlanker(src) {
  const out = src.split("");
  return {
    blank(from, to) {
      for (let k = from; k < Math.min(to, out.length); k++) {
        if (out[k] !== "\n" && out[k] !== "\r") out[k] = " ";
      }
    },
    result: () => out.join("")
  };
}
function stripCLike(src, options) {
  const out = createBlanker(src);
  const scanTemplate = (start) => {
    let j = start;
    let textStart = start;
    while (j < src.length) {
      const ch = src[j];
      if (ch === "\\") {
        j += 2;
      } else if (ch === "`") {
        out.blank(textStart, j);
        return j + 1;
      } else if (src.startsWith("${", j)) {
        out.blank(textStart, j + 2);
        j = scanCode(j + 2, true);
        out.blank(j - 1, j);
        textStart = j;
      } else {
        j++;
      }
    }
    out.blank(textStart, src.length);
    return src.length;
  };
  const scanCode = (start, inExpression) => {
    let i = start;
    let depth = 0;
    while (i < src.length) {
      const ch = src[i];
      if (src.startsWith("//", i)) {
        const end = lineEnd(src, i);
        out.blank(i, end);
        i = end;
      } else if (src.startsWith("/*", i)) {
        const close = src.indexOf("*/", i + 2);
        const end = close === -1 ? src.length : close + 2;
        out.blank(i, end);
        i = end;
      } else if (options.textBlocks && src.startsWith('"""', i)) {
        const scan = scanString(src, i + 3, '"""', true);
        out.blank(i + 3, scan.contentEnd);
        i = scan.next;
      } else if (ch === '"' || ch === "'") {
        const scan = scanString(src, i + 1, ch, false);
        out.blank(i + 1, scan.contentEnd);
        i = scan.next;
      } else if (options.templateLiterals && ch === "`") {
        i = scanTemplate(i + 1);
      } else if (inExpression && ch === "{") {
        depth++;
        i++;
      } else if (inExpression && ch === "}") {
        if (depth === 0) return i + 1;
        depth--;
        i++;
      } else {
        i++;
      }
    }
    return i;
  };
  scanCode(0, false);
  return out.result();
}
function stripJava(src) {
  const options = { templateLiterals: false, textBlocks: true };
  if (!src.includes("\\u")) return stripCLike(src, options);
  const unicodeEscape = /\\u+([0-9a-fA-F]{4})/y;
  let decoded = "";
  const synthetic = [];
  let backslashes = 0;
  for (let i = 0; i < src.length; ) {
    unicodeEscape.lastIndex = i;
    const match = backslashes % 2 === 0 ? unicodeEscape.exec(src) : null;
    if (match) {
      decoded += String.fromCharCode(Number.parseInt(match[1] ?? "", 16));
      synthetic.push(true);
      backslashes = 0;
      i += match[0].length;
    } else {
      const ch = src[i] ?? "";
      decoded += ch;
      synthetic.push(false);
      backslashes = ch === "\\" ? backslashes + 1 : 0;
      i++;
    }
  }
  const stripped = stripCLike(decoded, options);
  let out = "";
  for (let k = 0; k < stripped.length; k++) {
    const ch = stripped[k] ?? "";
    out += synthetic[k] && (ch === "\n" || ch === "\r") ? " " : ch;
  }
  return out;
}
function stripPython(src) {
  const out = createBlanker(src);
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === "#") {
      const end = lineEnd(src, i);
      out.blank(i, end);
      i = end;
    } else if (src.startsWith('"""', i) || src.startsWith("'''", i)) {
      const quote = src.slice(i, i + 3);
      const scan = scanString(src, i + 3, quote, true);
      out.blank(i + 3, scan.contentEnd);
      i = scan.next;
    } else if (ch === '"' || ch === "'") {
      const scan = scanString(src, i + 1, ch, false);
      out.blank(i + 1, scan.contentEnd);
      i = scan.next;
    } else {
      i++;
    }
  }
  return out.result();
}
function count(code, pattern) {
  return code.match(pattern)?.length ?? 0;
}

// src/languages/swallowed.ts
var blank = (s) => s.replace(/[^\n]/g, " ");
function reportsFailure(body, fails, alwaysPasses) {
  if (/\.(?:push|append|add|addError)\s*\(/.test(body)) return true;
  return fails.test(body.replace(alwaysPasses, " "));
}
function closeBrace(code, open) {
  let depth = 0;
  for (let i = open; i < code.length; i++) {
    if (code[i] === "{") depth++;
    else if (code[i] === "}" && --depth === 0) return i;
  }
  return code.length;
}
function closeParen(code, open) {
  let depth = 0;
  for (let i = open; i < code.length; i++) {
    if (code[i] === "(") depth++;
    else if (code[i] === ")" && --depth === 0) return i;
  }
  return code.length;
}
function skipSpace(code, i) {
  while (i < code.length && /\s/.test(code[i] ?? "")) i++;
  return i;
}
function blankSwallowedBraces(code, swallows) {
  const ranges = [];
  for (const match of code.matchAll(/(?<![\w$.])try\b/g)) {
    let i = skipSpace(code, match.index + 3);
    if (code[i] === "(") i = skipSpace(code, closeParen(code, i) + 1);
    if (code[i] !== "{") continue;
    const tryOpen = i;
    const tryClose = closeBrace(code, i);
    let swallowed = false;
    i = skipSpace(code, tryClose + 1);
    while (code.startsWith("catch", i) && !/[\w$]/.test(code[i + 5] ?? "")) {
      i = skipSpace(code, i + 5);
      let clause = "";
      if (code[i] === "(") {
        const end2 = closeParen(code, i);
        clause = code.slice(i + 1, end2);
        i = skipSpace(code, end2 + 1);
      }
      if (code[i] !== "{") break;
      const end = closeBrace(code, i);
      if (swallows(clause, code.slice(i + 1, end))) swallowed = true;
      i = skipSpace(code, end + 1);
    }
    if (swallowed) ranges.push([tryOpen + 1, tryClose]);
  }
  return blankRanges(code, ranges);
}
function blankSwallowedPython(code, swallows) {
  const lines = code.split("\n");
  const indent2 = (s) => s.length - s.trimStart().length;
  const blockEnd2 = (start, own) => {
    let end = start + 1;
    while (end < lines.length && ((lines[end] ?? "").trim() === "" || indent2(lines[end] ?? "") > own)) {
      end++;
    }
    return end;
  };
  const blanked = /* @__PURE__ */ new Set();
  lines.forEach((line, i) => {
    const suppress = /^(\s*)with\s+(?:contextlib\s*\.\s*)?suppress\s*\((.*)\)\s*:(.*)$/.exec(
      line
    );
    const types = suppress?.[2]?.trim() ?? "";
    if (suppress && types !== "" && swallows(types, "")) {
      for (let j = i + 1; j < blockEnd2(i, indent2(line)); j++) blanked.add(j);
      if (suppress[3]?.trim()) {
        lines[i] = line.slice(0, line.length - suppress[3].length) + blank(suppress[3]);
      }
      return;
    }
    const head = /^(\s*)try\s*:(.*)$/.exec(line);
    if (!head) return;
    const own = indent2(line);
    const tryEnd = blockEnd2(i, own);
    let swallowed = false;
    let k = tryEnd;
    for (; ; ) {
      const clause = /^\s*except\b(.*?):(.*)$/.exec(lines[k] ?? "");
      if (!clause || indent2(lines[k] ?? "") !== own) break;
      const end = blockEnd2(k, own);
      const body = [clause[2] ?? "", ...lines.slice(k + 1, end)].join("\n");
      if (swallows((clause[1] ?? "").trim(), body)) swallowed = true;
      k = end;
    }
    if (!swallowed) return;
    for (let j = i + 1; j < tryEnd; j++) blanked.add(j);
    if (head[2]?.trim()) lines[i] = `${head[1]}try:${blank(head[2])}`;
  });
  return lines.map((l, i) => blanked.has(i) ? blank(l) : l).join("\n");
}
function blankRanges(code, ranges) {
  if (ranges.length === 0) return code;
  const chars = code.split("");
  for (const [start, end] of ranges) {
    for (let i = start; i < end; i++) if (chars[i] !== "\n") chars[i] = " ";
  }
  return chars.join("");
}

// src/languages/java.ts
var ASSERT_METHODS = "assertEquals|assertNotEquals|assertTrue|assertFalse|assertNull|assertNotNull|assertSame|assertNotSame|assertThrows|assertThrowsExactly|assertArrayEquals|assertThat|assertAll|assertDoesNotThrow|assertIterableEquals|assertLinesMatch|assertTimeout|assertTimeoutPreemptively|assertInstanceOf|fail";
var TEST_ANNOTATIONS = "Test|ParameterizedTest|RepeatedTest";
var TRUSTED_PACKAGES = "org\\.junit\\.|org\\.testng\\.|junit\\.";
var ASSERTION_LIBRARIES = "org\\.hamcrest\\.|org\\.assertj\\.|com\\.google\\.common\\.truth\\.|org\\.springframework\\.";
var TEST = new RegExp(`@(?:[\\w$]+\\.)*(?:${TEST_ANNOTATIONS})\\b`);
function countTests(code) {
  const token = new RegExp(
    `${TEST.source}|(?<![\\w$.])(class|interface|enum|record)\\s+[\\w$]+|[{};]`,
    "g"
  );
  const classes = [];
  let depth = 0;
  let declStart = 0;
  let pending = null;
  let tests = 0;
  for (const match of code.matchAll(token)) {
    const text = match[0];
    if (text === "{") {
      depth++;
      if (pending !== null) classes.push({ depth, runs: pending });
      pending = null;
      declStart = match.index + 1;
    } else if (text === "}") {
      if (classes.at(-1)?.depth === depth) classes.pop();
      depth--;
      declStart = match.index + 1;
    } else if (text === ";") {
      declStart = match.index + 1;
    } else if (match[1]) {
      const runs = classes.every((c) => c.runs);
      const modifiers = code.slice(declStart, match.index);
      pending = runs && (classes.length === 0 || match[1] !== "class" || /@(?:[\w$]+\.)*Nested\b|\bstatic\b/.test(modifiers));
    } else if (classes.every((c) => c.runs)) {
      tests++;
    }
  }
  return tests;
}
var java = {
  strip: stripJava,
  tests: countTests,
  // A leading `.` is allowed: `Assertions.assertEquals(`.
  assertions: /(?<![\w$])(?:assert\w*|fail)\s*\(/g,
  // Assertion failures are `AssertionError`s: `catch (Exception e)` lets them
  // through, `Throwable`/`Error`/`AssertionError` without a rethrow doesn't.
  unchecked: (code) => blankSwallowedBraces(
    code,
    (clause, body) => /\b(?:Throwable|Error|AssertionError|AssertionFailedError|ComparisonFailure)\b/.test(
      clause
    ) && !reportsFailure(
      body,
      /(?<![\w$])(?:throw\b|fail\s*\(|assert\w*\s*\()/,
      /(?<![\w$])assert(?:True\s*\(\s*true|NotNull\s*\(\s*[\w$]+)\s*\)/g
    )
  ),
  skips: new RegExp(
    [
      "@(?:[\\w$]+\\.)*(?:Disabled\\w*|Enabled\\w*|Ignore)\\b",
      "(?<![\\w$])assume\\w*\\s*\\(",
      "(?:\\bAssumptions\\.|(?<![\\w$.]))abort\\s*\\(",
      // TestNG `@Test(enabled = false)`.
      `(?<=@(?:[\\w$]+\\.)*Test\\s*\\([^)]*)\\benabled\\s*=\\s*false\\b`,
      // A test annotation or assertion that is not JUnit's or TestNG's.
      `\\bimport\\s+(?!static\\b)(?!${TRUSTED_PACKAGES})[\\w$.]+\\.(?:${TEST_ANNOTATIONS}|Nested)(?=\\s*;)`,
      `\\bimport\\s+static\\s+(?!${TRUSTED_PACKAGES}|${ASSERTION_LIBRARIES})[\\w$.]+\\.(?:${ASSERT_METHODS})(?=\\s*;)`,
      `@interface\\s+(?:${TEST_ANNOTATIONS}|Nested)\\b`,
      // A custom AssertJ `XAssert assertThat(X actual)` factory is routine.
      `(?<![\\w$.])(?:void\\s+assertThat|(?:void|boolean|[\\w$<>\\[\\]]+)\\s+(?!assertThat\\b)(?:${ASSERT_METHODS}))(?=\\s*\\([^)]*\\)\\s*(?:throws\\s[^{;]*)?\\{)`
    ].join("|"),
    "g"
  )
};

// src/languages/js.ts
var MODIFIERS = "skip|only|each|concurrent|skipIf|runIf|fails|failing|sequential";
var BUILTIN_MATCHERS = "toBe|toEqual|toStrictEqual|toThrow|toThrowError|toHaveLength|toBeTruthy|toBeFalsy|toBeDefined|toBeUndefined|toBeNull|toBeNaN|toContain|toContainEqual|toMatch|toMatchObject|toHaveProperty|toBeCloseTo|toBeGreaterThan|toBeGreaterThanOrEqual|toBeLessThan|toBeLessThanOrEqual|toBeInstanceOf|toHaveBeenCalled|toHaveBeenCalledWith|toHaveBeenCalledTimes|toHaveBeenLastCalledWith|toHaveBeenNthCalledWith|toHaveReturned|toHaveReturnedWith|toMatchSnapshot|toMatchInlineSnapshot|toThrowErrorMatchingSnapshot|toThrowErrorMatchingInlineSnapshot";
var STRING = "'[^'\\n]*'|\"[^\"\\n]*\"|`[^`]*`";
var SKIPS = [
  `(?<![\\w$.])(?:it|test|describe|context|suite|specify)(?:\\.\\w+)*\\.(?:skip|only|todo|skipIf|runIf|fails|failing)\\b`,
  "(?<![\\w$.])(?:xit|xtest|xdescribe|xcontext|fit|fdescribe)\\s*\\(",
  // node:test options: `test('x', { skip: true }, fn)`.
  `(?<=(?<![\\w$])(?:[\\w$]+\\.)?(?:it|test|describe|suite)\\s*\\(\\s*(?:(?:${STRING}|[\\w$.]+)\\s*,\\s*)?\\{[^{}]*?)\\b(?:skip|todo|only)\\s*:\\s*(?!false\\b|0\\b|null\\b|undefined\\b)(?:${STRING}|[^,}\\s]+)`,
  // Skipping from inside a test: Mocha `this.skip()`, node:test `t.skip()`,
  // Vitest `ctx.skip()`.
  "(?<![\\w$.])(?:this|t|ctx|context)\\.(?:skip|todo)\\s*\\("
];
var redefinitions = (names) => [
  `(?<![\\w$.])function\\*?\\s+(?:${names})\\s*\\(`,
  `(?<![\\w$.])(?:const|let|var)\\s+(?:${names})\\s*=\\s*(?:async\\s*)?(?:function\\b|\\([^()]*\\)\\s*=>|[\\w$]+\\s*=>)`,
  `(?<![\\w$])(?:globalThis|global|window|self)\\.(?:${names})\\s*=(?!=)`,
  `^[ \\t]*(?:${names})\\s*=(?![=>])`
];
function runnerNames(code) {
  const titled = ["it", "test", "describe"].filter(
    (name) => new RegExp(`(?<![\\w$.])${name}(?:\\.\\w+)*\\s*\\(\\s*['"\`]`).test(code)
  );
  return ["expect", ...titled].join("|");
}
function contextNames(code) {
  const names = /* @__PURE__ */ new Set();
  const callback = /,\s*(?:async\s+)?(?:function\s*[\w$]*\s*\(\s*([\w$]+)|\(\s*([\w$]+)[^()]*\)\s*=>|([\w$]+)\s*=>)/;
  for (const call of code.matchAll(/(?<![\w$.])(?:it|test)(?:\.\w+)*\s*\(/g)) {
    const m = callback.exec(code.slice(call.index, call.index + 400));
    const name = m?.[1] ?? m?.[2] ?? m?.[3];
    if (name && !["this", "t", "ctx", "context"].includes(name)) {
      names.add(name);
    }
  }
  return [...names];
}
var js = {
  strip: (source) => stripCLike(source, { templateLiterals: true, textBlocks: false }),
  // `(?<![\w$.])` keeps `regex.test(`, `profit(` and `obj.expect(` out.
  tests: new RegExp(
    `(?<![\\w$.])(?:(?:it|test)(?:\\.(?:${MODIFIERS}))*|xit|xtest|fit)\\s*\\(`,
    "g"
  ),
  assertions: /(?<![\w$.])(?:expect(?:\.soft)?|assert(?:\.\w+)?)\s*\(/g,
  // `catch` takes every error; it swallows unless it fails the test itself.
  unchecked: (code) => blankSwallowedBraces(
    code,
    (_, body) => !reportsFailure(
      body,
      /(?<![\w$])(?:throw|expect|assert|fail|reject)(?![\w$])|\.(?:fail|reject)\s*\(|(?<![\w$.])done\s*\(\s*[^\s)]|(?<![\w$.])t\.(?!log|pass|plan|teardown|timeout)\w+\s*\(|\.should\b/,
      /(?<![\w$.])expect\s*\(\s*[\w$]+\s*\)\s*\.\s*(?:toBeDefined|toBeTruthy|not\s*\.\s*toBe(?:Null|Undefined))\s*\(\s*\)|(?<![\w$.])expect\s*\(\s*(true|false|null|\d+)\s*\)\s*\.\s*(?:toBe|toEqual)\s*\(\s*\1\s*\)|(?<![\w$.])assert(?:\.ok)?\s*\(\s*[\w$]+\s*\)/g
    )
  ),
  skips: (code) => {
    const patterns = [...SKIPS, ...redefinitions(runnerNames(code))];
    const names = contextNames(code);
    if (names.length > 0) {
      patterns.push(
        `(?<![\\w$.])(?:${names.join("|")})\\.(?:skip|todo)\\s*\\(`
      );
    }
    if (/\(\s*\{[^{}]*\bskip\b[^{}]*\}\s*\)\s*=>/.test(code)) {
      patterns.push("(?<![\\w$.])skip\\s*\\(");
    }
    if (/(?<![\w$.])expect\s*\.\s*extend\s*\(/.test(code)) {
      patterns.push(
        `(?<![\\w$.])(?:${BUILTIN_MATCHERS})\\b(?=\\s*(?::|\\())(?<=expect\\s*\\.\\s*extend\\s*\\(\\s*\\{[\\s\\S]*)`
      );
    }
    return new RegExp(patterns.join("|"), "gm");
  }
};

// src/languages/python.ts
var ASSERT_METHODS2 = "assert(?:Equals?|NotEquals?|True|False|IsNot|IsNotNone|IsNone|Is|In|NotIn|IsInstance|NotIsInstance|Raises(?:Regex)?|Warns(?:Regex)?|(?:Not)?AlmostEquals?|Greater(?:Equal)?|Less(?:Equal)?|(?:Not)?Regex|CountEqual|MultiLineEqual|SequenceEqual|ListEqual|TupleEqual|SetEqual|DictEqual|Logs)";
var SKIPS2 = [
  /(?<![\w.])pytest\.(?:skip|xfail)\s*\(/,
  /(?<![\w.])(?:\w+\.)*mark\.(?:skip|skipif|xfail)\b/,
  /(?<![\w.])unittest\.skip\w*/,
  // Decorators under any import alias: `@skip`, `@mark.skipif`, `@ut.skipIf`.
  /(?<=@[ \t]*)(?:\w+\.)*(?:skip|skipIf|skipUnless|skipif|xfail)\b/,
  /(?<![\w.])self\.skipTest\s*\(/,
  /(?<![\w.])pytest\.importorskip\s*\(/,
  /\bSkipTest\b/,
  /\bexpectedFailure\b/,
  // `__test__ = False` stops pytest and nose collecting a module or class.
  /\b__test__[ \t]*=[ \t]*(?!True\b)\w+/,
  new RegExp(`^[ \\t]*(?:async[ \\t]+)?def[ \\t]+${ASSERT_METHODS2}\\b`),
  new RegExp(
    `(?<![\\w.])(?:self|cls|(?:\\w+\\.)*\\w*TestCase)\\.${ASSERT_METHODS2}[ \\t]*=(?!=)`
  )
].map((re) => re.source);
function importedSkips(code) {
  const patterns = [];
  for (const m of code.matchAll(
    /^[ \t]*import[ \t]+(pytest|unittest)[ \t]+as[ \t]+(\w+)/gm
  )) {
    const alias = m[2] ?? "";
    patterns.push(
      m[1] === "pytest" ? `(?<![\\w.])${alias}\\.(?:skip|xfail|importorskip)\\s*\\(` : `(?<![\\w.])${alias}\\.skip\\w*`
    );
  }
  for (const m of code.matchAll(
    /^[ \t]*from[ \t]+(pytest|unittest(?:\.case)?)[ \t]+import[ \t]+(\([^)]*\)|[^\n]*)/gm
  )) {
    for (const item of (m[2] ?? "").replace(/[()]/g, "").split(",")) {
      const [name, alias = name] = item.trim().split(/\s+as\s+/);
      if (!name || !alias || !/^\w+$/.test(alias)) continue;
      if (name === "mark") {
        patterns.push(`(?<![\\w.])${alias}\\.(?:skip|skipif|xfail)\\b`);
      } else if (/^(?:skip|skipIf|skipUnless|xfail|importorskip)$/.test(name) && alias !== name) {
        patterns.push(`(?<![\\w.])${alias}\\b(?=\\s*\\()`);
      } else if (/^(?:skip|xfail|importorskip)$/.test(name)) {
        patterns.push(`(?<![\\w.])${name}\\b(?=\\s*\\()`);
      } else if (/^(?:SkipTest|expectedFailure)$/.test(name)) {
        patterns.push(`(?<![\\w.])${alias}\\b`);
      }
    }
  }
  return patterns;
}
function countTests2(code) {
  const tests = /* @__PURE__ */ new Set();
  const scopes = [];
  const collected = [];
  for (const line of code.split("\n")) {
    const text = line.trimStart();
    if (/^(?:$|["')\]}])/.test(text)) continue;
    const indent2 = line.length - text.length;
    while ((scopes.at(-1)?.indent ?? -1) >= indent2) {
      scopes.pop();
      collected.pop();
    }
    const runs = collected.every(Boolean);
    const def = /^(?:async\s+)?def\s+(\w+)/.exec(text);
    const cls = /^class\s+(\w+)\s*(\([^)]*)?/.exec(text);
    if (def) {
      const name = def[1] ?? "";
      if (name.startsWith("test") && runs) {
        tests.add([...scopes.map((s) => s.name), name].join("."));
      }
      scopes.push({ indent: indent2, kind: "def", name });
      collected.push(false);
    } else if (cls) {
      const name = cls[1] ?? "";
      scopes.push({ indent: indent2, kind: "class", name });
      collected.push(name.startsWith("Test") || /Test/.test(cls[2] ?? ""));
    }
  }
  return tests.size;
}
var python = {
  strip: stripPython,
  tests: countTests2,
  assertions: /(?<![\w.])assert(?=[\s(])|(?<![\w.])self\.assert\w*\s*\(|(?<![\w.])pytest\.raises\s*\(/g,
  // A bare `except`, `Exception`, `BaseException` or `AssertionError` that
  // doesn't raise or fail catches the assertion's failure.
  unchecked: (code) => blankSwallowedPython(
    code,
    (clause, body) => (clause === "" || /\b(?:BaseException|Exception|AssertionError)\b/.test(clause)) && !reportsFailure(
      body,
      /(?<![\w.])(?:raise|assert)\b|\bfail\s*\(|\.fail\w*\s*\(|\.assert\w*\s*\(/,
      /(?<![\w.])assert\s+(?:True|\w+)\s*$|\bself\.assert(?:True\s*\(\s*True|IsNotNone\s*\(\s*\w+)\s*\)/gm
    )
  ),
  skips: (code) => new RegExp([...SKIPS2, ...importedSkips(code)].join("|"), "gm")
};

// src/languages/index.ts
var SPECS2 = { js, python, java };
function isAssertionLine(language, line) {
  return new RegExp(SPECS2[language].assertions.source).test(line);
}
function toLf(source) {
  return source.replace(/\r\n?/g, "\n");
}
function analyzeSource(path, source, language) {
  const spec = SPECS2[language];
  const code = spec.strip(toLf(source));
  const skips = typeof spec.skips === "function" ? spec.skips(code) : spec.skips;
  const assertions = count(spec.unchecked?.(code) ?? code, spec.assertions);
  return {
    stats: {
      path: normalizePath(path),
      language,
      tests: typeof spec.tests === "function" ? spec.tests(code) : count(code, spec.tests),
      assertions,
      skips: count(code, skips)
    },
    lines: code.split("\n"),
    skips: findMatches(code, skips),
    swallowed: count(code, spec.assertions) - assertions
  };
}
function findMatches(code, pattern) {
  const matches = [];
  let line = 1;
  let pos = 0;
  for (const match of code.matchAll(pattern)) {
    for (; pos < match.index; pos++) if (code[pos] === "\n") line++;
    matches.push({
      line,
      text: match[0].replace(/\s*\($/, "").replace(/\s+/g, " ").trim()
    });
  }
  return matches;
}

// src/watched.ts
var import_picomatch3 = __toESM(require_picomatch2(), 1);
function runnerConfigKind(path) {
  const normalized = normalizePath(path);
  if (/^\.github\/workflows\/[^/]+\.ya?ml$/.test(normalized)) return "workflow";
  const name = normalized.split("/").pop() ?? "";
  if (name === "package.json") return "package.json";
  if (/^jest\.config\.(?:[cm]?[jt]s|json)$/.test(name)) return "jest";
  if (/^vitest\.(?:config|workspace)\.[cm]?[jt]s$/.test(name)) {
    return "vitest";
  }
  if (/^vite\.config\.[cm]?[jt]s$/.test(name)) return "vite";
  if (/^\.mocharc(?:\.\w+)?$/.test(name)) return "mocha";
  if (["pytest.ini", "pyproject.toml", "setup.cfg", "tox.ini"].includes(name)) {
    return "pytest";
  }
  if (name === "conftest.py") return "conftest";
  if (name === "pom.xml") return "maven";
  if (/^build\.gradle(?:\.kts)?$/.test(name)) return "gradle";
  return null;
}
var isHookFile = (0, import_picomatch3.default)(
  [
    ".husky/**",
    "{.,}lefthook{,-local}.{yml,yaml}",
    ".pre-commit-config.yaml",
    ".github/workflows/*.{yml,yaml}",
    ".claude/settings{,.local}.json",
    ".codex/**",
    "package.json"
  ],
  { dot: true }
);
function guardFileKind(path) {
  const normalized = normalizePath(path);
  if (normalized === CONFIG_FILE) return "config";
  return isHookFile(normalized) ? "hook" : null;
}
var isSnapshot = (path) => /\.snap$/.test(path);

// src/rules/tg008.ts
var LITERAL_WORDS = /* @__PURE__ */ new Set([
  "true",
  "false",
  "null",
  "undefined",
  "None",
  "True",
  "False",
  "NaN"
]);
var TOKEN = /'(?:\\.|[^'\\])*'?|"(?:\\.|[^"\\])*"?|`(?:\\.|[^`\\])*`?|\/\/.*|\/\*.*?\*\/|#.*|\d[\w.]*|[A-Za-z_$][\w$]*|\S/g;
var TABLE = /\.each\s*\(|\bparametrize\s*\(|@(?:CsvSource|ValueSource)\s*\(/;
var INLINE = /\btoMatchInlineSnapshot\s*\(/;
function statements(stripped, language) {
  const found = [];
  for (let i = 0; i < stripped.length; i++) {
    const line = stripped[i] ?? "";
    const inline = INLINE.test(line);
    if (!inline && !TABLE.test(line) && !isAssertionLine(language, line)) {
      continue;
    }
    let depth = 0;
    let end = i;
    for (let j = i; j < stripped.length && j < i + 200; j++) {
      for (const ch of stripped[j] ?? "") {
        if ("([{".includes(ch)) depth++;
        else if (")]}".includes(ch)) depth--;
      }
      end = j;
      if (depth <= 0) break;
    }
    found.push({ start: i + 1, end: end + 1, inline });
    i = end;
  }
  return found;
}
function normalize2(token) {
  if (/^['"`]/.test(token)) return `s:${token.slice(1, -1)}`;
  if (/^\d/.test(token)) {
    const n = Number(token.replace(/_/g, ""));
    return Number.isNaN(n) ? token : `n:${n}`;
  }
  return token;
}
function shape(text, language) {
  const code = [];
  const values = [];
  let title = false;
  for (const [token] of text.matchAll(TOKEN)) {
    if (/^\/[/*]/.test(token) || language === "python" && token[0] === "#") {
      continue;
    }
    if (title && /^['"`]/.test(token)) {
      title = false;
      continue;
    }
    title = /^(?:it|test|specify|describe)$/.test(token) && code.length === 0 || title && token === "(";
    if (/^['"`\d[\]{},]/.test(token) || LITERAL_WORDS.has(token)) {
      values.push(normalize2(token));
    } else if (/^[A-Za-z_$]/.test(token)) code.push(token);
  }
  return { code: code.join(" "), values };
}
var same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
function onlyAdded(before, after, rowsBefore, rowsAfter) {
  if (same(before, after.slice(0, before.length))) return true;
  if (rowsBefore.length < 2) return false;
  const left = rowsAfter.map((r) => r.join(" "));
  return rowsBefore.every((row) => {
    const i = left.indexOf(row.join(" "));
    if (i === -1) return false;
    left.splice(i, 1);
    return true;
  });
}
var NOTE = "without changing the implementation";
var brief = (lines) => {
  const text = lines.map((l) => l.trim()).join(" ");
  return text.length > 100 ? `${text.slice(0, 97)}...` : text;
};
var tg008 = ({
  before,
  after,
  beforePath,
  afterPath,
  beforeLines,
  afterLines,
  hunks,
  implementationChanged
}) => {
  if (implementationChanged !== false) return [];
  const snapshot = afterPath ?? beforePath;
  if (snapshot && beforePath && isSnapshot(beforePath)) {
    const moved = afterPath !== beforePath;
    if (afterPath === null || hunks.length > 0) {
      return [
        {
          ruleId: "TG008",
          path: snapshot,
          message: afterPath === null ? `deleted snapshot ${NOTE}` : `${moved ? "moved and " : ""}updated snapshot ${NOTE}`
        }
      ];
    }
    return [];
  }
  if (!before || !after || !afterPath) return [];
  const language = after.stats.language;
  const deleted = new Set(hunks.flatMap((h) => h.deleted));
  const added2 = new Set(hunks.flatMap((h) => h.added));
  const touched = (list2, lines) => list2.filter((s) => {
    for (let n = s.start; n <= s.end; n++) if (lines.has(n)) return true;
    return false;
  });
  const old = touched(statements(before.lines, language), deleted);
  const findings = [];
  for (const statement of touched(statements(after.lines, language), added2)) {
    const newLines = afterLines.slice(statement.start - 1, statement.end);
    const newShape = shape(newLines.join("\n"), language);
    const pair = old.findIndex(
      (s) => s.inline === statement.inline && shape(beforeLines.slice(s.start - 1, s.end).join("\n"), language).code === newShape.code
    );
    if (pair === -1) continue;
    const [match] = old.splice(pair, 1);
    if (!match) continue;
    const oldLines = beforeLines.slice(match.start - 1, match.end);
    const line = [...added2].filter((n) => n >= statement.start && n <= statement.end)[0] ?? statement.start;
    if (statement.inline) {
      const text = (lines) => lines.map((l) => l.trim()).join("\n");
      if (text(oldLines) !== text(newLines)) {
        findings.push({
          ruleId: "TG008",
          path: afterPath,
          line,
          message: `changed an inline snapshot ${NOTE}`
        });
      }
      continue;
    }
    const oldShape = shape(oldLines.join("\n"), language);
    if (same(oldShape.values, newShape.values)) continue;
    const rows = (lines) => lines.map((l) => shape(l, language).values).filter((v) => v.length > 0);
    if (onlyAdded(
      oldShape.values,
      newShape.values,
      rows(oldLines),
      rows(newLines)
    )) {
      continue;
    }
    findings.push({
      ruleId: "TG008",
      path: afterPath,
      line,
      message: `changed asserted values ${NOTE}: \`${brief(oldLines)}\` \u2192 \`${brief(newLines)}\``
    });
  }
  return findings;
};

// src/engine/diff.ts
var MAX_CELLS = 4e6;
function diffLines(before, after) {
  let start = 0;
  while (start < before.length && start < after.length && before[start] === after[start]) {
    start++;
  }
  let endB = before.length;
  let endA = after.length;
  while (endB > start && endA > start && before[endB - 1] === after[endA - 1]) {
    endB--;
    endA--;
  }
  const ops = editScript(before.slice(start, endB), after.slice(start, endA));
  const hunks = [];
  let current = null;
  let b = start;
  let a = start;
  for (const op of ops) {
    if (op === "=") {
      current = null;
      b++;
      a++;
      continue;
    }
    if (!current) {
      current = { deleted: [], added: [] };
      hunks.push(current);
    }
    if (op === "-") current.deleted.push(++b);
    else current.added.push(++a);
  }
  return hunks;
}
function editScript(before, after) {
  const n = before.length;
  const m = after.length;
  if ((n + 1) * (m + 1) > MAX_CELLS) {
    return [...Array(n).fill("-"), ...Array(m).fill("+")];
  }
  const w = m + 1;
  const lcs = new Uint32Array((n + 1) * w);
  for (let i2 = n - 1; i2 >= 0; i2--) {
    for (let j2 = m - 1; j2 >= 0; j2--) {
      lcs[i2 * w + j2] = before[i2] === after[j2] ? (lcs[(i2 + 1) * w + j2 + 1] ?? 0) + 1 : Math.max(lcs[(i2 + 1) * w + j2] ?? 0, lcs[i2 * w + j2 + 1] ?? 0);
    }
  }
  const ops = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (before[i] === after[j]) {
      ops.push("=");
      i++;
      j++;
    } else if ((lcs[(i + 1) * w + j] ?? 0) >= (lcs[i * w + j + 1] ?? 0)) {
      ops.push("-");
      i++;
    } else {
      ops.push("+");
      j++;
    }
  }
  for (; i < n; i++) ops.push("-");
  for (; j < m; j++) ops.push("+");
  return ops;
}

// src/engine/compare.ts
function isWatched(path, ctx) {
  return ctx.detect(path) !== null || isSnapshot(path) || guardFileKind(path) !== null || runnerConfigKind(path) !== null && !ctx.excluded(path) || ctx.findLiteral !== void 0 && isImplementationCode(path, ctx);
}
function compareFiles(change, ctx, ruleIds) {
  const input = toRuleInput(change, ctx);
  if (!input) return [];
  return ruleIds.flatMap((id) => RULES[id](input));
}
function toRuleInput(change, ctx) {
  const before = change.before && isWatched(change.before.path, ctx) ? change.before : null;
  const after = change.after && isWatched(change.after.path, ctx) ? change.after : null;
  if (!before && !after) return null;
  const beforeLang = before && ctx.detect(before.path);
  const afterLang = after && ctx.detect(after.path);
  const path = after?.path ?? before?.path ?? "";
  const beforeLines = before ? splitLines(before.content) : [];
  const afterLines = after ? splitLines(after.content) : [];
  const runnerConfig = ctx.excluded(path) ? null : runnerConfigKind(path) ?? (before && runnerConfigKind(before.path) === "workflow" ? "workflow" : null);
  return {
    before: before && beforeLang ? analyzeSource(before.path, before.content, beforeLang) : null,
    after: after && afterLang ? analyzeSource(after.path, after.content, afterLang) : null,
    beforePath: change.before?.path ?? null,
    afterPath: change.after?.path ?? null,
    beforeLines,
    afterLines,
    hunks: diffLines(beforeLines, afterLines),
    runnerConfig,
    addedToExistingDir: runnerConfig !== null && change.before === null && change.after !== null && ctx.dirExisted?.(parentDir(change.after.path)) === true,
    implementationChanged: ctx.implementationChanged,
    implementationFile: isImplementationCode(path, ctx),
    findLiteral: ctx.findLiteral,
    guardFile: guardFileKind(change.after?.path ?? "") ?? guardFileKind(change.before?.path ?? "")
  };
}
var DEPENDENCIES = /(?:^|\/)(?:package-lock\.json|npm-shrinkwrap\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?|requirements[\w.-]*\.txt|pyproject\.toml|poetry\.lock|uv\.lock|Pipfile(?:\.lock)?|pom\.xml|build\.gradle(?:\.kts)?|gradle\.lockfile|go\.(?:mod|sum)|Cargo\.(?:toml|lock)|Gemfile(?:\.lock)?|composer\.(?:json|lock))$/;
var CODE = /\.(?:[cm]?[jt]sx?|vue|svelte|py|java|kt|kts|scala|groovy|go|rs|cs|fs|vb|rb|php|swift|m|mm|c|cc|cpp|cxx|h|hh|hpp|sql|sh|ps1)$/i;
function isImplementation(path, ctx) {
  return ctx.detect(path) === null && !isSnapshot(path) && guardFileKind(path) === null && (DEPENDENCIES.test(path) || CODE.test(path) && !/(?:^|\/)(?:tests?|__tests__|spec|__mocks__|fixtures?)\//i.test(path));
}
var isDependencyFile = (path) => DEPENDENCIES.test(path);
var isImplementationCode = (path, ctx) => isImplementation(path, ctx) && !isDependencyFile(path);
function changesCode(before, after) {
  const hunks = diffLines(splitLines(before), splitLines(after));
  const lines = [
    ...hunks.flatMap((h) => h.deleted.map((n) => splitLines(before)[n - 1])),
    ...hunks.flatMap((h) => h.added.map((n) => splitLines(after)[n - 1]))
  ];
  return lines.some((line) => {
    const t = (line ?? "").trim();
    return t !== "" && !/^(?:\/\/|#|\/\*|\*|<!--|--)/.test(t);
  });
}
function parentDir(path) {
  const slash = path.lastIndexOf("/");
  return slash === -1 ? "" : path.slice(0, slash);
}
function splitLines(content) {
  return content === "" ? [] : toLf(content).split("\n");
}

// src/engine/git.ts
import { execFileSync } from "child_process";
import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  rmSync,
  statSync,
  utimesSync
} from "fs";
import { tmpdir } from "os";
import { join, resolve } from "path";
var GitError = class extends Error {
};
function git(root, args, env = process.env) {
  try {
    return execFileSync("git", args, {
      cwd: root,
      env,
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"]
    });
  } catch (error) {
    const stderr = String(error.stderr ?? "").trim();
    throw new GitError(`git ${args[0]} failed${stderr ? `: ${stderr}` : ""}`);
  }
}
function findRoot(cwd) {
  try {
    return git(cwd, ["rev-parse", "--show-toplevel"]).trim();
  } catch {
    throw new GitError("not a git repository");
  }
}
function resolveBase(root, mode) {
  if (mode.kind === "base") {
    try {
      return git(root, ["merge-base", mode.ref, "HEAD"]).trim();
    } catch {
      throw new GitError(`cannot find merge-base of ${mode.ref} and HEAD`);
    }
  }
  return resolveCommit(
    root,
    mode.kind === "worktree" && mode.from ? mode.from : "HEAD"
  );
}
function resolveCommit(root, rev) {
  try {
    return git(root, [
      "rev-parse",
      "--verify",
      "--quiet",
      `${rev}^{commit}`
    ]).trim();
  } catch {
    return null;
  }
}
function gitPath(root, name) {
  return resolve(root, git(root, ["rev-parse", "--git-path", name]).trim());
}
function createWorktreeIndex(root) {
  const indexPath = gitPath(root, "index");
  const dir = mkdtempSync(join(tmpdir(), "test-guard-"));
  const tempIndex = join(dir, "index");
  try {
    if (existsSync(indexPath)) {
      copyFileSync(indexPath, tempIndex);
      const { atime, mtime } = statSync(indexPath);
      utimesSync(tempIndex, atime, mtime);
    }
    const env = { ...process.env, GIT_INDEX_FILE: tempIndex };
    const hidden = git(root, ["ls-files", "-v", "-z"], env).split("\0").filter((entry) => /^(?:[a-z]|S) /.test(entry)).map((entry) => entry.slice(2)).filter((path) => existsSync(join(root, path)));
    if (hidden.length > 0) {
      git(
        root,
        [
          "update-index",
          "--no-assume-unchanged",
          "--no-skip-worktree",
          "--",
          ...hidden
        ],
        env
      );
    }
    git(root, ["add", "--all", "--", "."], env);
    return {
      env,
      dispose: () => rmSync(dir, { recursive: true, force: true })
    };
  } catch (error) {
    rmSync(dir, { recursive: true, force: true });
    throw error;
  }
}
function listChanges(root, base, mode, env) {
  const args = ["diff", "-z", "--name-status", "-M", "--no-ext-diff"];
  if (mode.kind === "base") args.push(base ?? "HEAD", "HEAD");
  else args.push("--cached", ...base ? [base] : []);
  const parts = git(root, args, env).split("\0");
  const changes = [];
  let i = 0;
  while (i < parts.length - 1) {
    const status = parts[i++] ?? "";
    const path = parts[i++] ?? "";
    if (status.startsWith("R")) {
      changes.push({ beforePath: path, afterPath: parts[i++] ?? "" });
    } else if (status.startsWith("C")) {
      changes.push({ beforePath: null, afterPath: parts[i++] ?? "" });
    } else if (status === "A") {
      changes.push({ beforePath: null, afterPath: path });
    } else if (status === "D") {
      changes.push({ beforePath: path, afterPath: null });
    } else {
      changes.push({ beforePath: path, afterPath: path });
    }
  }
  return changes;
}
function afterSpec(mode, path) {
  return mode.kind === "base" ? `HEAD:${path}` : `:${path}`;
}
function readBlob(root, spec, env) {
  return git(root, ["cat-file", "blob", spec], env);
}
function readBlobIfExists(root, spec) {
  try {
    return readBlob(root, spec);
  } catch {
    return null;
  }
}
function listAfterFiles(root, mode, env) {
  const out = mode.kind === "base" ? git(root, ["ls-tree", "-r", "-z", "--name-only", "HEAD"]) : git(root, ["ls-files", "-z", "--cached"], env);
  return [...new Set(out.split("\0").filter(Boolean))];
}
function listWorktreeFiles(root) {
  return git(root, ["ls-files", "-z", "-co", "--exclude-standard"]).split("\0").filter(Boolean);
}
var CODE_GLOBS = [
  "js",
  "jsx",
  "mjs",
  "cjs",
  "ts",
  "tsx",
  "mts",
  "cts",
  "vue",
  "svelte",
  "py",
  "java",
  "kt",
  "kts",
  "scala",
  "groovy",
  "go",
  "rs",
  "cs",
  "rb",
  "php",
  "swift",
  "c",
  "cc",
  "cpp",
  "h",
  "hpp"
].map((ext) => `*.${ext}`);
function grepTree(root, rev, patterns, word2 = false) {
  let out;
  try {
    out = execFileSync(
      "git",
      [
        "grep",
        "-n",
        "-z",
        "-I",
        "-F",
        ...word2 ? ["-w"] : [],
        ...patterns.flatMap((p) => ["-e", p]),
        rev,
        "--",
        // Source files only: tests and code, not data or docs.
        ...CODE_GLOBS
      ],
      {
        cwd: root,
        encoding: "utf8",
        maxBuffer: 256 * 1024 * 1024,
        stdio: ["ignore", "pipe", "pipe"]
      }
    );
  } catch (error) {
    if (error.status === 1) return [];
    throw new GitError("git grep failed");
  }
  return out.split("\n").filter(Boolean).flatMap((entry) => {
    const [spec = "", line = "", text = ""] = entry.split("\0");
    const path = spec.slice(rev.length + 1);
    return path ? [{ path, line: Number(line), text }] : [];
  });
}
function listTreeFiles(root, rev) {
  return git(root, ["ls-tree", "-r", "-z", "--name-only", rev]).split("\0").filter(Boolean);
}

// src/engine/literals.ts
var CHECKS = /^(?:it|test|describe|context|suite|specify|expect|assert\w*|equals?|deepEqual|strictEqual|deepStrictEqual|ok|that|fail|each|parametrize|CsvSource|ValueSource)$/;
var MATCHERS = /^(?:to|is|has|contains)[A-Z]\w*$/;
var COMMENT = /^\s*(?:\/\/|#|\*|\/\*|<!--)/;
var VENDORED = /(?:^|\/)(?:vendor|third_party|node_modules|dist|build)\/|\.min\.[cm]?js$/;
var LITERAL = String.raw`'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|\x60(?:[^\x60\\\n]|\\.)*\x60|-?\d+(?:\.\d+)?|\btrue\b|\bfalse\b|\bTrue\b|\bFalse\b`;
function passedAsInput(text, token) {
  for (let at = text.indexOf(token); at !== -1; at = text.indexOf(token, at + 1)) {
    let depth = 0;
    for (let i = at - 1; i >= 0; i--) {
      const ch = text[i];
      if (ch === ")") depth++;
      else if (ch === "(") {
        if (depth > 0) {
          depth--;
          continue;
        }
        const call = /(\.\s*)?([A-Za-z_$][\w$]*)\s*$/.exec(text.slice(0, i));
        const callee = call?.[2];
        const matcher = call?.[1] !== void 0 && MATCHERS.test(callee ?? "");
        if (callee && !CHECKS.test(callee) && !matcher) return true;
        break;
      }
    }
  }
  return false;
}
var isNumber = (literal) => /^-?\d+(?:\.\d+)?$/.test(literal);
function forms(literal) {
  return isNumber(literal) ? [literal] : [`'${literal}'`, `"${literal}"`, `\`${literal}\``];
}
function expectedValues(text, input) {
  return [...text.matchAll(new RegExp(LITERAL, "g"))].map((m) => m[0]).filter((v) => v !== input).map((v) => /^['"`]/.test(v) ? v.slice(1, -1) : v.toLowerCase());
}
function literalFinder(root, base, ctx) {
  const cache = /* @__PURE__ */ new Map();
  return (literals) => {
    const wanted = [...new Set(literals)].filter((l) => !cache.has(l));
    const strings = wanted.filter((l) => !isNumber(l));
    const numbers = wanted.filter(isNumber);
    let hits2 = [];
    try {
      hits2 = [
        ...strings.length > 0 ? grepTree(root, base, strings) : [],
        ...numbers.length > 0 ? grepTree(root, base, numbers, true) : []
      ];
    } catch {
      return /* @__PURE__ */ new Map();
    }
    for (const literal of wanted) {
      const use = { test: null, expected: [], inCode: false };
      for (const hit of hits2) {
        if (COMMENT.test(hit.text)) continue;
        const form = forms(literal).find((f) => hit.text.includes(f));
        if (!form) continue;
        if (ctx.detect(hit.path)) {
          if (!use.test && passedAsInput(hit.text, form)) {
            use.test = hit;
            use.expected = expectedValues(hit.text, form);
          }
        } else if (isImplementation(hit.path, ctx) && !VENDORED.test(hit.path)) {
          use.inCode = true;
        }
      }
      cache.set(literal, use);
    }
    return new Map(
      literals.flatMap((l) => {
        const use = cache.get(l);
        return use ? [[l, use]] : [];
      })
    );
  };
}

// src/rules/tg009.ts
var LITERAL2 = String.raw`'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|\x60(?:[^\x60\\\n]|\\.)*\x60|-?\d+(?:\.\d+)?`;
var COMPARISONS = [
  `(?:===?|!==?)\\s*(${LITERAL2})`,
  `(${LITERAL2})\\s*(?:===?|!==?)`,
  `\\b(?:case|when)\\s+(${LITERAL2})\\s*(?::|->|=>|then\\b)`,
  `\\.equals(?:IgnoreCase)?\\(\\s*(${LITERAL2})\\s*\\)`,
  `(${LITERAL2})\\.equals(?:IgnoreCase)?\\(`,
  `\\bObject\\.is\\([^,()]*,\\s*(${LITERAL2})\\s*\\)`,
  `\\[\\s*(${LITERAL2})\\s*\\]\\.includes\\(`,
  `\\bin\\s*[[(]\\s*(${LITERAL2})\\s*,?\\s*[\\])]`
].map((p) => new RegExp(p, "g"));
var COMMON = /* @__PURE__ */ new Set([
  "0",
  "1",
  "2",
  "-1",
  "10",
  "100",
  "1000",
  "string",
  "number",
  "boolean",
  "object",
  "function",
  "undefined",
  "symbol",
  "bigint",
  "win32",
  "darwin",
  "linux",
  "production",
  "development",
  "test"
]);
var unquote = (token) => /^['"`]/.test(token) ? token.slice(1, -1) : token;
var COMMENT2 = /^\s*(?:\/\/|#|\*|\/\*)/;
function mentions(text, value) {
  if (isNumber(value)) {
    return new RegExp(`(?<![\\w.])${value.replace(".", "\\.")}(?![\\w.])`).test(
      text
    );
  }
  if (value === "true" || value === "false") {
    return new RegExp(`\\b${value}\\b`, "i").test(text);
  }
  return [`'${value}'`, `"${value}"`, `\`${value}\``].some(
    (f) => text.includes(f)
  );
}
function isResult(line, token) {
  const at = line.indexOf(token);
  const before = line.slice(0, at);
  const after = line.slice(at + token.length);
  return /(?:\breturn\b|\|\||&&|=>)[^;{}()]*$/.test(before) && !/^\s*\)\s*(?:\{|\breturn\b|\w)/.test(after);
}
var tg009 = ({
  implementationFile,
  findLiteral,
  afterPath,
  beforeLines,
  afterLines,
  hunks
}) => {
  if (!implementationFile || !findLiteral || !afterPath) return [];
  const before = beforeLines.filter((l) => !COMMENT2.test(l)).join("\n");
  const added2 = new Set(hunks.flatMap((h) => h.added));
  const candidates2 = [];
  const seen = /* @__PURE__ */ new Set();
  for (const n of [...added2].sort((a, b) => a - b)) {
    const text = afterLines[n - 1] ?? "";
    if (COMMENT2.test(text)) continue;
    for (const re of COMPARISONS) {
      for (const match of text.matchAll(re)) {
        const token = match[1] ?? "";
        const literal = unquote(token);
        if (literal.length < 2 && !isNumber(literal)) continue;
        if (COMMON.has(literal) || /\\|^[\s\p{P}]*$/u.test(literal)) continue;
        if (seen.has(literal) || before.includes(token)) continue;
        seen.add(literal);
        const near = [n, n + 1, n + 2, n + 3].filter((i) => i === n || added2.has(i)).map((i) => afterLines[i - 1] ?? "").join("\n");
        candidates2.push({ literal, token, line: n, near });
      }
    }
  }
  if (candidates2.length === 0) return [];
  const uses = findLiteral(candidates2.map((c) => c.literal));
  const findings = [];
  for (const { literal, token, line, near } of candidates2) {
    const use = uses.get(literal);
    if (!use?.test || use.inCode) continue;
    const lineText = afterLines[line - 1] ?? "";
    const result = use.expected.find(
      (v) => mentions(near, v) || (v === "true" || v === "false") && isResult(lineText, token)
    );
    if (result === void 0) continue;
    findings.push({
      ruleId: "TG009",
      path: afterPath,
      line,
      message: `special-cases ${token}, an input an existing test passes in (${use.test.path}:${use.test.line}: \`${use.test.text.trim().slice(0, 80)}\`), and produces that test's expected \`${result}\` there instead of implementing the behavior`
    });
  }
  return findings;
};

// src/rules/index.ts
var RULE_IDS = [
  "TG001",
  "TG002",
  "TG003",
  "TG004",
  "TG005",
  "TG006",
  "TG007",
  "TG008",
  "TG009"
];
var RULES = {
  TG001: tg001,
  TG002: tg002,
  TG003: tg003,
  TG004: tg004,
  TG005: tg005,
  TG006: tg006,
  TG007: tg007,
  TG008: tg008,
  TG009: tg009
};
function isRuleId(id) {
  return RULE_IDS.includes(id);
}

// src/engine/check.ts
function runCheck(options) {
  const { mode } = options;
  const root = findRoot(options.cwd);
  const base = resolveBase(root, mode);
  const config = parseConfig(
    base ? readBlobIfExists(root, `${base}:${CONFIG_FILE}`) : null
  );
  let baseDirs;
  const ctx = {
    ...createContext(config),
    // Only asked when a runner config is added, so the git call is rare.
    dirExisted: (dir) => {
      if (!base) return false;
      baseDirs ??= parentDirs(listTreeFiles(root, base));
      return baseDirs.has(dir);
    }
  };
  const ruleIds = activeRuleIds(config, options.rules);
  const worktree = mode.kind === "worktree" ? createWorktreeIndex(root) : null;
  try {
    const env = worktree?.env;
    const read2 = (spec, path) => isWatched(path, ctx) ? readBlob(root, spec, env) : "";
    const findings = [];
    const changes = [...listChanges(root, base, mode, env)];
    if (base) ctx.findLiteral = literalFinder(root, base, ctx);
    ctx.implementationChanged = changes.some(({ beforePath, afterPath }) => {
      const path = afterPath ?? beforePath;
      if (path === null || !isImplementation(path, ctx)) return false;
      if (isDependencyFile(path) || afterPath === null) return true;
      if (beforePath !== null && beforePath !== afterPath) return true;
      return changesCode(
        base && beforePath ? readBlob(root, `${base}:${beforePath}`, env) : "",
        readBlob(root, afterSpec(mode, path), env)
      );
    });
    for (const { beforePath, afterPath } of changes) {
      const change = {
        before: beforePath && base ? {
          path: beforePath,
          content: read2(`${base}:${beforePath}`, beforePath)
        } : null,
        after: afterPath ? {
          path: afterPath,
          content: read2(afterSpec(mode, afterPath), afterPath)
        } : null
      };
      for (const finding of compareFiles(change, ctx, ruleIds)) {
        const level = config.rules[finding.ruleId];
        findings.push({
          ...finding,
          severity: level === "warn" ? "warn" : "error"
        });
      }
    }
    return {
      mode,
      from: mode.kind === "base" ? mode.ref : mode.kind === "worktree" ? mode.from ?? "HEAD" : "HEAD",
      findings: findings.sort(
        (a, b) => a.path.localeCompare(b.path) || (a.line ?? 0) - (b.line ?? 0) || a.ruleId.localeCompare(b.ruleId)
      ),
      filesScanned: options.countFiles === false ? 0 : listAfterFiles(root, mode, env).filter((p) => ctx.detect(p)).length
    };
  } finally {
    worktree?.dispose();
  }
}
function activeRuleIds(config, rules = RULE_IDS) {
  return rules.filter((id) => config.rules[id] !== "off");
}
function parentDirs(files) {
  const dirs = /* @__PURE__ */ new Set();
  for (const file of files) {
    let slash = file.lastIndexOf("/");
    while (slash !== -1) {
      dirs.add(file.slice(0, slash));
      slash = file.lastIndexOf("/", slash - 1);
    }
    dirs.add("");
  }
  return dirs;
}

// src/adapters/session.ts
import {
  existsSync as existsSync2,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync as rmSync2,
  statSync as statSync2,
  writeFileSync
} from "fs";
import { join as join2 } from "path";
var MAX_AGE_MS = 30 * 24 * 60 * 60 * 1e3;
function sessionFile(root, sessionId) {
  const dotGit = join2(root, ".git");
  const dir = statSync2(dotGit).isDirectory() ? join2(dotGit, "test-guard", "sessions") : gitPath(root, "test-guard/sessions");
  return join2(dir, sessionId.replace(/[^\w.-]/g, "_"));
}
function recordSessionStart(root, sessionId) {
  const file = sessionFile(root, sessionId);
  if (existsSync2(file)) return;
  const head = resolveCommit(root, "HEAD");
  if (!head) return;
  const dir = join2(file, "..");
  mkdirSync(dir, { recursive: true });
  for (const name of readdirSync(dir)) {
    const old = join2(dir, name);
    if (Date.now() - statSync2(old).mtimeMs > MAX_AGE_MS) rmSync2(old);
  }
  writeFileSync(file, `${head}
`);
}
function sessionStart(root, sessionId) {
  const file = sessionFile(root, sessionId);
  if (!existsSync2(file)) return null;
  const hash = readFileSync(file, "utf8").trim();
  return /^[0-9a-f]{40,64}$/.test(hash) ? resolveCommit(root, hash) : null;
}

// src/adapters/shell.ts
import {
  existsSync as existsSync3,
  readdirSync as readdirSync2,
  readFileSync as readFileSync2,
  realpathSync,
  statSync as statSync3
} from "fs";
import { basename, join as join3, resolve as resolve2 } from "path";
var SEPARATORS = /* @__PURE__ */ new Set(["\n", ";", "|", "&", "(", ")", "`"]);
function splitCommand(command) {
  const segments = [];
  let tokens = [];
  let current = "";
  let inToken = false;
  let quote = null;
  const endToken = () => {
    if (inToken) tokens.push(current);
    current = "";
    inToken = false;
  };
  const endSegment = () => {
    endToken();
    if (tokens.length > 0) segments.push(tokens);
    tokens = [];
  };
  for (let i = 0; i < command.length; i++) {
    const ch = command[i] ?? "";
    if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      inToken = true;
    } else if (ch === ">") {
      if (/^\d+$/.test(current)) {
        current = "";
        inToken = false;
      }
      endToken();
      let op = ">";
      while (command[i + 1] === ">") {
        op += ">";
        i++;
      }
      if (command[i + 1] === "&") {
        i++;
        while (/\d/.test(command[i + 1] ?? "")) i++;
        continue;
      }
      tokens.push(op);
    } else if (SEPARATORS.has(ch)) {
      endSegment();
    } else if (ch === " " || ch === "	" || ch === "\r") {
      endToken();
    } else {
      current += ch;
      inToken = true;
    }
  }
  endSegment();
  return segments.map(unwrap).filter((s) => s.length > 0);
}
function unwrap(tokens) {
  let i = 0;
  for (; ; ) {
    const token = tokens[i] ?? "";
    if (/^[A-Za-z_]\w*=/.test(token) || ["sudo", "env", "command", "exec", "nohup", "time", "&"].includes(token)) {
      i++;
    } else if (["npx", "pnpx", "bunx"].includes(token)) {
      i++;
      while ((tokens[i] ?? "").startsWith("-")) i++;
    } else {
      return tokens.slice(i);
    }
  }
}
function verbOf(tokens) {
  const first = (tokens[0] ?? "").toLowerCase().replace(/\\/g, "/");
  return (first.split("/").pop() ?? "").replace(/\.exe$/, "");
}
function gitParts(tokens) {
  const configs = [];
  let i = 1;
  while (i < tokens.length && (tokens[i] ?? "").startsWith("-")) {
    const flag = tokens[i] ?? "";
    if (flag === "-c") configs.push(tokens[i + 1] ?? "");
    i += flag === "-c" || flag === "-C" ? 2 : 1;
  }
  return { sub: tokens[i] ?? "", rest: tokens.slice(i + 1), configs };
}
var isRedirect = (token) => token === ">" || token === ">>";
function withoutRedirects(args) {
  return args.filter(
    (t, i) => !isRedirect(t) && !isRedirect(args[i - 1] ?? "")
  );
}
var READ_ONLY = /* @__PURE__ */ new Set([
  "cat",
  "type",
  "less",
  "more",
  "head",
  "tail",
  "grep",
  "rg",
  "findstr",
  "select-string",
  "sls",
  "get-content",
  "gc",
  "ls",
  "dir",
  "get-childitem",
  "gci",
  "echo"
]);
var READ_ONLY_GIT = /* @__PURE__ */ new Set([
  "log",
  "show",
  "grep",
  "diff",
  "blame",
  "status"
]);
function isReadOnly(tokens) {
  const verb = verbOf(tokens);
  if (verb === "git") return READ_ONLY_GIT.has(gitParts(tokens).sub);
  return READ_ONLY.has(verb) && !tokens.some(isRedirect);
}
var isNoVerify = (token) => token.length >= 6 && "--no-verify".startsWith(token);
function readsGitConfig(tokens) {
  if (verbOf(tokens) !== "git") return false;
  const { sub, rest } = gitParts(tokens);
  const args = rest.filter(
    (t) => ![
      "--get",
      "--get-all",
      "--local",
      "--global",
      "--system",
      "--worktree"
    ].includes(t)
  );
  return sub === "config" && args.length === 1 && !args[0]?.startsWith("-");
}
var B = `(?:^|[\\s'"\`=:(,;\\\\/])`;
var E = `(?=$|[\\s'"\`),;\\\\/])`;
var PROTECTED = [
  [new RegExp(`${B}\\.git[\\\\/]+hooks${E}`, "i"), "changes a git hook"],
  [new RegExp(`${B}\\.git${E}`, "i"), "changes git internals (.git)"],
  [
    new RegExp(`${B}\\.test-guard\\.json${E}`, "i"),
    "changes the test-guard config"
  ],
  [
    new RegExp(`${B}\\.claude[\\\\/]+settings[\\w.-]*\\.json${E}`, "i"),
    "changes Claude Code settings"
  ],
  [
    new RegExp(`${B}\\.claude[\\\\/]+plugins[\\\\/].*test-guard`, "i"),
    "changes the test-guard plugin"
  ],
  [new RegExp(`${B}\\.codex${E}`, "i"), "changes Codex settings"],
  [
    new RegExp(
      `${B}node_modules[\\\\/]+(?:\\.bin[\\\\/]+)?test-guard(?:\\.\\w+)?${E}`,
      "i"
    ),
    "changes the installed test-guard"
  ]
];
var PROTECTED_DIR = new RegExp(
  `${B}(?:\\.git|\\.claude|\\.codex|node_modules[\\\\/]+test-guard)${E}`,
  "i"
);
var AGENT_SETUP = new RegExp(
  `${B}(?:\\.claude(?:[\\\\/]+plugins(?:[\\\\/]+(?:cache|marketplaces)(?:[\\\\/]+[^\\\\/]+)?)?)?|\\.codex)[\\\\/]*$|installed_plugins\\.json$`,
  "i"
);
var REPLACES = /* @__PURE__ */ new Set([
  "rm",
  "rmdir",
  "rd",
  "del",
  "erase",
  "remove-item",
  "ri",
  "mv",
  "move",
  "move-item",
  "mi",
  "ren",
  "rename",
  "rename-item",
  "rni",
  "tar",
  "unzip",
  "expand-archive"
]);
var HOOK_FILE = /[\\/](?:\.husky[\\/].+|\.github[\\/]workflows[\\/][^\\/]+\.ya?ml|\.?lefthook(?:-local)?\.ya?ml|\.pre-commit-config\.yaml)$/i;
function runsTestGuard(path) {
  if (!HOOK_FILE.test(path) || !existsSync3(path)) return false;
  try {
    return statSync3(path).isFile() && readFileSync2(path, "utf8").includes("test-guard");
  } catch {
    return false;
  }
}
function holdsTestGuardHook(path, depth = 0) {
  if (runsTestGuard(path)) return true;
  if (depth > 2 || !/[\\/](?:\.husky|\.github|workflows)$/i.test(path)) {
    return false;
  }
  try {
    if (!statSync3(path).isDirectory()) return false;
    return readdirSync2(path).some((name) => {
      const child = join3(path, name);
      return name === "workflows" ? holdsTestGuardHook(child, depth + 1) : runsTestGuard(child);
    });
  } catch {
    return false;
  }
}
function hookPathsIn(token, dir) {
  if (!/[\s'"(]/.test(token)) return [];
  return [
    ...token.matchAll(
      /(?:^|[\s'"`=(,])((?:\.\/)?(?:\.husky\/[\w.-]+|\.github\/workflows\/[\w.-]+\.ya?ml|\.?lefthook(?:-local)?\.ya?ml|\.pre-commit-config\.yaml))/g
    )
  ].map((m) => resolve2(dir, m[1] ?? ""));
}
var TRAILER2 = /test-guard-approved\s*[:=]|trailer\.\S*key[\s=]+["']?test-guard-approved|trailer\.\S*key\S*test-guard-approved/i;
var TRAILER_MESSAGE = "adds a `Test-Guard-Approved` trailer (only humans approve)";
function commitMessages(segments) {
  const messages = [];
  for (const { tokens } of segments) {
    if (verbOf(tokens) !== "git") continue;
    const { rest } = gitParts(tokens);
    rest.forEach((token, i) => {
      if (/^-[a-zA-Z]*m$/.test(token) || token === "--message") {
        messages.push(rest[i + 1] ?? "");
      } else if (token.startsWith("--message=")) {
        messages.push(token.slice("--message=".length));
      }
    });
  }
  return messages.filter((m) => m !== "");
}
var BYPASS_TEXT = [
  [/--no-verify(?![\w-])/, "`--no-verify` skips test-guard\u2019s git hook"],
  [/hookspath/i, "changing `core.hooksPath` skips test-guard\u2019s git hook"],
  [/disableAllHooks/i, "`disableAllHooks` turns off agent hooks"],
  [
    /\bHUSKY\s*=\s*["']?0\b|\bLEFTHOOK\s*=\s*["']?(?:0|false)\b|\bLEFTHOOK_EXCLUDE\s*=|\bSKIP\s*=(?=[^\n]*\bgit\b[^\n]*\bcommit\b)/i,
    "turns off the git hook runner that starts test-guard"
  ],
  [
    // `git rev-parse --git-dir` only prints the path.
    /\bGIT_DIR\s*=|(?<!\brev-parse\b[^;&|\n]*)--git-dir\b/,
    "points git at another repository, whose hooks don\u2019t run test-guard"
  ],
  [
    /["']test-guard(?:@[^"'\s:]*)?\\?["']\s*:\s*false\b/i,
    "turns off the test-guard plugin (`enabledPlugins`)"
  ],
  [
    /\bGIT_CONFIG(?:_GLOBAL|_SYSTEM|_PARAMETERS)?\s*=/,
    "points git at another config file, which can skip test-guard\u2019s git hook"
  ],
  [
    /\binclude(?:If\.\S*)?\.path\b|\[\s*include(?:If\b[^\]]*)?\s*\]/i,
    "adds a git config include, which can skip test-guard\u2019s git hook"
  ],
  [
    /\bcommit\.template\b/i,
    "sets `commit.template`, which can carry an approval trailer"
  ],
  [
    // Only in git config context: `alias.ts` in a commit message is fine.
    /\bconfig\b[^;&|\n]*\balias\.[\w-]+|(?:-c\s*|GIT_CONFIG_KEY_\d+\s*=\s*)["']?alias\.|\[\s*alias\s*\]/i,
    "defines a git alias, which can hide `--no-verify`"
  ]
];
var INTERPRETERS = /* @__PURE__ */ new Set([
  "node",
  "deno",
  "bun",
  "tsx",
  "ts-node",
  "python",
  "python3",
  "py",
  "ruby",
  "perl"
]);
function scriptIndex(tokens) {
  if (!INTERPRETERS.has(verbOf(tokens))) return -1;
  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i] ?? "";
    if (/^-(?:e|c|p|-eval|-print)$/.test(token)) return -1;
    if (!token.startsWith("-")) return i;
  }
  return -1;
}
var SHELLS = /* @__PURE__ */ new Set(["bash", "sh", "zsh", "dash", "ksh"]);
var POWERSHELLS = /* @__PURE__ */ new Set(["pwsh", "powershell"]);
function nestedCommand(tokens) {
  const verb = verbOf(tokens);
  const args = tokens.slice(1);
  if (SHELLS.has(verb)) {
    const i = args.findIndex((a) => /^-[a-z]*c[a-z]*$/.test(a));
    return i === -1 ? null : args[i + 1] ?? null;
  }
  if (POWERSHELLS.has(verb)) {
    const i = args.findIndex((a) => /^-(?:c|command)$/i.test(a));
    return i === -1 ? null : args.slice(i + 1).join(" ");
  }
  if (verb === "cmd") {
    const i = args.findIndex((a) => /^\/[ck]$/i.test(a));
    return i === -1 ? null : args.slice(i + 1).join(" ");
  }
  if (verb === "eval" || verb === "invoke-expression" || verb === "iex") {
    return args.join(" ");
  }
  return null;
}
var CD = /* @__PURE__ */ new Set(["cd", "set-location", "sl", "pushd", "chdir"]);
function walk(command, cwd, depth = 0) {
  const out = [];
  let dir = cwd;
  for (const tokens of splitCommand(command)) {
    const verb = verbOf(tokens);
    if (CD.has(verb)) {
      const target = pathArgs(tokens.slice(1))[0];
      if (target) dir = resolve2(dir, target);
      continue;
    }
    out.push({ tokens, dir });
    const nested = depth < 3 ? nestedCommand(tokens) : null;
    if (nested) out.push(...walk(nested, dir, depth + 1));
  }
  return out;
}
function updatesSnapshots(command, cwd) {
  return walk(command, cwd).some(({ tokens }) => {
    if (verbOf(tokens) === "echo") return false;
    const runner = tokens.some(
      (t) => /(?:^|[\\/])(?:jest|vitest|playwright|pytest)(?:\.[cm]?js|\.cmd)?$/i.test(
        t
      )
    ) || /^(?:npm|pnpm|yarn|bun)$/i.test(verbOf(tokens)) && tokens.some((t) => /^(?:t|test(?::.*)?)$/.test(t));
    return runner && tokens.some(
      (t) => /^(?:--?u|--update|--updateSnapshot|--update-snapshots?|--snapshot[.-]update|--force-regen|--inline-snapshot=(?:fix|create|update)\S*)(?:=.*)?$/.test(
        t
      ) && !/=(?:false|0)$/.test(t)
    );
  });
}
function flagValue(token) {
  return /^--?[A-Za-z][\w-]*[:=](.+)$/.exec(token)?.[1] ?? null;
}
function pathArgs(args) {
  return withoutRedirects(args).flatMap((a) => {
    if (!a.startsWith("-")) return [a];
    const value = flagValue(a);
    return value ? [value] : [];
  });
}
function candidates(token, dir) {
  const value = (flagValue(token) ?? token).replace(/::\$DATA$/i, "");
  const found = [token, value];
  if (value === "" || /[\s'"]/.test(value)) return found;
  const absolute = resolve2(dir, value);
  found.push(absolute);
  const real = realPath(absolute);
  if (real !== absolute) found.push(real);
  return found;
}
function realPath(path) {
  const clean = path.replace(/::\$DATA$/i, "");
  let existing = clean;
  const rest = [];
  while (!existsSync3(existing)) {
    const parent = resolve2(existing, "..");
    if (parent === existing) return clean;
    rest.unshift(basename(existing));
    existing = parent;
  }
  try {
    return join3(realpathSync.native(existing), ...rest);
  } catch {
    return clean;
  }
}
var COPY = /* @__PURE__ */ new Set([
  "cp",
  "copy",
  "copy-item",
  "cpi",
  "mv",
  "move",
  "move-item",
  "mi",
  "install",
  "rsync",
  "ln",
  "xcopy"
]);
var LINK = /* @__PURE__ */ new Set(["ln", "mklink"]);
var MKDIR = /* @__PURE__ */ new Set(["mkdir", "md"]);
function copyTargets(tokens, dir) {
  if (!COPY.has(verbOf(tokens))) return [];
  const paths = pathArgs(tokens.slice(1));
  const dest = paths.pop();
  if (!dest) return [];
  return paths.map((source) => join3(resolve2(dir, dest), basename(source)));
}
function createsLink(tokens) {
  const verb = verbOf(tokens);
  if (verb === "ln") return tokens.some((t) => /^-[a-z]*s/i.test(t));
  if (LINK.has(verb)) return true;
  return (verb === "new-item" || verb === "ni") && tokens.some((t) => /symboliclink|junction|hardlink/i.test(t));
}
var PACKAGE_MANAGERS = /* @__PURE__ */ new Set(["npm", "pnpm", "yarn", "bun"]);
var UNINSTALL = /* @__PURE__ */ new Set(["uninstall", "un", "unlink", "remove", "rm", "r"]);
function removesTestGuard(tokens) {
  const verb = verbOf(tokens);
  const args = tokens.slice(1).map((t) => t.toLowerCase());
  const names = args.filter((a) => !a.startsWith("-"));
  if (verb === "claude" && /^plugins?$/.test(names[0] ?? "")) {
    const action = names[1] ?? "";
    const target = names.slice(2);
    const all = args.includes("-a") || args.includes("--all");
    if (["disable", "uninstall", "remove"].includes(action) && (all || target.some((t) => t.includes("test-guard")) || action === "disable" && target.length === 0)) {
      return `\`claude plugin ${action}\` turns off test-guard\u2019s agent hooks`;
    }
  }
  if (verb === "claude" && /^plugins?$/.test(names[0] ?? "") && names[1] === "marketplace" && ["remove", "rm"].includes(names[2] ?? "")) {
    return "`claude plugin marketplace remove` can take test-guard\u2019s plugin with it";
  }
  if (PACKAGE_MANAGERS.has(verb) && UNINSTALL.has(names[0] ?? "") && names.slice(1).some((n) => /^test-guard(?:@|$)/.test(n))) {
    return `\`${verb} ${names[0]}\` removes test-guard`;
  }
  if (PACKAGE_MANAGERS.has(verb) && names.some(
    (n) => /^test-guard@(?:file:|link:|portal:|git|github:|https?:|\.|\/|[a-z]:)/.test(
      n
    )
  )) {
    return `\`${verb}\` replaces test-guard with another copy`;
  }
  if (verb === "npm" && names[0] === "pkg" && ["set", "delete"].includes(names[1] ?? "") && names.slice(2).some((n) => /\btest-guard\b/.test(n))) {
    return "`npm pkg` changes the test-guard dependency";
  }
  return null;
}
function deletesOnlyLocks(tokens) {
  const paths = pathArgs(tokens.slice(1));
  return DELETE.has(verbOf(tokens)) && paths.length > 0 && paths.every((p) => /\.lock$/.test(p));
}
function findBypass(command, cwd = process.cwd()) {
  const segments = walk(command, cwd);
  const found = [];
  for (const { tokens, dir } of segments) {
    const verb = verbOf(tokens);
    if (verb === "git") {
      const { sub, rest } = gitParts(tokens);
      if (rest.some(isNoVerify)) {
        found.push(`\`git ${sub} --no-verify\` skips test-guard\u2019s git hook`);
      } else if (sub === "commit" && rest.some((t) => /^-[a-zA-Z]*n[a-zA-Z]*$/.test(t))) {
        found.push("`git commit -n` skips test-guard\u2019s git hook");
      }
    }
    const removal = removesTestGuard(tokens);
    if (removal) found.push(removal);
    const gitSub = verb === "git" ? gitParts(tokens).sub : "";
    const gitWrites = ["rm", "mv", "checkout", "restore"].includes(gitSub);
    const findLists = verb === "find" && !tokens.some((t) => /^-(?:delete|exec\w*|ok\w*|fprint\w*|fls)$/.test(t));
    const wrapper = nestedCommand(tokens) !== null;
    const writes = tokens.some(isRedirect) || gitWrites || verb !== "git" && !READ_ONLY.has(verb) && !findLists && !wrapper;
    if (!writes) continue;
    const replaces = REPLACES.has(verb) || gitSub === "rm" || gitSub === "mv" || verb === "find" && tokens.includes("-delete");
    const makesRunnable = verb === "chmod" && tokens.slice(1).every((t) => !/^[ugoa]*-/.test(t));
    const script = scriptIndex(tokens);
    const paths = [
      // The program and its script run; they are not written.
      ...tokens.flatMap(
        (t, i) => i === 0 || i === script ? [] : candidates(t, dir)
      ),
      ...copyTargets(tokens, dir)
    ];
    const locksOnly = deletesOnlyLocks(tokens);
    for (const [re, message] of PROTECTED) {
      if (locksOnly && message.includes("(.git)")) continue;
      if (paths.some((p) => re.test(p))) {
        found.push(message);
        break;
      }
    }
    if (createsLink(tokens) && paths.some((p) => PROTECTED_DIR.test(p))) {
      found.push("links to or over a path that keeps test-guard running");
    }
    if (replaces && paths.some((p) => AGENT_SETUP.test(p))) {
      found.push("removes agent settings or plugins that run test-guard");
    }
    const hookFiles = [
      ...paths,
      ...tokens.flatMap((t) => hookPathsIn(t, dir))
    ].filter((p) => replaces ? holdsTestGuardHook(p) : runsTestGuard(p));
    if (hookFiles.length > 0 && !makesRunnable) {
      found.push("changes a hook or CI file that runs test-guard");
    }
  }
  const readOnly = segments.every(
    (s) => isReadOnly(s.tokens) || readsGitConfig(s.tokens)
  );
  if (!readOnly) {
    const scrubbed = commitMessages(segments).reduce(
      (text, m) => text.split(`"${m}"`).join('""').split(`'${m}'`).join("''"),
      command
    );
    if (TRAILER2.test(command)) found.push(TRAILER_MESSAGE);
    for (const [text, message] of BYPASS_TEXT) {
      if (text.test(scrubbed)) found.push(message);
    }
  }
  if (/(?:\$env:)?\bTEST_GUARD_\w*\s*=(?!=)/i.test(command)) {
    found.push("sets a `TEST_GUARD_*` variable");
  }
  return [...new Set(found)];
}
function commitMessageFiles(command, cwd) {
  const files = [];
  for (const { tokens, dir } of walk(command, cwd)) {
    if (verbOf(tokens) !== "git") continue;
    const { sub, rest } = gitParts(tokens);
    if (sub !== "commit") continue;
    rest.forEach((token, i) => {
      const value = ["-F", "--file", "-t", "--template"].includes(token) ? rest[i + 1] : /^--(?:file|template)=/.test(token) ? token.slice(token.indexOf("=") + 1) : /^-[Ft]./.test(token) ? token.slice(2) : void 0;
      if (value && value !== "-") files.push(resolve2(dir, value));
    });
  }
  return files;
}
var DELETE = /* @__PURE__ */ new Set([
  "rm",
  "unlink",
  "rmdir",
  "rd",
  "del",
  "erase",
  "remove-item",
  "ri"
]);
var MOVE = /* @__PURE__ */ new Set(["mv", "move", "move-item", "mi"]);
var RENAME = /* @__PURE__ */ new Set(["ren", "rename", "rename-item", "rni"]);
var CMD_FLAG = /^\/[a-zA-Z]{1,2}$/;
var FILTERS = /* @__PURE__ */ new Set([
  "grep",
  "rg",
  "sort",
  "uniq",
  "head",
  "tail",
  "sed",
  "awk",
  "tr",
  "cut",
  "select-string",
  "sls",
  "where-object",
  "where",
  "?"
]);
function findSelection(args, dir) {
  const firstExpr = args.findIndex((a) => /^[-(!]/.test(a));
  const starts = (firstExpr === -1 ? args : args.slice(0, firstExpr)).filter(
    (a) => a !== ""
  );
  const flagArg = (...flags) => {
    const i = args.findIndex((a) => flags.includes(a));
    return i === -1 ? void 0 : args[i + 1];
  };
  const path = flagArg("-path", "-ipath", "-wholename");
  const name = flagArg("-name", "-iname");
  return (starts.length > 0 ? starts : ["."]).map((start) => {
    const base = resolve2(dir, start);
    if (path) return resolve2(dir, path);
    return name ? join3(base, "**", name) : base;
  });
}
function listedFiles(segment) {
  if (!segment) return null;
  const { tokens, dir } = segment;
  const verb = verbOf(tokens);
  const args = tokens.slice(1);
  if (verb === "find") return findSelection(args, dir);
  if (verb === "git" && gitParts(tokens).sub === "ls-files") {
    const specs = pathArgs(gitParts(tokens).rest);
    return specs.length > 0 ? specs.map((s) => resolve2(dir, s)) : [dir];
  }
  if (["ls", "dir", "echo", "printf"].includes(verb)) {
    return pathArgs(args).map((p) => resolve2(dir, p));
  }
  if (["get-childitem", "gci"].includes(verb)) {
    const value = (flag) => {
      const i = args.findIndex((a) => a.toLowerCase() === flag);
      return i === -1 ? void 0 : args[i + 1];
    };
    const filter = value("-filter") ?? value("-include");
    const recurse = args.some((a) => /^-r(?:ecurse)?$/i.test(a));
    const roots = pathArgs(
      args.filter((_, i) => !/^-(?:filter|include)$/i.test(args[i - 1] ?? ""))
    );
    return (roots.length > 0 ? roots : ["."]).map((root) => {
      const base = resolve2(dir, root);
      return filter ? join3(base, recurse ? "**" : "", filter) : base;
    });
  }
  if (["grep", "rg"].includes(verb) && args.some((a) => /^-\w*[lL]/.test(a))) {
    const rest = pathArgs(args).slice(1);
    return rest.length > 0 ? rest.map((p) => resolve2(dir, p)) : [dir];
  }
  return null;
}
function fileOps(command, cwd) {
  const ops = [];
  const segments = walk(command, cwd);
  const made = /* @__PURE__ */ new Set();
  segments.forEach(({ tokens, dir }, index) => {
    let verb = verbOf(tokens);
    let args = tokens.slice(1);
    if (MKDIR.has(verb)) {
      for (const p of pathArgs(args)) made.add(resolve2(dir, p));
      return;
    }
    if (verb === "git") {
      const { sub, rest } = gitParts(tokens);
      if (sub !== "rm" && sub !== "mv") return;
      verb = `git ${sub}`;
      args = rest;
    }
    if (verb === "xargs") {
      const inner = args.findIndex((a) => DELETE.has(verbOf([a])));
      if (inner === -1) return;
      verb = verbOf([args[inner] ?? ""]);
      args = [];
    }
    if (verb === "find") {
      const deletes = args.includes("-delete") || args.some(
        (a, i) => ["-exec", "-execdir", "-ok"].includes(a) && DELETE.has(verbOf([args[i + 1] ?? ""]))
      );
      if (deletes) {
        ops.push({
          kind: "delete",
          verb: "find",
          sources: findSelection(args, dir)
        });
      }
      return;
    }
    if (/^[a-z]+-[a-z]+$/.test(verb)) {
      args = args.map((a) => a.replace(/\\/g, "/"));
    }
    const named = (name) => {
      const i = args.findIndex((a) => new RegExp(`^-${name}$`, "i").test(a));
      if (i !== -1) return args[i + 1];
      return args.map((a) => new RegExp(`^-${name}:(.+)$`, "i").exec(a)?.[1]).find(Boolean);
    };
    const destination = named("destination");
    const paths = pathArgs(
      args.filter(
        (a, i) => !/^-destination(?::|$)/i.test(a) && !/^-destination$/i.test(args[i - 1] ?? "")
      )
    ).filter(
      (a) => !(["del", "erase", "rd", "rmdir", "move", "ren", "rename"].includes(
        verb
      ) && CMD_FLAG.test(a))
    );
    if (DELETE.has(verb) || verb === "git rm") {
      const sources = paths.length > 0 ? paths.map((p) => resolve2(dir, p)) : piped(segments, index);
      if (sources && sources.length > 0)
        ops.push({ kind: "delete", verb, sources });
    } else if (MOVE.has(verb) || RENAME.has(verb) || verb === "git mv") {
      const dest = destination ?? paths.pop();
      const first = paths[0];
      if (!dest || !first) return;
      const sources = paths.map((p) => resolve2(dir, p));
      const target = RENAME.has(verb) ? resolve2(resolve2(dir, first), "..", dest) : resolve2(dir, dest);
      ops.push({
        kind: "move",
        verb,
        sources,
        // `ren a.js b.js` takes a new name, not a path.
        dest: target,
        // `mv a tests/unit/` or a folder made by `mkdir` just before.
        .../[\\/]$/.test(dest) || made.has(target) ? { destIsDir: true } : {}
      });
    }
  });
  return ops;
}
function piped(segments, index) {
  for (let i = index - 1; i >= 0; i--) {
    const segment = segments[i];
    const listed = listedFiles(segment);
    if (listed) return listed;
    if (!segment || !FILTERS.has(verbOf(segment.tokens))) return null;
  }
  return null;
}

// src/adapters/agent.ts
var ADVICE = "Do not weaken tests to make them pass. Fix the implementation instead.\nIf you believe the test itself is wrong, stop and explain why to the user.";
function runHook(stdin, checkToolUse) {
  contexts.clear();
  try {
    const input = parseHookInput(stdin);
    rememberSessionStart(input);
    if (input.event === "Stop") return onStop(input);
    const violations = checkToolUse(input);
    return violations.length > 0 ? denyToolUse(blockedReason(violations)) : "";
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return notifyUser(`test-guard hook error: ${message}`);
  }
}
function rememberSessionStart(input) {
  if (!input.sessionId) return;
  const root = findRepoRoot(resolve3(input.cwd));
  if (!root) return;
  try {
    recordSessionStart(root, input.sessionId);
  } catch {
  }
}
function checkFileChange(input) {
  const change = {
    ...input,
    beforePath: input.beforePath && realPath(input.beforePath),
    afterPath: input.afterPath && realPath(input.afterPath)
  };
  const anchor = change.afterPath ?? change.beforePath;
  if (!anchor) return [];
  const untracked = [change.beforePath, change.afterPath].map((p) => p && untrackedGuard(p)).find(Boolean);
  if (untracked) return [untracked];
  const unplugged = droppedPlugin(change);
  if (unplugged) return [unplugged];
  const bypass = writtenBypass(change);
  if (bypass.length > 0) return bypass;
  const root = findRepoRoot(dirname(anchor));
  if (!root) return [];
  const before = change.beforePath ? repoPath(root, change.beforePath) : null;
  const after = change.afterPath ? repoPath(root, change.afterPath) : null;
  const { config, ctx } = loadContext(root);
  const watched = (p) => p !== null && isWatched(p, ctx);
  if (!watched(before) && !watched(after)) return [];
  return compareFiles(
    {
      before: before !== null && change.before !== null ? { path: before, content: change.before } : null,
      after: after !== null && change.after !== null ? { path: after, content: change.after } : null
    },
    ctx,
    blockingRuleIds(config)
  );
}
var UNTRACKED_GUARDS = [
  [/(?:^|\/)\.git\/hooks(?:\/|$)/i, "edits a git hook"],
  [/(?:^|\/)\.git(?:\/|$)/i, "edits git internals (.git)"],
  [
    /(?:^|\/)\.claude\/settings\.local\.json$/i,
    "edits local Claude Code settings, which git does not track"
  ],
  [
    /(?:^|\/)node_modules\/(?:\.bin\/)?test-guard(?:\.\w+)?(?:\/|$)/i,
    "edits the installed test-guard"
  ],
  [/(?:^|\/)\.claude\/plugins\/.*test-guard/i, "edits the test-guard plugin"]
];
function droppedPlugin(change) {
  const path = normalizePath(change.afterPath ?? "");
  if (!/(?:^|\/)\.claude\/settings[\w.-]*\.json$/i.test(path)) return null;
  const enabled = (text) => {
    try {
      const plugins = JSON.parse(text ?? "")?.enabledPlugins;
      return Object.keys(plugins ?? {}).filter(
        (k) => /^test-guard(?:@|$)/i.test(k) && plugins[k] === true
      );
    } catch {
      return [];
    }
  };
  const after = new Set(enabled(change.after));
  const lost = enabled(change.before).filter((k) => !after.has(k));
  return lost.length > 0 ? {
    ruleId: "TG006",
    message: `turns off the test-guard plugin (\`enabledPlugins\` ${lost[0]})`,
    path
  } : null;
}
function untrackedGuard(path) {
  const normalized = normalizePath(path);
  const hit = UNTRACKED_GUARDS.find(([re]) => re.test(normalized));
  return hit ? { ruleId: "TG006", message: hit[1], path: normalized } : null;
}
var WRITTEN_BYPASS = [
  [/--no-verify(?![\w-])/, "`--no-verify`, which skips test-guard\u2019s git hook"],
  [
    /\bgit\s+commit\b[^\n]*\s-[a-zA-Z]*n[a-zA-Z]*(?=\s|$)|\bHUSKY\s*=\s*["']?0\b|\bLEFTHOOK\s*=\s*["']?(?:0|false)\b/m,
    "a commit that skips the git hook (`-n`, `HUSKY=0`, `LEFTHOOK=0`)"
  ],
  [
    /core\.hookspath|^\s*hookspath\s*=/im,
    "`core.hooksPath`, which skips test-guard\u2019s git hook"
  ],
  [/disableAllHooks/, "`disableAllHooks`, which turns off agent hooks"],
  [
    /test-guard-approved\s*[:=]/i,
    "a `Test-Guard-Approved` trailer (only humans approve)"
  ],
  [
    /["']test-guard(?:@[^"'\s:]*)?\\?["']\s*:\s*false\b/,
    "`enabledPlugins` turning test-guard off"
  ],
  [
    /\bclaude\s+plugins?\s+(?:disable|uninstall|remove)\b|\b(?:npm|pnpm|yarn|bun)\s+(?:uninstall|un|remove|rm|r)\b[^\n]*\btest-guard\b/,
    "a command that removes test-guard"
  ],
  [
    /\bGIT_CONFIG(?:_GLOBAL|_SYSTEM|_PARAMETERS)?\s*=/,
    "a git config override, which can skip test-guard\u2019s git hook"
  ],
  [
    /^\s*\[\s*(?:include(?:If\b[^\]]*)?|alias)\s*\]|\binclude(?:If\.\S*)?\.path\b|\bcommit\.template\b|\bgit\b[^\n]*\balias\.[\w-]+/im,
    "a git include, alias or commit template, which can skip test-guard"
  ]
];
function writtenBypass(change) {
  if (change.after === null || !change.afterPath) return [];
  if (/\.mdx?$/i.test(change.afterPath)) return [];
  const before = change.before === null ? [] : toLf(change.before).split("\n");
  const after = toLf(change.after).split("\n");
  const added2 = diffLines(before, after).flatMap((hunk) => hunk.added).map((line) => after[line - 1] ?? "").join("\n");
  return WRITTEN_BYPASS.filter(([re]) => re.test(added2)).map(([, what]) => ({
    ruleId: "TG006",
    message: `writes ${what}`,
    path: normalizePath(change.afterPath ?? "")
  }));
}
function checkShell(command, cwd) {
  const violations = findBypass(command, cwd).map((message) => ({
    ruleId: "TG006",
    message
  }));
  if (updatesSnapshots(command, cwd)) {
    violations.push({
      ruleId: "TG008",
      message: "runs tests with `-u`, which rewrites snapshots to match the current output"
    });
  }
  for (const file of commitMessageFiles(command, cwd)) {
    if (existsSync4(file) && findApproval(readFileSync3(file, "utf8"))) {
      violations.push({
        ruleId: "TG006",
        message: "commits a message with a `Test-Guard-Approved` trailer (only humans approve)"
      });
    }
  }
  const ops = fileOps(command, cwd);
  if (violations.length === 0 && ops.length === 0) return [];
  const root = findRepoRoot(cwd);
  if (!root) return violations;
  const { config, ctx } = loadContext(root);
  const rules = blockingRuleIds(config);
  if (ops.length > 0 && rules.includes("TG001")) {
    violations.push(...checkFileOps(ops, root, ctx));
  }
  return violations.filter((v) => rules.includes(v.ruleId));
}
function checkFileOps(ops, root, ctx) {
  const tests = listWorktreeFiles(root).filter((f) => ctx.detect(f));
  const violations = [];
  for (const op of ops) {
    const dest = op.dest ? repoPath(root, op.dest) : null;
    const destIsDir = op.destIsDir === true || op.dest !== void 0 && existsSync4(op.dest) && statSync4(op.dest).isDirectory();
    for (const source of op.sources) {
      const src = repoPath(root, source);
      if (src === null) continue;
      const glob = /[*?[\]{}]/.test(src);
      const matches = glob ? (0, import_picomatch4.default)(src, { dot: true }) : (f) => src === "" || f === src || f.startsWith(`${src}/`);
      const hits2 = tests.filter((f) => matches(f));
      if (hits2.length === 0) continue;
      if (op.kind === "delete") {
        violations.push({
          ruleId: "TG001",
          message: `\`${op.verb}\` deletes test files: ${list(hits2)}`
        });
        continue;
      }
      const movedOut = hits2.filter((f) => {
        const to = movedPath(f, src, glob, dest, destIsDir);
        return to === null || ctx.detect(to) === null;
      });
      if (movedOut.length > 0) {
        violations.push({
          ruleId: "TG001",
          message: `\`${op.verb}\` moves test files to a non-test path: ${list(movedOut)}`
        });
      }
    }
  }
  return violations;
}
function movedPath(file, src, glob, dest, destIsDir) {
  if (dest === null) return null;
  const join7 = (...parts) => parts.filter(Boolean).join("/");
  const name = (p) => p.split("/").pop() ?? "";
  if (file === src) return destIsDir ? join7(dest, name(file)) : dest;
  if (glob) return join7(dest, name(file));
  const inner = file.slice(src.length + 1);
  return destIsDir ? join7(dest, name(src), inner) : join7(dest, inner);
}
function onStop(input) {
  const root = findRepoRoot(resolve3(input.cwd));
  if (!root) return "";
  const from = input.sessionId ? sessionStart(root, input.sessionId) : null;
  const result = runCheck({
    cwd: root,
    mode: from ? { kind: "worktree", from } : { kind: "worktree" },
    countFiles: false
  });
  const errors = result.findings.filter((f) => f.severity === "error");
  if (errors.length === 0) return "";
  if (input.stopHookActive) {
    return notifyUser(
      `test-guard: ${errors.length} test weakening finding(s) remain${from ? ` since ${from.slice(0, 7)}` : " in the working tree"}. Run \`test-guard check\` to review.`
    );
  }
  return blockStop(
    [
      from ? `[test-guard] Tests were weakened in this session (working tree and commits since ${from.slice(0, 7)}):` : "[test-guard] Tests were weakened in the working tree (compared with HEAD):",
      ...errors.map((f) => `- ${describe(f)}`),
      "Revert these test changes and fix the implementation instead.",
      "If you believe a test itself is wrong, stop and explain why to the user."
    ].join("\n")
  );
}
function blockedReason(violations) {
  const [first] = violations;
  const head = violations.length === 1 && first ? `[test-guard] Blocked: ${describe(first)}.` : [
    "[test-guard] Blocked:",
    ...violations.map((v) => `- ${describe(v)}`)
  ].join("\n");
  return `${head}
${ADVICE}`;
}
function describe(v) {
  const where = v.path ? ` in ${v.path}${v.line === void 0 ? "" : `:${v.line}`}` : "";
  return `${v.ruleId} \u2014 ${v.message}${where}`;
}
function list(files) {
  const shown = files.slice(0, 3).join(", ");
  return files.length > 3 ? `${shown} (+${files.length - 3} more)` : shown;
}
function findRepoRoot(start) {
  let dir = start;
  for (; ; ) {
    if (existsSync4(join4(dir, ".git"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}
function repoPath(root, file) {
  const rel = relative(root, file);
  if (rel.startsWith("..") || isAbsolute(rel)) return null;
  return normalizePath(rel);
}
var contexts = /* @__PURE__ */ new Map();
function loadContext(root) {
  let loaded = contexts.get(root);
  if (!loaded) {
    const config = parseConfig(readBlobIfExists(root, `HEAD:${CONFIG_FILE}`));
    loaded = {
      config,
      ctx: {
        ...createContext(config),
        // Before the tool runs, the disk is the "before" side.
        dirExisted: (dir) => {
          const path = join4(root, dir);
          return existsSync4(path) && readdirSync3(path).length > 0;
        }
      }
    };
    const head = resolveCommit(root, "HEAD");
    if (head) loaded.ctx.findLiteral = literalFinder(root, head, loaded.ctx);
    contexts.set(root, loaded);
  }
  return loaded;
}
function blockingRuleIds(config) {
  return activeRuleIds(config).filter((id) => config.rules[id] !== "warn");
}

// src/adapters/claude-code.ts
function runClaudeCodeHook(stdin) {
  return runHook(stdin, (input) => {
    const edit = fileEdit(input);
    if (edit) {
      const file = resolve4(edit.filePath);
      const current = existsSync5(file) ? readFileSync4(file, "utf8") : null;
      const next = applyEdit(edit, current);
      if (next === null) return [];
      return checkFileChange({
        beforePath: current === null ? null : file,
        before: current,
        afterPath: file,
        after: next
      });
    }
    const command = shellCommand(input);
    return command === null ? [] : checkShell(command, resolve4(input.cwd));
  });
}
function applyEdit(edit, current) {
  if (edit.kind === "write") return edit.content;
  if (current === null || edit.oldString === "") return null;
  let { oldString, newString } = edit;
  if (!current.includes(oldString) && current.includes("\r\n")) {
    oldString = oldString.replace(/\r?\n/g, "\r\n");
    newString = newString.replace(/\r?\n/g, "\r\n");
  }
  if (!current.includes(oldString)) return null;
  return edit.replaceAll ? current.split(oldString).join(newString) : current.replace(oldString, () => newString);
}

// src/adapters/codex.ts
import { existsSync as existsSync6, readFileSync as readFileSync5 } from "fs";
import { resolve as resolve6 } from "path";

// src/hook-io/codex.ts
function patchText(input) {
  if (input.toolName !== "apply_patch") return null;
  return typeof input.toolInput.command === "string" ? input.toolInput.command : null;
}
function shellCommand2(input) {
  if (input.toolName !== "Bash") return null;
  const { command } = input.toolInput;
  if (typeof command === "string") return command;
  if (Array.isArray(command) && command.every((c) => typeof c === "string")) {
    return command.join(" ");
  }
  return null;
}

// src/adapters/apply-patch.ts
import { resolve as resolve5 } from "path";
var PatchError = class extends Error {
};
var BEGIN = "*** Begin Patch";
var END = "*** End Patch";
var ADD = "*** Add File: ";
var DELETE2 = "*** Delete File: ";
var UPDATE = "*** Update File: ";
var MOVE2 = "*** Move to: ";
var EOF_MARKER = "*** End of File";
var CONTEXT = "@@ ";
var EMPTY_CONTEXT = "@@";
var ENVIRONMENT_ID = "*** Environment ID:";
function parsePatch(patch) {
  const lines = boundaries(patch.trim().split("\n").map(stripCr));
  let mode = "notStarted";
  const hunks = [];
  const lastChunks = () => {
    const last = hunks.at(-1);
    return last?.kind === "update" ? last.chunks : null;
  };
  const isEmpty = (c) => c !== void 0 && c.oldLines.length === 0 && c.newLines.length === 0;
  const ensureUpdateNotEmpty = () => {
    const chunks = lastChunks();
    if (!chunks) return;
    if (chunks.length === 0 && mode === "update") {
      throw new PatchError("update file hunk is empty");
    }
    if (isEmpty(chunks.at(-1))) {
      throw new PatchError("update hunk does not contain any lines");
    }
  };
  const headers = (trimmed) => {
    if (mode === "started" && trimmed.startsWith(ENVIRONMENT_ID)) return true;
    if (trimmed === END) {
      ensureUpdateNotEmpty();
      mode = "ended";
      return true;
    }
    for (const [marker, kind] of [
      [ADD, "add"],
      [DELETE2, "delete"],
      [UPDATE, "update"]
    ]) {
      if (trimmed.startsWith(marker)) {
        ensureUpdateNotEmpty();
        const path = trimmed.slice(marker.length);
        hunks.push(
          kind === "add" ? { kind, path, contents: "" } : kind === "delete" ? { kind, path } : { kind, path, chunks: [] }
        );
        mode = kind;
        return true;
      }
    }
    return false;
  };
  for (const line of lines) {
    const trimmed = line.trim();
    switch (mode) {
      case "notStarted":
        if (trimmed !== BEGIN) {
          throw new PatchError(`the first line must be '${BEGIN}'`);
        }
        mode = "started";
        break;
      case "started":
      case "delete":
        if (!headers(trimmed))
          throw new PatchError(`invalid hunk header: ${trimmed}`);
        break;
      case "add": {
        if (headers(trimmed)) break;
        const last = hunks.at(-1);
        if (!line.startsWith("+") || last?.kind !== "add") {
          throw new PatchError(`invalid hunk header: ${trimmed}`);
        }
        last.contents += `${line.slice(1)}
`;
        break;
      }
      case "update": {
        const updateLine = line.trimEnd();
        if (headers(updateLine)) break;
        const hunk = hunks.at(-1);
        if (hunk?.kind !== "update") throw new PatchError("no update hunk");
        const { chunks } = hunk;
        const last = chunks.at(-1);
        const isContextMarker = updateLine === EMPTY_CONTEXT || updateLine.startsWith(CONTEXT);
        if (last?.endOfFile) {
          if (updateLine === "") break;
          if (!isContextMarker) {
            throw new PatchError(`expected a @@ context marker, got: ${line}`);
          }
        }
        if (chunks.length === 0 && hunk.movePath === void 0 && updateLine.startsWith(MOVE2)) {
          hunk.movePath = updateLine.slice(MOVE2.length);
          break;
        }
        if (isContextMarker && isEmpty(last)) {
          throw new PatchError(`unexpected line in update hunk: ${line}`);
        }
        if (updateLine === EMPTY_CONTEXT) {
          chunks.push(newChunk());
          break;
        }
        if (updateLine.startsWith(CONTEXT)) {
          chunks.push({
            ...newChunk(),
            context: updateLine.slice(CONTEXT.length)
          });
          break;
        }
        if (updateLine === EOF_MARKER) {
          if (isEmpty(last)) {
            throw new PatchError("update hunk does not contain any lines");
          }
          if (last) last.endOfFile = true;
          break;
        }
        const prefix = line[0];
        if (line === "" || prefix === " " || prefix === "+" || prefix === "-") {
          if (chunks.length === 0) chunks.push(newChunk());
          const chunk = chunks.at(-1);
          const text = line.slice(1);
          if (line === "" || prefix === " ") {
            chunk.oldLines.push(text);
            chunk.newLines.push(text);
          } else if (prefix === "+") {
            chunk.newLines.push(text);
          } else {
            chunk.oldLines.push(text);
          }
          break;
        }
        throw new PatchError(`unexpected line in update hunk: ${line}`);
      }
      case "ended":
        if (trimmed !== "")
          throw new PatchError(`the last line must be '${END}'`);
        break;
    }
  }
  if (mode !== "ended") throw new PatchError(`the last line must be '${END}'`);
  return hunks;
}
function newChunk() {
  return { oldLines: [], newLines: [], endOfFile: false };
}
function stripCr(line) {
  return line.endsWith("\r") ? line.slice(0, -1) : line;
}
function boundaries(lines) {
  const ok = (l) => l[0]?.trim() === BEGIN && l.at(-1)?.trim() === END;
  if (ok(lines)) return lines;
  const first = lines[0];
  if ((first === "<<EOF" || first === "<<'EOF'" || first === '<<"EOF"') && lines.at(-1)?.endsWith("EOF") && lines.length >= 4) {
    const inner = lines.slice(1, -1);
    if (ok(inner)) return inner;
  }
  throw new PatchError(
    lines[0]?.trim() !== BEGIN ? `the first line must be '${BEGIN}'` : `the last line must be '${END}'`
  );
}
function applyChunks(original, chunks) {
  const lines = original.split("\n");
  if (lines.at(-1) === "") lines.pop();
  const replacements = [];
  let lineIndex = 0;
  for (const chunk of chunks) {
    if (chunk.context !== void 0) {
      const idx = seekSequence(lines, [chunk.context], lineIndex, false);
      if (idx === null) return null;
      lineIndex = idx + 1;
    }
    if (chunk.oldLines.length === 0) {
      const at = lines.at(-1) === "" ? lines.length - 1 : lines.length;
      replacements.push([at, 0, chunk.newLines]);
      continue;
    }
    let pattern = chunk.oldLines;
    let newSlice = chunk.newLines;
    let found = seekSequence(lines, pattern, lineIndex, chunk.endOfFile);
    if (found === null && pattern.at(-1) === "") {
      pattern = pattern.slice(0, -1);
      if (newSlice.at(-1) === "") newSlice = newSlice.slice(0, -1);
      found = seekSequence(lines, pattern, lineIndex, chunk.endOfFile);
    }
    if (found === null) return null;
    replacements.push([found, pattern.length, newSlice]);
    lineIndex = found + pattern.length;
  }
  replacements.sort((a, b) => a[0] - b[0]);
  for (const [start, length, segment] of replacements.reverse()) {
    lines.splice(
      start,
      Math.min(length, Math.max(lines.length - start, 0)),
      ...segment
    );
  }
  if (lines.at(-1) !== "") lines.push("");
  return lines.join("\n");
}
function seekSequence(lines, pattern, start, eof) {
  if (pattern.length === 0) return start;
  if (pattern.length > lines.length) return null;
  const searchStart = eof ? lines.length - pattern.length : start;
  const last = lines.length - pattern.length;
  const passes = [
    (s) => s,
    (s) => s.trimEnd(),
    (s) => s.trim(),
    normalise
  ];
  for (const norm of passes) {
    for (let i = searchStart; i <= last; i++) {
      if (pattern.every((p, j) => norm(lines[i + j] ?? "") === norm(p))) {
        return i;
      }
    }
  }
  return null;
}
function normalise(s) {
  return s.trim().replace(/[‐-―−]/g, "-").replace(/[‘-‛]/g, "'").replace(/[“-‟]/g, '"').replace(/[  -   　]/g, " ");
}
function simulatePatch(patch, cwd, read2) {
  const hunks = parsePatch(patch);
  const original = /* @__PURE__ */ new Map();
  const current = /* @__PURE__ */ new Map();
  const moves = /* @__PURE__ */ new Map();
  const get = (path) => {
    if (!current.has(path)) {
      const text = read2(path);
      original.set(path, text);
      current.set(path, text);
    }
    return current.get(path) ?? null;
  };
  for (const hunk of hunks) {
    const path = resolve5(cwd, hunk.path);
    if (hunk.kind === "add") {
      get(path);
      current.set(path, hunk.contents);
      continue;
    }
    const text = get(path);
    if (text === null) break;
    if (hunk.kind === "delete") {
      current.set(path, null);
      continue;
    }
    const next = applyChunks(text, hunk.chunks);
    if (next === null) break;
    if (hunk.movePath === void 0) {
      current.set(path, next);
    } else {
      const dest = resolve5(cwd, hunk.movePath);
      get(dest);
      current.set(path, null);
      current.set(dest, next);
      moves.set(dest, path);
    }
  }
  const files = [];
  const paired = /* @__PURE__ */ new Set();
  for (const [dest, source] of moves) {
    files.push({
      beforePath: source,
      before: original.get(source) ?? null,
      afterPath: dest,
      after: current.get(dest) ?? null
    });
    paired.add(source).add(dest);
  }
  for (const [path, after] of current) {
    if (paired.has(path)) continue;
    const before = original.get(path) ?? null;
    if (before === after) continue;
    files.push({
      beforePath: before === null ? null : path,
      before,
      afterPath: after === null ? null : path,
      after
    });
  }
  return files;
}

// src/adapters/codex.ts
function runCodexHook(stdin) {
  return runHook(stdin, (input) => {
    const cwd = resolve6(input.cwd);
    const patch = patchText(input);
    if (patch !== null) {
      let files;
      try {
        files = simulatePatch(patch, cwd, read);
      } catch (error) {
        if (error instanceof PatchError) return [];
        throw error;
      }
      return files.flatMap(checkFileChange);
    }
    const command = shellCommand2(input);
    return command === null ? [] : checkShell(command, cwd);
  });
}
function read(path) {
  return existsSync6(path) ? readFileSync5(path, "utf8") : null;
}

// src/install/agent-hooks.ts
import { existsSync as existsSync8, readFileSync as readFileSync7 } from "fs";
import { join as join6 } from "path";

// src/install/git-hook.ts
import {
  chmodSync,
  existsSync as existsSync7,
  mkdirSync as mkdirSync2,
  readFileSync as readFileSync6,
  writeFileSync as writeFileSync2
} from "fs";
import { dirname as dirname2, join as join5 } from "path";
var InstallError = class extends Error {
};
var MARKER = "# test-guard:";
var LOCAL_CLI = "node_modules/test-guard/dist/cli.js";
var CHECK_ARGS = 'check --staged --message-file "$1"';
var HOOK_COMMAND = `npx --no-install test-guard ${CHECK_ARGS}`;
function localCli(root) {
  return existsSync7(join5(root, LOCAL_CLI)) ? LOCAL_CLI : null;
}
function hookScript(command = HOOK_COMMAND) {
  return [
    "#!/bin/sh",
    `${MARKER} blocks commits that weaken tests (test-guard install --pre-commit)`,
    `exec ${command}`,
    ""
  ].join("\n");
}
function installGitHook(cwd) {
  const root = findRoot(cwd);
  const path = gitPath(root, "hooks/commit-msg");
  const local = localCli(root);
  const command = local ? `node ${local} ${CHECK_ARGS}` : HOOK_COMMAND;
  const existing = existsSync7(path) ? readFileSync6(path, "utf8") : null;
  if (existing !== null && !existing.includes(MARKER)) {
    throw new InstallError(
      `${path} already exists and was not created by test-guard.
Add this line to it instead:
  ${command}`
    );
  }
  mkdirSync2(dirname2(path), { recursive: true });
  writeFileSync2(path, hookScript(command));
  chmodSync(path, 493);
  return { path, updated: existing !== null };
}

// src/install/agent-hooks.ts
var AGENTS = ["claude-code", "codex"];
var SPECS3 = {
  "claude-code": {
    file: [".claude", "settings.json"],
    preToolUseMatcher: "Edit|Write|Bash|PowerShell",
    // A local install runs `node` directly: npx costs ~1 s per call.
    handler: (arg, local) => local ? {
      type: "command",
      command: "node",
      args: [
        `\${CLAUDE_PROJECT_DIR}/${local}`,
        "hook",
        "claude-code",
        arg
      ]
    } : {
      type: "command",
      command: `npx --no-install test-guard hook claude-code ${arg}`
    }
  },
  codex: {
    file: [".codex", "hooks.json"],
    preToolUseMatcher: "Bash|apply_patch",
    // Codex has no project-dir placeholder and runs hooks in the session cwd,
    // via `$SHELL -lc` or, on Windows, `cmd.exe /C`. A `for /f` lookup of the
    // git root never ran inside Codex on Windows (docs/agents/codex.md), so
    // Windows uses npx, which finds the local install from any subdirectory.
    handler: (arg, local) => local ? {
      type: "command",
      command: `node "$(git rev-parse --show-toplevel)/${local}" hook codex ${arg}`,
      commandWindows: `npx --no-install test-guard hook codex ${arg}`
    } : {
      type: "command",
      command: `npx --no-install test-guard hook codex ${arg}`
    },
    note: "Codex runs project hooks only after you trust them: open Codex and run /hooks."
  }
};
function planAgentHooks(root, agent) {
  const spec = SPECS3[agent];
  const path = join6(root, ...spec.file);
  const before = existsSync8(path) ? readFileSync7(path, "utf8") : null;
  const settings = parseSettings(path, before);
  const hooks = isObject4(settings.hooks) ? settings.hooks : {};
  const local = localCli(root);
  for (const { event, arg, matcher } of [
    {
      event: "PreToolUse",
      arg: "pre-tool-use",
      matcher: spec.preToolUseMatcher
    },
    { event: "Stop", arg: "stop", matcher: void 0 }
  ]) {
    const entries = Array.isArray(hooks[event]) ? hooks[event] : [];
    const text = JSON.stringify(entries);
    if (text.includes("test-guard") && text.includes(arg)) continue;
    entries.push({
      ...matcher && { matcher },
      hooks: [spec.handler(arg, local)]
    });
    hooks[event] = entries;
  }
  settings.hooks = hooks;
  const after = `${JSON.stringify(settings, null, 2)}
`;
  return { path, before, after, changed: after !== before, note: spec.note };
}
function formatDiff(before, after) {
  const b = before === null ? [] : before.replace(/\r\n/g, "\n").split("\n");
  const a = after.split("\n");
  const hunks = diffLines(b, a);
  const deleted = new Set(hunks.flatMap((h) => h.deleted));
  const added2 = new Set(hunks.flatMap((h) => h.added));
  const out = [];
  let i = 0;
  let j = 0;
  while (i < b.length || j < a.length) {
    if (i < b.length && deleted.has(i + 1)) out.push(`- ${b[i++]}`);
    else if (j < a.length && added2.has(j + 1)) out.push(`+ ${a[j++]}`);
    else {
      out.push(`  ${a[j] ?? ""}`);
      i++;
      j++;
    }
  }
  return `${out.join("\n").trimEnd()}
`;
}
function parseSettings(path, text) {
  if (text === null || text.trim() === "") return {};
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    throw new InstallError(`${path} is not valid JSON`);
  }
  if (!isObject4(value)) throw new InstallError(`${path} is not a JSON object`);
  return value;
}
function isObject4(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// src/output.ts
var COMPARE_LABELS = {
  worktree: "working tree \u2194 HEAD",
  staged: "staged \u2194 HEAD"
};
var ADVICE2 = "Fix the implementation instead of weakening tests.";
function formatJson(report, version) {
  const count2 = (severity) => report.findings.filter((f) => f.severity === severity).length;
  return `${JSON.stringify(
    {
      tool: "test-guard",
      version,
      compare: { mode: report.mode.kind, from: report.from },
      findings: report.findings,
      summary: {
        error: count2("error"),
        warn: count2("warn"),
        filesScanned: report.filesScanned
      },
      ...report.approval !== void 0 && {
        approval: { source: "trailer", reason: report.approval }
      }
    },
    null,
    2
  )}
`;
}
function formatText(report, version, c) {
  const { findings, filesScanned } = report;
  const lines = [
    `test-guard ${version} \xB7 compare: ${compareLabel(report)} \xB7 ${plural(filesScanned, "test file")}`,
    ""
  ];
  if (findings.length === 0) {
    lines.push(c.green("No test weakening found."));
    return `${lines.join("\n")}
`;
  }
  const locations = findings.map(location);
  const width = Math.max(...locations.map((l) => l.length));
  findings.forEach((f, i) => {
    const badge = f.severity === "error" ? c.bgRed(c.white(c.bold(" ERROR "))) : c.bgYellow(c.black(c.bold(" WARN  ")));
    lines.push(
      ` ${badge}  ${f.ruleId}  ${(locations[i] ?? "").padEnd(width)}   ${f.message}`
    );
  });
  lines.push("");
  const hasError = findings.some((f) => f.severity === "error");
  lines.push(
    plural(findings.length, "violation") + (hasError && report.approval === void 0 ? ` \xB7 ${ADVICE2}` : "")
  );
  if (report.approval !== void 0) {
    lines.push(c.yellow(`Approved by commit trailer: ${report.approval}`));
  }
  return `${lines.join("\n")}
`;
}
function formatMarkdown(report) {
  const { findings, filesScanned } = report;
  const lines = [
    "### test-guard",
    "",
    `Compare: ${compareLabel(report)} \xB7 ${plural(filesScanned, "test file")}`,
    ""
  ];
  if (findings.length === 0) {
    lines.push("\u2705 No test weakening found.");
    return `${lines.join("\n")}
`;
  }
  lines.push("| Severity | Rule | Location | Message |", "|---|---|---|---|");
  for (const f of findings) {
    const severity = f.severity === "error" ? "\u274C error" : "\u26A0\uFE0F warn";
    lines.push(
      `| ${severity} | ${f.ruleId} | \`${cell(location(f))}\` | ${cell(f.message)} |`
    );
  }
  lines.push("", `**${plural(findings.length, "violation")}** \xB7 ${ADVICE2}`);
  return `${lines.join("\n")}
`;
}
function compareLabel({ mode }) {
  return mode.kind === "base" ? `HEAD \u2194 merge-base(${mode.ref})` : COMPARE_LABELS[mode.kind];
}
function location(f) {
  return f.line === void 0 ? f.path : `${f.path}:${f.line}`;
}
function cell(text) {
  return text.replace(/\|/g, "\\|").replace(/\n/g, " ");
}
function plural(n, word2) {
  return `${n} ${word2}${n === 1 ? "" : "s"}`;
}

// src/cli.ts
async function main(argv, io) {
  let exitCode = 0;
  const program2 = new Command("test-guard").version(package_default.version).exitOverride().configureOutput({ writeOut: io.stdout, writeErr: io.stderr });
  program2.command("check").description("report tests that were deleted, skipped or weakened").addOption(
    new Option(
      "--staged",
      "compare the index with HEAD (pre-commit)"
    ).conflicts("base")
  ).option("--base <ref>", "compare HEAD with merge-base(<ref>, HEAD) (CI)").option("--json", "print JSON").option(
    "--rules <ids>",
    "comma-separated rule IDs, e.g. TG001,TG004",
    parseRules
  ).addOption(
    new Option(
      "--message-file <path>",
      "commit message to read a Test-Guard-Approved trailer from (commit-msg hook)"
    ).conflicts("base")
  ).option("--summary <file>", "append a Markdown report (GitHub Job Summary)").action((flags) => {
    exitCode = check(flags, io);
  });
  program2.command("install").description("install git hooks or agent hooks").option(
    "--pre-commit",
    "run `check --staged` on every commit (installed as a commit-msg hook)"
  ).option(
    "--agent <name>",
    "add agent hooks to its settings (claude-code, codex)"
  ).option("-y, --yes", "write agent settings without asking").action(async (flags) => {
    exitCode = await install(flags, io);
  });
  program2.command("hook").description("run as an agent hook (hook JSON on stdin)").argument("<agent>", "claude-code | codex").argument("<event>", "pre-tool-use | stop").action(async (agent, event) => {
    exitCode = await hook(agent, event, io);
  });
  try {
    await program2.parseAsync(argv, { from: "user" });
  } catch (error) {
    if (error instanceof CommanderError) {
      if (error.exitCode === 0) return 0;
      return argv[0] === "hook" ? 1 : 2;
    }
    throw error;
  }
  return exitCode;
}
function check(flags, io) {
  const mode = flags.base !== void 0 ? { kind: "base", ref: flags.base } : flags.staged ? { kind: "staged" } : { kind: "worktree" };
  try {
    const report = runCheck({ cwd: io.cwd, mode, rules: flags.rules });
    const hasError = report.findings.some((f) => f.severity === "error");
    if (flags.messageFile !== void 0) {
      const message = readFileSync8(resolve7(io.cwd, flags.messageFile), "utf8");
      report.approval = findApproval(message);
    }
    if (flags.summary !== void 0) {
      appendFileSync(resolve7(io.cwd, flags.summary), formatMarkdown(report));
    }
    io.stdout(
      flags.json ? formatJson(report, package_default.version) : formatText(report, package_default.version, (0, import_picocolors.createColors)(io.color ?? false))
    );
    if (!hasError || report.approval !== void 0) return 0;
    if (flags.messageFile !== void 0 && !flags.json) {
      io.stdout(
        "If this change is intentional, add a commit message trailer:\n  Test-Guard-Approved: <reason>\n"
      );
    }
    return 1;
  } catch (error) {
    return fail(error, io);
  }
}
async function install(flags, io) {
  if (!flags.preCommit && flags.agent === void 0) {
    io.stderr(
      "test-guard: nothing to install (use --pre-commit or --agent <claude-code|codex>)\n"
    );
    return 2;
  }
  try {
    if (flags.preCommit) {
      const { path, updated } = installGitHook(io.cwd);
      io.stdout(
        `${updated ? "Updated" : "Installed"} commit-msg hook: ${path}
`
      );
    }
    if (flags.agent !== void 0) {
      const agent = flags.agent;
      if (!AGENTS.includes(agent)) {
        throw new InstallError(
          `unsupported agent: ${flags.agent} (supported: ${AGENTS.join(", ")})`
        );
      }
      const plan = planAgentHooks(findRoot(io.cwd), agent);
      if (!plan.changed) {
        io.stdout(`test-guard hooks are already in ${plan.path}
`);
        return 0;
      }
      io.stdout(`${plan.path}
${formatDiff(plan.before, plan.after)}`);
      const ok = flags.yes || (await io.confirm?.("Write these changes? [y/N] ") ?? false);
      if (!ok) {
        io.stdout("Not written. Re-run with --yes to write without asking.\n");
        return 1;
      }
      mkdirSync3(dirname3(plan.path), { recursive: true });
      writeFileSync3(plan.path, plan.after);
      io.stdout(`Written: ${plan.path}
`);
      if (plan.note) io.stdout(`${plan.note}
`);
    }
    return 0;
  } catch (error) {
    return fail(error, io);
  }
}
async function hook(agent, event, io) {
  const run = agent === "claude-code" ? runClaudeCodeHook : agent === "codex" ? runCodexHook : null;
  if (!run || !["pre-tool-use", "stop"].includes(event)) {
    io.stdout(notifyUser(`test-guard: unsupported hook "${agent} ${event}"`));
    return 0;
  }
  io.stdout(run(await io.readStdin?.() ?? ""));
  return 0;
}
function fail(error, io) {
  io.stderr(
    `test-guard: ${error instanceof Error ? error.message : String(error)}
`
  );
  return 2;
}
function parseRules(value) {
  const ids = value.split(",").map((id) => id.trim().toUpperCase());
  const unknown = ids.filter((id) => !isRuleId(id));
  if (unknown.length > 0) {
    throw new InvalidArgumentError(`unknown rule: ${unknown.join(", ")}`);
  }
  return ids;
}

// src/bin.ts
process.exitCode = await main(process.argv.slice(2), {
  cwd: process.cwd(),
  stdout: (text) => process.stdout.write(text),
  stderr: (text) => process.stderr.write(text),
  color: import_picocolors2.default.isColorSupported,
  readStdin: async () => {
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    return Buffer.concat(chunks).toString("utf8");
  },
  confirm: process.stdin.isTTY ? async (question) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    const answer = await rl.question(question);
    rl.close();
    return /^y(es)?$/i.test(answer.trim());
  } : void 0
});
