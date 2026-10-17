#!/usr/bin/env node
import { createRequire as tgCreateRequire } from 'node:module';
const require = tgCreateRequire(import.meta.url);
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
  "node_modules/.pnpm/picocolors@1.1.1/node_modules/picocolors/picocolors.js"(exports, module2) {
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
    module2.exports = createColors2();
    module2.exports.createColors = createColors2;
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
      constructor(name2, description) {
        this.description = description || "";
        this.variadic = false;
        this.parseArg = void 0;
        this.defaultValue = void 0;
        this.defaultValueDescription = void 0;
        this.argChoices = void 0;
        switch (name2[0]) {
          case "<":
            this.required = true;
            this._name = name2.slice(1, -1);
            break;
          case "[":
            this.required = false;
            this._name = name2.slice(1, -1);
            break;
          default:
            this.required = true;
            this._name = name2;
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
        const args2 = cmd.registeredArguments.map((arg) => humanReadableArgName(arg)).join(" ");
        return cmd._name + (cmd._aliases[0] ? "|" + cmd._aliases[0] : "") + (cmd.options.length ? " [options]" : "") + // simplistic check for non-help option
        (args2 ? " " + args2 : "");
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
      longestSubcommandTermLength(cmd, helper4) {
        return helper4.visibleCommands(cmd).reduce((max, command) => {
          return Math.max(
            max,
            this.displayWidth(
              helper4.styleSubcommandTerm(helper4.subcommandTerm(command))
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
      longestOptionTermLength(cmd, helper4) {
        return helper4.visibleOptions(cmd).reduce((max, option) => {
          return Math.max(
            max,
            this.displayWidth(helper4.styleOptionTerm(helper4.optionTerm(option)))
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
      longestGlobalOptionTermLength(cmd, helper4) {
        return helper4.visibleGlobalOptions(cmd).reduce((max, option) => {
          return Math.max(
            max,
            this.displayWidth(helper4.styleOptionTerm(helper4.optionTerm(option)))
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
      longestArgumentTermLength(cmd, helper4) {
        return helper4.visibleArguments(cmd).reduce((max, argument) => {
          return Math.max(
            max,
            this.displayWidth(
              helper4.styleArgumentTerm(helper4.argumentTerm(argument))
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
      formatItemList(heading, items, helper4) {
        if (items.length === 0) return [];
        return [helper4.styleTitle(heading), ...items, ""];
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
      formatHelp(cmd, helper4) {
        const termWidth = helper4.padWidth(cmd, helper4);
        const helpWidth = helper4.helpWidth ?? 80;
        function callFormatItem(term, description) {
          return helper4.formatItem(term, termWidth, description, helper4);
        }
        let output = [
          `${helper4.styleTitle("Usage:")} ${helper4.styleUsage(helper4.commandUsage(cmd))}`,
          ""
        ];
        const commandDescription = helper4.commandDescription(cmd);
        if (commandDescription.length > 0) {
          output = output.concat([
            helper4.boxWrap(
              helper4.styleCommandDescription(commandDescription),
              helpWidth
            ),
            ""
          ]);
        }
        const argumentList = helper4.visibleArguments(cmd).map((argument) => {
          return callFormatItem(
            helper4.styleArgumentTerm(helper4.argumentTerm(argument)),
            helper4.styleArgumentDescription(helper4.argumentDescription(argument))
          );
        });
        output = output.concat(
          this.formatItemList("Arguments:", argumentList, helper4)
        );
        const optionGroups = this.groupItems(
          cmd.options,
          helper4.visibleOptions(cmd),
          (option) => option.helpGroupHeading ?? "Options:"
        );
        optionGroups.forEach((options, group) => {
          const optionList = options.map((option) => {
            return callFormatItem(
              helper4.styleOptionTerm(helper4.optionTerm(option)),
              helper4.styleOptionDescription(helper4.optionDescription(option))
            );
          });
          output = output.concat(this.formatItemList(group, optionList, helper4));
        });
        if (helper4.showGlobalOptions) {
          const globalOptionList = helper4.visibleGlobalOptions(cmd).map((option) => {
            return callFormatItem(
              helper4.styleOptionTerm(helper4.optionTerm(option)),
              helper4.styleOptionDescription(helper4.optionDescription(option))
            );
          });
          output = output.concat(
            this.formatItemList("Global Options:", globalOptionList, helper4)
          );
        }
        const commandGroups = this.groupItems(
          cmd.commands,
          helper4.visibleCommands(cmd),
          (sub) => sub.helpGroup() || "Commands:"
        );
        commandGroups.forEach((commands, group) => {
          const commandList = commands.map((sub) => {
            return callFormatItem(
              helper4.styleSubcommandTerm(helper4.subcommandTerm(sub)),
              helper4.styleSubcommandDescription(helper4.subcommandDescription(sub))
            );
          });
          output = output.concat(this.formatItemList(group, commandList, helper4));
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
        return str.split(" ").map((word3) => {
          if (word3 === "[options]") return this.styleOptionText(word3);
          if (word3 === "[command]") return this.styleSubcommandText(word3);
          if (word3[0] === "[" || word3[0] === "<")
            return this.styleArgumentText(word3);
          return this.styleCommandText(word3);
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
        return str.split(" ").map((word3) => {
          if (word3 === "[options]") return this.styleOptionText(word3);
          if (word3[0] === "[" || word3[0] === "<")
            return this.styleArgumentText(word3);
          return this.styleSubcommandText(word3);
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
      padWidth(cmd, helper4) {
        return Math.max(
          helper4.longestOptionTermLength(cmd, helper4),
          helper4.longestGlobalOptionTermLength(cmd, helper4),
          helper4.longestSubcommandTermLength(cmd, helper4),
          helper4.longestArgumentTermLength(cmd, helper4)
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
      formatItem(term, termWidth, description, helper4) {
        const itemIndent = 2;
        const itemIndentStr = " ".repeat(itemIndent);
        if (!description) return itemIndentStr + term;
        const paddedTerm = term.padEnd(
          termWidth + term.length - helper4.displayWidth(term)
        );
        const spacerWidth = 2;
        const helpWidth = this.helpWidth ?? 80;
        const remainingWidth = helpWidth - termWidth - spacerWidth - itemIndent;
        let formattedDescription;
        if (remainingWidth < this.minWidthToWrap || helper4.preformatted(description)) {
          formattedDescription = description;
        } else {
          const wrappedDescription = helper4.boxWrap(description, remainingWidth);
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
      constructor(flags2, description) {
        this.flags = flags2;
        this.description = description || "";
        this.required = flags2.includes("<");
        this.optional = flags2.includes("[");
        this.variadic = /\w\.\.\.[>\]]$/.test(flags2);
        this.mandatory = false;
        const optionFlags = splitOptionFlags(flags2);
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
      env(name2) {
        this.envVar = name2;
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
      return str.split("-").reduce((str2, word3) => {
        return str2 + word3[0].toUpperCase() + word3.slice(1);
      });
    }
    function splitOptionFlags(flags2) {
      let shortFlag;
      let longFlag;
      const shortFlagExp = /^-[^-]$/;
      const longFlagExp = /^--[^-]/;
      const flagParts = flags2.split(/[ |,]+/).concat("guard");
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
        const baseError = `option creation failed due to '${unsupportedFlag}' in option flags '${flags2}'`;
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
          `option creation failed due to no flags found in '${flags2}'.`
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
      for (let i2 = 0; i2 <= a.length; i2++) {
        d[i2] = [i2];
      }
      for (let j = 0; j <= b.length; j++) {
        d[0][j] = j;
      }
      for (let j = 1; j <= b.length; j++) {
        for (let i2 = 1; i2 <= a.length; i2++) {
          let cost = 1;
          if (a[i2 - 1] === b[j - 1]) {
            cost = 0;
          } else {
            cost = 1;
          }
          d[i2][j] = Math.min(
            d[i2 - 1][j] + 1,
            // deletion
            d[i2][j - 1] + 1,
            // insertion
            d[i2 - 1][j - 1] + cost
            // substitution
          );
          if (i2 > 1 && j > 1 && a[i2 - 1] === b[j - 2] && a[i2 - 2] === b[j - 1]) {
            d[i2][j] = Math.min(d[i2][j], d[i2 - 2][j - 2] + 1);
          }
        }
      }
      return d[a.length][b.length];
    }
    function suggestSimilar(word3, candidates2) {
      if (!candidates2 || candidates2.length === 0) return "";
      candidates2 = Array.from(new Set(candidates2));
      const searchingOptions = word3.startsWith("--");
      if (searchingOptions) {
        word3 = word3.slice(2);
        candidates2 = candidates2.map((candidate) => candidate.slice(2));
      }
      let similar = [];
      let bestDistance = maxDistance;
      const minSimilarity = 0.4;
      candidates2.forEach((candidate) => {
        if (candidate.length <= 1) return;
        const distance = editDistance(word3, candidate);
        const length = Math.max(word3.length, candidate.length);
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
    var fs2 = __require("fs");
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
      constructor(name2) {
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
        this._name = name2 || "";
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
        const [, name2, args2] = nameAndArgs.match(/([^ ]+) *(.*)/);
        const cmd = this.createCommand(name2);
        if (desc) {
          cmd.description(desc);
          cmd._executableHandler = true;
        }
        if (opts.isDefault) this._defaultCommandName = cmd._name;
        cmd._hidden = !!(opts.noHelp || opts.hidden);
        cmd._executableFile = opts.executableFile || null;
        if (args2) cmd.arguments(args2);
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
      createCommand(name2) {
        return new _Command(name2);
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
      createArgument(name2, description) {
        return new Argument2(name2, description);
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
      argument(name2, description, parseArg, defaultValue) {
        const argument = this.createArgument(name2, description);
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
          this._exitCallback = (err2) => {
            if (err2.code !== "commander.executeSubCommandAsync") {
              throw err2;
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
        const listener = (args2) => {
          const expectedArgsCount = this.registeredArguments.length;
          const actionArgs = args2.slice(0, expectedArgsCount);
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
      createOption(flags2, description) {
        return new Option2(flags2, description);
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
        } catch (err2) {
          if (err2.code === "commander.invalidArgument") {
            const message = `${invalidArgumentMessage} ${err2.message}`;
            this.error(message, { exitCode: err2.exitCode, code: err2.code });
          }
          throw err2;
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
          (name2) => this._findCommand(name2)
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
        const name2 = option.attributeName();
        if (option.negate) {
          const positiveLongFlag = option.long.replace(/^--no-/, "--");
          if (!this._findOption(positiveLongFlag)) {
            this.setOptionValueWithSource(
              name2,
              option.defaultValue === void 0 ? true : option.defaultValue,
              "default"
            );
          }
        } else if (option.defaultValue !== void 0) {
          this.setOptionValueWithSource(name2, option.defaultValue, "default");
        }
        const handleOptionValue = (val, invalidValueMessage, valueSource) => {
          if (val == null && option.presetArg !== void 0) {
            val = option.presetArg;
          }
          const oldValue = this.getOptionValue(name2);
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
          this.setOptionValueWithSource(name2, val, valueSource);
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
      _optionEx(config, flags2, description, fn, defaultValue) {
        if (typeof flags2 === "object" && flags2 instanceof Option2) {
          throw new Error(
            "To add an Option object use addOption() instead of option() or requiredOption()"
          );
        }
        const option = this.createOption(flags2, description);
        option.makeOptionMandatory(!!config.mandatory);
        if (typeof fn === "function") {
          option.default(defaultValue).argParser(fn);
        } else if (fn instanceof RegExp) {
          const regex2 = fn;
          fn = (val, def) => {
            const m = regex2.exec(val);
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
      option(flags2, description, parseArg, defaultValue) {
        return this._optionEx({}, flags2, description, parseArg, defaultValue);
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
      requiredOption(flags2, description, parseArg, defaultValue) {
        return this._optionEx(
          { mandatory: true },
          flags2,
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
        if (fs2.existsSync(executableFile)) return;
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
      _executeSubCommand(subcommand, args2) {
        args2 = args2.slice();
        let launchWithNode = false;
        const sourceExt = [".js", ".ts", ".tsx", ".mjs", ".cjs"];
        function findFile(baseDir, baseName) {
          const localBin = path.resolve(baseDir, baseName);
          if (fs2.existsSync(localBin)) return localBin;
          if (sourceExt.includes(path.extname(baseName))) return void 0;
          const foundExt = sourceExt.find(
            (ext) => fs2.existsSync(`${localBin}${ext}`)
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
            resolvedScriptPath = fs2.realpathSync(this._scriptPath);
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
            args2.unshift(executableFile);
            args2 = incrementNodeInspectorPort(process2.execArgv).concat(args2);
            proc = childProcess.spawn(process2.argv[0], args2, { stdio: "inherit" });
          } else {
            proc = childProcess.spawn(executableFile, args2, { stdio: "inherit" });
          }
        } else {
          this._checkForMissingExecutable(
            executableFile,
            executableDir,
            subcommand._name
          );
          args2.unshift(executableFile);
          args2 = incrementNodeInspectorPort(process2.execArgv).concat(args2);
          proc = childProcess.spawn(process2.execPath, args2, { stdio: "inherit" });
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
        proc.on("error", (err2) => {
          if (err2.code === "ENOENT") {
            this._checkForMissingExecutable(
              executableFile,
              executableDir,
              subcommand._name
            );
          } else if (err2.code === "EACCES") {
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
            wrappedError.nestedError = err2;
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
        this.registeredArguments.forEach((arg, i2) => {
          if (arg.required && this.args[i2] == null) {
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
      _findCommand(name2) {
        if (!name2) return void 0;
        return this.commands.find(
          (cmd) => cmd._name === name2 || cmd._aliases.includes(name2)
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
      parseOptions(args2) {
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
        let i2 = 0;
        while (i2 < args2.length || activeGroup) {
          const arg = activeGroup ?? args2[i2++];
          activeGroup = null;
          if (arg === "--") {
            if (dest === unknown) dest.push(arg);
            dest.push(...args2.slice(i2));
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
                const value = args2[i2++];
                if (value === void 0) this.optionMissingArgument(option);
                this.emit(`option:${option.name()}`, value);
              } else if (option.optional) {
                let value = null;
                if (i2 < args2.length && (!maybeOption(args2[i2]) || negativeNumberArg(args2[i2]))) {
                  value = args2[i2++];
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
              unknown.push(...args2.slice(i2));
              break;
            } else if (this._getHelpCommand() && arg === this._getHelpCommand().name()) {
              operands.push(arg, ...args2.slice(i2));
              break;
            } else if (this._defaultCommandName) {
              unknown.push(arg, ...args2.slice(i2));
              break;
            }
          }
          if (this._passThroughOptions) {
            dest.push(arg, ...args2.slice(i2));
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
          for (let i2 = 0; i2 < len; i2++) {
            const key = this.options[i2].attributeName();
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
      missingArgument(name2) {
        const message = `error: missing required argument '${name2}'`;
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
      version(str, flags2, description) {
        if (str === void 0) return this._version;
        this._version = str;
        flags2 = flags2 || "-V, --version";
        description = description || "output the version number";
        const versionOption = this.createOption(flags2, description);
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
          const args2 = this.registeredArguments.map((arg) => {
            return humanReadableArgName(arg);
          });
          return [].concat(
            this.options.length || this._helpOption !== null ? "[options]" : [],
            this.commands.length ? "[command]" : [],
            this.registeredArguments.length ? args2 : []
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
        const helper4 = this.createHelp();
        const context = this._getOutputContext(contextOptions);
        helper4.prepareContext({
          error: context.error,
          helpWidth: context.helpWidth,
          outputHasColors: context.hasColors
        });
        const text = helper4.formatHelp(this, helper4);
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
      helpOption(flags2, description) {
        if (typeof flags2 === "boolean") {
          if (flags2) {
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
          flags2 ?? "-h, --help",
          description ?? "display help for command"
        );
        if (flags2 || description) this._initOptionGroup(this._helpOption);
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
      _outputHelpIfRequested(args2) {
        const helpOption = this._getHelpOption();
        const helpRequested = helpOption && args2.find((arg) => helpOption.is(arg));
        if (helpRequested) {
          this.outputHelp();
          this._exit(0, "commander.helpDisplayed", "(outputHelp)");
        }
      }
    };
    function incrementNodeInspectorPort(args2) {
      return args2.map((arg) => {
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
    exports.createCommand = (name2) => new Command2(name2);
    exports.createOption = (flags2, description) => new Option2(flags2, description);
    exports.createArgument = (name2, description) => new Argument2(name2, description);
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
  "node_modules/.pnpm/picomatch@4.0.7/node_modules/picomatch/lib/constants.js"(exports, module2) {
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
    module2.exports = {
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
  "node_modules/.pnpm/picomatch@4.0.7/node_modules/picomatch/lib/scan.js"(exports, module2) {
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
      const parts2 = [];
      let str = input;
      let index = -1;
      let start2 = 0;
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
          if (prev === CHAR_DOT && index === start2 + 1) {
            start2 += 2;
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
            if (code === CHAR_EXCLAMATION_MARK && index === start2) {
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
        if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start2) {
          negated = token.negated = true;
          start2++;
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
      if (start2 > 0) {
        prefix = str.slice(0, start2);
        str = str.slice(start2);
        lastIndex -= start2;
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
        start: start2,
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
          const n2 = prevIndex !== void 0 ? prevIndex + 1 : start2;
          const i2 = slashes[idx];
          const value2 = input.slice(n2, i2);
          if (opts.tokens) {
            if (idx === 0 && start2 !== 0) {
              tokens[idx].isPrefix = true;
              tokens[idx].value = prefix;
            } else {
              tokens[idx].value = value2;
            }
            depth(tokens[idx]);
            state.maxDepth += tokens[idx].depth;
          }
          if (i2 >= start2) {
            parts2.push(value2);
            prevIndex = i2;
          }
        }
        const n = prevIndex !== void 0 ? prevIndex + 1 : start2;
        const value = input.slice(n);
        parts2.push(value);
        if (opts.tokens && prevIndex && prevIndex + 1 < input.length) {
          tokens[tokens.length - 1].value = value;
          depth(tokens[tokens.length - 1]);
          state.maxDepth += tokens[tokens.length - 1].depth;
        }
        state.slashes = slashes;
        state.parts = parts2;
      }
      return state;
    };
    module2.exports = scan;
  }
});

// node_modules/.pnpm/picomatch@4.0.7/node_modules/picomatch/lib/parse.js
var require_parse = __commonJS({
  "node_modules/.pnpm/picomatch@4.0.7/node_modules/picomatch/lib/parse.js"(exports, module2) {
    "use strict";
    var constants4 = require_constants();
    var utils = require_utils();
    var {
      MAX_LENGTH,
      POSIX_REGEX_SOURCE,
      REGEX_NON_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_BACKREF,
      REPLACEMENTS
    } = constants4;
    var expandRange = (args2, options) => {
      if (typeof options.expandRange === "function") {
        return options.expandRange(...args2, options);
      }
      args2.sort();
      const value = `[${args2.join("-")}]`;
      try {
        new RegExp(value);
      } catch (ex) {
        return args2.map((v) => utils.escapeRegex(v)).join("..");
      }
      return value;
    };
    var syntaxError = (type, char) => {
      return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
    };
    var splitTopLevel = (input) => {
      const parts2 = [];
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
              parts2.push(value);
              value = "";
              continue;
            }
          }
        }
        value += ch;
      }
      parts2.push(value);
      return parts2;
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
      for (let i2 = 0; i2 < values.length; i2++) {
        for (let j = i2 + 1; j < values.length; j++) {
          const a = values[i2];
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
      for (let i2 = 1; i2 < pattern.length; i2++) {
        const ch = pattern[i2];
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
            if (requireEnd === true && i2 !== pattern.length - 1) {
              return;
            }
            return {
              type: pattern[0],
              body: pattern.slice(2, i2),
              end: i2
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
    var analyzeRepeatedExtglob = (body2, options) => {
      if (options.maxExtglobRecursion === false) {
        return { risky: false };
      }
      const max = typeof options.maxExtglobRecursion === "number" ? options.maxExtglobRecursion : constants4.DEFAULT_MAX_EXTGLOB_RECURSION;
      const branches = splitTopLevel(body2).map((branch) => branch.trim());
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
        const literal3 = normalizeSimpleBranch(branch);
        if (literal3 && literal3.length === 1) {
          safeChars.push(literal3);
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
    var parse2 = (input, options) => {
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
      const PLATFORM_CHARS = constants4.globChars(opts.windows);
      const EXTGLOB_CHARS = constants4.extglobChars(PLATFORM_CHARS);
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
        let count4 = 1;
        while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
          advance();
          state.start++;
          count4++;
        }
        if (count4 % 2 === 0) {
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
        const literal3 = input.slice(token.startIndex, state.index + 1);
        const body2 = input.slice(token.startIndex + 2, state.index);
        const analysis = analyzeRepeatedExtglob(body2, opts);
        if ((token.type === "plus" || token.type === "star") && analysis.risky) {
          const safeOutput = analysis.safeOutput ? (token.output ? "" : ONE_CHAR) + (opts.capture ? `(${analysis.safeOutput})` : analysis.safeOutput) : void 0;
          const open = tokens[token.tokensIndex];
          open.type = "text";
          open.value = literal3;
          open.output = safeOutput || utils.escapeRegex(literal3);
          for (let i2 = token.tokensIndex + 1; i2 < tokens.length; i2++) {
            tokens[i2].value = "";
            tokens[i2].output = "";
            delete tokens[i2].suffix;
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
            const expression = parse2(rest, { ...options, fastpaths: false }).output;
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
                const posix2 = POSIX_REGEX_SOURCE[rest2];
                if (posix2) {
                  prev.value = pre + posix2;
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
            for (let i2 = arr.length - 1; i2 >= 0; i2--) {
              tokens.pop();
              if (arr[i2].type === "brace") {
                break;
              }
              if (arr[i2].type !== "dots") {
                range.unshift(arr[i2].value);
              }
            }
            output = expandRange(range, opts);
            state.backtrack = true;
          }
          if (brace.comma !== true && brace.dots !== true) {
            const out2 = state.output.slice(0, brace.outputIndex);
            const toks = state.tokens.slice(brace.tokensIndex);
            brace.value = brace.output = "\\{";
            value = output = "\\}";
            state.output = out2;
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
            const after2 = input[state.index + 4];
            if (after2 && after2 !== "/") {
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
    parse2.fastpaths = (input, options) => {
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
      } = constants4.globChars(opts.windows);
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
    module2.exports = parse2;
  }
});

// node_modules/.pnpm/picomatch@4.0.7/node_modules/picomatch/lib/picomatch.js
var require_picomatch = __commonJS({
  "node_modules/.pnpm/picomatch@4.0.7/node_modules/picomatch/lib/picomatch.js"(exports, module2) {
    "use strict";
    var scan = require_scan();
    var parse2 = require_parse();
    var utils = require_utils();
    var constants4 = require_constants();
    var isObject5 = (val) => val && typeof val === "object" && !Array.isArray(val);
    var picomatch6 = (glob, options, returnState = false) => {
      if (Array.isArray(glob)) {
        const fns = glob.map((input) => picomatch6(input, options, returnState));
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
      const posix2 = opts.windows;
      const regex2 = isState ? picomatch6.compileRe(glob, options) : picomatch6.makeRe(glob, options, false, true);
      const state = regex2.state;
      delete regex2.state;
      let isIgnored = () => false;
      if (opts.ignore) {
        const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
        isIgnored = picomatch6(opts.ignore, ignoreOpts, returnState);
      }
      const matcher = (input, returnObject = false) => {
        const { isMatch, match, output } = picomatch6.test(input, regex2, options, { glob, posix: posix2 });
        const result = { glob, state, regex: regex2, posix: posix2, input, output, match, isMatch };
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
    picomatch6.test = (input, regex2, options, { glob, posix: posix2 } = {}) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected input to be a string");
      }
      if (input === "") {
        return { isMatch: false, output: "" };
      }
      const opts = options || {};
      const format = opts.format || (posix2 ? utils.toPosixSlashes : null);
      let match = input === glob;
      let output = match && format ? format(input) : input;
      if (match === false) {
        output = format ? format(input) : input;
        match = output === glob;
      }
      if (match === false || opts.capture === true) {
        if (opts.matchBase === true || opts.basename === true) {
          match = picomatch6.matchBase(input, regex2, options, posix2);
        } else {
          match = regex2.exec(output);
        }
      }
      return { isMatch: Boolean(match), match, output };
    };
    picomatch6.matchBase = (input, glob, options, posix2 = options && options.windows) => {
      const regex2 = glob instanceof RegExp ? glob : picomatch6.makeRe(glob, options);
      return regex2.test(utils.basename(input, { windows: posix2 }));
    };
    picomatch6.isMatch = (str, patterns, options) => picomatch6(patterns, options)(str);
    picomatch6.parse = (pattern, options) => {
      if (Array.isArray(pattern)) return pattern.map((p) => picomatch6.parse(p, options));
      return parse2(pattern, { ...options, fastpaths: false });
    };
    picomatch6.scan = (input, options) => scan(input, options);
    picomatch6.compileRe = (state, options, returnOutput = false, returnState = false) => {
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
      const regex2 = picomatch6.toRegex(source, options);
      if (returnState === true) {
        regex2.state = state;
      }
      return regex2;
    };
    picomatch6.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
      if (!input || typeof input !== "string") {
        throw new TypeError("Expected a non-empty string");
      }
      let parsed = { negated: false, fastpaths: true };
      if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) {
        parsed.output = parse2.fastpaths(input, options);
      }
      if (!parsed.output) {
        parsed = parse2(input, options);
      }
      return picomatch6.compileRe(parsed, options, returnOutput, returnState);
    };
    picomatch6.toRegex = (source, options) => {
      try {
        const opts = options || {};
        return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
      } catch (err2) {
        if (options && options.debug === true) throw err2;
        return /$^/;
      }
    };
    picomatch6.constants = constants4;
    module2.exports = picomatch6;
  }
});

// node_modules/.pnpm/picomatch@4.0.7/node_modules/picomatch/index.js
var require_picomatch2 = __commonJS({
  "node_modules/.pnpm/picomatch@4.0.7/node_modules/picomatch/index.js"(exports, module2) {
    "use strict";
    var pico = require_picomatch();
    var utils = require_utils();
    function picomatch6(glob, options, returnState = false) {
      if (options && (options.windows === null || options.windows === void 0)) {
        options = { ...options, windows: utils.isWindows() };
      }
      return pico(glob, options, returnState);
    }
    Object.assign(picomatch6, pico);
    module2.exports = picomatch6;
  }
});

// src/bin.ts
var import_picocolors2 = __toESM(require_picocolors(), 1);
import { createInterface } from "readline/promises";

// src/cli.ts
import {
  appendFileSync,
  mkdirSync as mkdirSync3,
  readFileSync as readFileSync9,
  writeFileSync as writeFileSync3
} from "fs";
import { dirname as dirname4, resolve as resolve8 } from "path";

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
  version: "0.4.0",
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
  exports: {
    "./probity": {
      types: "./dist/probity.d.ts",
      default: "./dist/probity.js"
    },
    "./package.json": "./package.json"
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
    prepublishOnly: "node scripts/check-release.mjs && npm run build",
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
    "tree-sitter-java": "0.23.5",
    "tree-sitter-python": "0.25.0",
    "tree-sitter-typescript": "0.23.2",
    tsup: "^8.5.1",
    typescript: "^7.0.2",
    vitest: "^4.1.11",
    "web-tree-sitter": "0.27.1"
  }
};

// src/adapters/claude-code.ts
import { existsSync as existsSync6, readFileSync as readFileSync4 } from "fs";
import { resolve as resolve5 } from "path";

// src/hook-io/common.ts
var HookInputError = class extends Error {
};
function parseHookInput(text) {
  let raw;
  try {
    raw = JSON.parse(text.replace(/^\uFEFF/, ""));
  } catch {
    throw new HookInputError("stdin is not valid JSON");
  }
  if (!isObject(raw)) throw new HookInputError('stdin JSON has no "cwd"');
  const [root] = Array.isArray(raw.workspace_roots) ? raw.workspace_roots : [];
  const cwd = typeof raw.cwd === "string" ? raw.cwd : typeof root === "string" ? root.replace(/^\/([A-Za-z]:)/, "$1") : void 0;
  if (cwd === void 0) throw new HookInputError('stdin JSON has no "cwd"');
  const sessionId = typeof raw.session_id === "string" && raw.session_id !== "" ? raw.session_id : void 0;
  if (raw.hook_event_name === "PreToolUse" || raw.hook_event_name === "preToolUse") {
    const text2 = raw.tool_input;
    if (typeof raw.tool_name !== "string" || !(isObject(text2) || typeof text2 === "string")) {
      throw new HookInputError("PreToolUse input has no tool_name/tool_input");
    }
    const object = typeof text2 === "string" ? jsonObject(text2) : text2;
    return {
      event: "PreToolUse",
      cwd,
      sessionId,
      toolName: raw.tool_name,
      ...object === void 0 ? { toolInput: {}, toolText: String(text2) } : { toolInput: object }
    };
  }
  if (raw.hook_event_name === "Stop" || raw.hook_event_name === "stop") {
    return {
      event: "Stop",
      cwd,
      sessionId,
      // Cursor counts the follow-ups a stop hook has started instead.
      stopHookActive: raw.stop_hook_active === true || typeof raw.loop_count === "number" && raw.loop_count > 0
    };
  }
  throw new HookInputError(
    `unsupported hook event: ${String(raw.hook_event_name)}`
  );
}
function jsonObject(text) {
  try {
    const value = JSON.parse(text);
    return isObject(value) ? value : void 0;
  } catch {
    return void 0;
  }
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
  const filePath = t.file_path ?? t.path;
  if (typeof filePath !== "string") return null;
  if (toolName === "Delete") return { kind: "delete", filePath };
  const content = t.content ?? t.file_text;
  if (toolName === "Write" && typeof content === "string") {
    return { kind: "write", filePath, content };
  }
  const oldString = t.old_string ?? t.old_str;
  const newString = t.new_string ?? t.new_str;
  if ((toolName === "Edit" || toolName === "Write") && typeof oldString === "string" && typeof newString === "string") {
    return {
      kind: "edit",
      filePath,
      oldString,
      newString,
      replaceAll: t.replace_all === true
    };
  }
  return null;
}
function patchText(input) {
  return input.toolName === "Edit" && input.toolText !== void 0 ? input.toolText : null;
}
function shellCommand(input) {
  if (!["Bash", "PowerShell", "Shell"].includes(input.toolName)) {
    return null;
  }
  return typeof input.toolInput.command === "string" ? input.toolInput.command : null;
}
function shellDir(input) {
  const { cwd, working_directory } = input.toolInput;
  if (typeof cwd === "string") return cwd;
  return typeof working_directory === "string" ? working_directory : void 0;
}
function forCursor(stdin, output) {
  if (output === "") return output;
  let input;
  let parsed;
  try {
    input = JSON.parse(stdin.replace(/^\uFEFF/, ""));
    parsed = JSON.parse(output);
  } catch {
    return output;
  }
  const isCursor = typeof input === "object" && input !== null && "cursor_version" in input;
  const decision = typeof parsed === "object" && parsed !== null && "hookSpecificOutput" in parsed ? parsed.hookSpecificOutput : void 0;
  if (!isCursor) return output;
  const message = typeof parsed === "object" && parsed !== null && "systemMessage" in parsed ? String(parsed.systemMessage) : void 0;
  if (message !== void 0 && input.hook_event_name === "preToolUse") {
    return `${JSON.stringify({ permission: "allow", user_message: message })}
`;
  }
  if (decision?.permissionDecision !== "deny") return output;
  const reason = String(decision.permissionDecisionReason ?? "");
  return `${JSON.stringify({ permission: "deny", user_message: reason, agent_message: reason })}
`;
}

// src/adapters/agent.ts
var import_picomatch5 = __toESM(require_picomatch2(), 1);
import { existsSync as existsSync5, readdirSync as readdirSync3, readFileSync as readFileSync3, statSync as statSync4 } from "fs";
import { dirname as dirname2, isAbsolute, join as join5, relative, resolve as resolve3 } from "path";

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
function createContext(config, runner = []) {
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
  const byRunner = config.languages.includes("js") ? runnerMatcher(runner) : () => false;
  const runnerOnly = (path) => {
    const normalized = normalizePath(path);
    return match(normalized) === null && byRunner(normalized);
  };
  return {
    detect: (path) => {
      if (excluded(path)) return null;
      return match(normalizePath(path)) ?? (runnerOnly(path) ? "js" : null);
    },
    excluded,
    runnerOnly
  };
}
function runnerMatcher(patterns) {
  const groups = /* @__PURE__ */ new Map();
  for (const pattern of patterns) {
    const base = import_picomatch2.default.scan(pattern).base.replace(/\\(.)/g, "$1");
    const group = groups.get(base);
    if (group) group.push(pattern);
    else groups.set(base, [pattern]);
  }
  const matchers = new Map(
    [...groups].map(([base, group]) => [
      base,
      (0, import_picomatch2.default)(group, { ignore: "**/node_modules/**" })
    ])
  );
  return (path) => {
    const parts2 = path.split("/");
    for (let i2 = 0; i2 <= parts2.length; i2++) {
      if (matchers.get(parts2.slice(0, i2).join("/"))?.(path)) return true;
    }
    return false;
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
var tg001 = ({ before, after: after2, afterPath }) => {
  if (!before || after2) return [];
  return [
    {
      ruleId: "TG001",
      path: before.stats.path,
      message: afterPath ? `moved test file to non-test path ${afterPath}` : "deleted test file"
    }
  ];
};

// src/rules/tg002.ts
var tg002 = ({ before, after: after2 }) => {
  if (!before || !after2 || after2.stats.tests >= before.stats.tests) return [];
  const dead = after2.deadTests - before.deadTests;
  return [
    {
      ruleId: "TG002",
      path: after2.stats.path,
      message: `test cases ${before.stats.tests} \u2192 ${after2.stats.tests}${dead > 0 ? ` (${dead} in code that never runs)` : ""}`,
      before: before.stats.tests,
      after: after2.stats.tests
    }
  ];
};

// src/rules/tg003.ts
var tg003 = ({ before, after: after2 }) => {
  if (!before || !after2 || after2.stats.assertions >= before.stats.assertions) {
    return [];
  }
  const swallowed = after2.swallowed - before.swallowed;
  const unreachable = after2.unreachable - before.unreachable;
  const notes = [
    swallowed > 0 && `${swallowed} inside a try/catch that ignores failures`,
    unreachable > 0 && `${unreachable} in code that never runs`
  ].filter(Boolean);
  return [
    {
      ruleId: "TG003",
      path: after2.stats.path,
      message: `assertions ${before.stats.assertions} \u2192 ${after2.stats.assertions}${notes.length > 0 ? ` (${notes.join(", ")})` : ""}`,
      before: before.stats.assertions,
      after: after2.stats.assertions
    }
  ];
};

// src/rules/tg004.ts
var tg004 = ({ before, after: after2, hunks }) => {
  if (!after2) return [];
  const beforeSkips = before?.stats.skips ?? 0;
  const afterSkips = after2.stats.skips;
  if (afterSkips <= beforeSkips) return [];
  const added2 = new Set(hunks.flatMap((hunk) => hunk.added));
  const hits2 = after2.skips.filter((skip) => added2.has(skip.line));
  if (hits2.length === 0) {
    return [
      {
        ruleId: "TG004",
        path: after2.stats.path,
        message: `skips ${beforeSkips} \u2192 ${afterSkips}`,
        before: beforeSkips,
        after: afterSkips
      }
    ];
  }
  return hits2.map((skip) => ({
    ruleId: "TG004",
    path: after2.stats.path,
    line: skip.line,
    message: `added \`${skip.text}\``
  }));
};

// src/rules/tg005.ts
var import_picomatch3 = __toESM(require_picomatch2(), 1);

// src/mocha.ts
var CONFIG_FILES = [
  ".mocharc.js",
  ".mocharc.cjs",
  ".mocharc.mjs",
  ".mocharc.yaml",
  ".mocharc.yml",
  ".mocharc.jsonc",
  ".mocharc.json"
];
var VALUED = /^(?:-r|--require|-R|--reporter|-O|--reporter-options?|-u|--ui|-t|--timeout|-s|--slow|-g|--grep|-f|--fgrep|--config|--package|--extension|--file|--ignore|--exclude|-n|--node-option|-j|--jobs|--retries|--watch-files|--watch-ignore|--opts|--loader|--import|--globals|--project)$/;
var GLOB = /[*?{[]/;
var MOCHA = /(?:^|[\\/])(?:_?mocha|ts-mocha|electron-mocha)(?:\.js)?(?:@\S+)?$/;
var RUNNER = /^(?:npx|pnpx|bunx|yarn|pnpm|npm|bun|nyc|c8|cross-env|env|dotenv|node|ts-node|tsx|[A-Za-z_]\w*=\S*)$/;
var PATH = /^[\w./*{}[\]!?@,+~-]+$/;
function mochaTestPatterns(read3) {
  let pkg = {};
  try {
    const text = (read3("package.json") ?? "{}").trimStart();
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") pkg = parsed;
  } catch {
  }
  const config = CONFIG_FILES.map(read3).find((text) => text !== null) ?? null;
  const runs2 = Object.values(record(pkg.scripts)).filter((s) => typeof s === "string").flatMap((script) => script.split(/&&|\|\||[;|]/)).flatMap((command) => {
    const all = words(command);
    const at = all.findIndex((w) => MOCHA.test(unquote(w)));
    return at === 0 || at > 0 && RUNNER.test(all[0] ?? "") ? [all.slice(at + 1)] : [];
  });
  const deps = {
    ...record(pkg.dependencies),
    ...record(pkg.devDependencies)
  };
  if (!("mocha" in deps) && runs2.length === 0 && config === null) {
    return [];
  }
  const specs = [];
  const quoted2 = [];
  const spec = (word3) => {
    const path = quotedPath(word3);
    if (path === null) specs.push(unquote(word3));
    else if (path !== "") quoted2.push(path);
  };
  let recursive = false;
  const extensions = /* @__PURE__ */ new Set(["js", "cjs", "mjs"]);
  for (const args2 of runs2) {
    for (let i2 = 0; i2 < args2.length; i2++) {
      const word3 = unquote(args2[i2] ?? "");
      const [option = "", value] = word3.split(/=(.*)/);
      const next = () => value ?? unquote(args2[++i2] ?? "");
      if (option === "--recursive") recursive = true;
      else if (option === "--spec") {
        if (value === void 0) spec(args2[++i2] ?? "");
        else specs.push(value);
      } else if (option === "--extension") extensions.add(next());
      else if (option === "-p" && /\.json$/.test(args2[i2 + 1] ?? "")) i2++;
      else if (VALUED.test(option)) {
        if (value === void 0) i2++;
      } else if (!word3.startsWith("-") && word3 !== "") spec(args2[i2] ?? "");
    }
  }
  const mocha = record(pkg.mocha);
  specs.push(...strings(mocha.spec));
  if (mocha.recursive === true) recursive = true;
  for (const e of strings(mocha.extension)) extensions.add(e);
  if (config !== null) {
    specs.push(...configValues(config, "spec"));
    if (/\brecursive['"]?\s*[:=]\s*true\b/.test(config)) recursive = true;
    for (const e of configValues(config, "extension")) extensions.add(e);
  }
  const paths = [...quoted2, ...specs.flatMap(pathsIn)];
  if (paths.length === 0) paths.push("test");
  const ext = [...extensions].map((e) => e.replace(/^\./, "")).filter(Boolean).join(",");
  return paths.map(
    (path) => GLOB.test(path) || /\.[cm]?[jt]sx?$/.test(path) ? path : `${path}/${recursive ? "**/" : ""}*.{${ext}}`
  );
}
function pathsIn(spec) {
  const clean = (s) => s.replace(/\\/g, "/").replace(/^(?:\.\/)+/, "").replace(/\/+$/, "");
  if (PATH.test(spec.replace(/\\/g, "/"))) return [clean(spec)].filter(Boolean);
  return [...spec.matchAll(/(['"`])([^'"`]+)\1/g)].map(([, , s]) => clean(s ?? "")).filter((s) => s !== "" && PATH.test(s));
}
function record(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function strings(value) {
  if (typeof value === "string") return [value];
  return Array.isArray(value) ? value.filter((v) => typeof v === "string") : [];
}
var unquote = (word3) => word3.replace(/^(['"])(.*)\1$/, "$2");
var words = (command) => command.match(/(?:"[^"]*"|'[^']*'|[^\s"']|["'])+/g) ?? [];
function quotedPath(word3) {
  const path = unquote(word3);
  if (path === word3 || /[$`'"]|\|\|/.test(path)) return null;
  return path.replace(/\\/g, "/").replace(/^(?:\.\/)+/, "").replace(/\/+$/, "");
}
function configValues(text, key) {
  const at = new RegExp(
    String.raw`(?:^|[\s{,])['"]?${key}['"]?[ \t]*:[ \t]*`,
    "m"
  ).exec(text);
  if (!at) return [];
  const rest = text.slice(at.index + at[0].length);
  const value = /^\[[^\]]*\]/.exec(rest)?.[0] ?? /^(?:\r?\n\s*-\s*[^\r\n]+)+/.exec(rest)?.[0] ?? /^[^\r\n,}]+/.exec(rest)?.[0] ?? "";
  return value.replace(/^\[|\]$/g, "").split(/,|\r?\n\s*-\s*/).map((s) => unquote(s.replace(/\s+#.*$/, "").trim())).filter(Boolean);
}

// src/node-test.ts
var EXT = "{js,cjs,mjs,ts,cts,mts}";
var DEFAULTS = [
  `**/*.test.${EXT}`,
  `**/*-test.${EXT}`,
  `**/*_test.${EXT}`,
  `**/test-*.${EXT}`,
  `**/test.${EXT}`,
  `**/test/**/*.${EXT}`
];
var NODE = /(?:^|[\\/])(?:node|tsx)(?:\.exe)?$/;
var VALUED2 = /^(?:-r|--require|--import|--loader|--experimental-loader|-C|--conditions|--env-file|--test-reporter|--test-reporter-destination|--test-name-pattern|--test-skip-pattern|--test-concurrency|--test-timeout|--test-shard|--test-isolation|--test-coverage-include|--test-coverage-exclude|--test-coverage-branches|--test-coverage-functions|--test-coverage-lines|--watch-path|--input-type|--stack-size|--max-old-space-size)$/;
var GLOB2 = /[*?{[(]/;
var PATTERN = /^[\w./*{}[\]!?@,+~()|-]+$/;
function nodeTestPatterns(read3) {
  let pkg = {};
  try {
    const text = (read3("package.json") ?? "{}").trimStart();
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") pkg = parsed;
  } catch {
  }
  const patterns = /* @__PURE__ */ new Set();
  const commands = Object.values(record(pkg.scripts)).filter((s) => typeof s === "string").flatMap(
    (script) => script.replace(/\\\r?\n/g, " ").split(/&&|\|\||;|\|(?![^()\s]*\))/)
  );
  for (const command of commands) {
    const all = words(command);
    const at = all.findIndex((w) => NODE.test(unquote(w)));
    if (at === -1 || at > 0 && !RUNNER.test(all[0] ?? "")) continue;
    let test = false;
    const given2 = [];
    for (let i2 = at + 1; i2 < all.length; i2++) {
      const word3 = unquote(all[i2] ?? "");
      const [option = "", value] = word3.split(/=(.*)/);
      if (option === "--test") test = true;
      else if (VALUED2.test(option)) {
        if (value === void 0) i2++;
      } else if (!word3.startsWith("-") && word3 !== "") {
        if (!test) break;
        given2.push(all[i2] ?? "");
      }
    }
    if (!test) continue;
    const paths = given2.flatMap((raw) => {
      const quoted2 = quotedPath(raw);
      if (quoted2 !== null) return quoted2 === "" ? [] : [quoted2];
      const word3 = unquote(raw);
      const path = word3.replace(/\\/g, "/").replace(/^(?:\.\/)+/, "").replace(/\/+$/, "");
      if (PATTERN.test(path)) return path === "" ? [] : [path];
      if (/[$`]/.test(word3)) return [`**/*.${EXT}`];
      return pathsIn(word3);
    });
    if (paths.length === 0) for (const p of DEFAULTS) patterns.add(p);
    for (const path of paths) {
      patterns.add(
        GLOB2.test(path) || /\.[cm]?[jt]s$/i.test(path) ? path : `${path}/**/*.${EXT}`
      );
    }
  }
  return [...patterns];
}

// src/runner-tests.ts
import { posix } from "path";
var NAME = /^(?:package\.json|\.mocharc(?:\.\w+)?)$/;
var OUTSIDE = /(?:^|\/)(?:node_modules|vendor|third_party|fixtures?|__fixtures__|testdata)\//;
var isRunnerFile = (path) => NAME.test(posix.basename(path)) && !OUTSIDE.test(path);
var literal = (dir) => dir.replace(/[*?[\]{}()!+@\\]/g, "\\$&");
function runnerTestPatterns(files) {
  const dirs = new Set([...files.keys()].map((path) => posix.dirname(path)));
  const configured = new Set(
    [...files.keys()].filter((path) => posix.basename(path).startsWith(".mocharc")).map((path) => posix.dirname(path))
  );
  return [...dirs].flatMap((dir) => {
    let from = dir;
    if (/mocha/.test(files.get(posix.join(dir, "package.json")) ?? "")) {
      while (!configured.has(from) && from !== ".") from = posix.dirname(from);
    }
    const read3 = (path) => files.get(posix.join(path.startsWith(".mocharc") ? from : dir, path)) ?? null;
    return [...mochaTestPatterns(read3), ...nodeTestPatterns(read3)].map(
      (pattern) => inDir(dir, pattern)
    );
  });
}
var inDir = (dir, pattern) => posix.normalize(dir === "." ? pattern : `${literal(dir)}/${pattern}`);

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
  } else if (beforeHooks && parses(afterLines)) {
    add("removed test-guard's hooks from the agent settings");
  } else {
    lineChanges(beforeLines.filter(mentions2), afterLines.filter(mentions2), add);
  }
  const disables = (lines) => lines.filter((line) => /"disableAllHooks"\s*:\s*true/.test(line)).length;
  if (disables(afterLines) > disables(beforeLines)) {
    add("turned on `disableAllHooks`, which stops test-guard\u2019s agent hooks");
  }
  const off = hooksTurnedOff(beforeLines.join("\n"), afterLines.join("\n"));
  if (off) add(off);
  const nonBlocking = (lines) => lines.filter((_, i2) => continuesOnError(lines, i2)).length;
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
var parses = (lines) => {
  try {
    parseJsonc(lines.join("\n"));
    return true;
  } catch {
    return false;
  }
};
function parseJsonc(text) {
  return JSON.parse(blankComments(text));
}
function blankComments(text) {
  return text.replace(
    /("(?:\\.|[^"\\])*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g,
    (match, str) => str ?? match.replace(/[^\n]/g, " ")
  );
}
function hooksTurnedOff(before, after2, project = []) {
  const [old, current] = [geminiSettings(before), geminiSettings(after2)];
  const config = (s) => isObject3(s.hooksConfig) ? s.hooksConfig : {};
  const [was, now] = [config(old), config(current)];
  if (now.enabled === false && was.enabled !== false) {
    return "turned off Gemini CLI hooks (`hooksConfig.enabled: false`), which stops test-guard";
  }
  const ours = /* @__PURE__ */ new Set();
  for (const s of [old, current, ...project.map(geminiSettings)]) {
    for (const entries of Object.values(isObject3(s.hooks) ? s.hooks : {})) {
      for (const entry of Array.isArray(entries) ? entries : []) {
        for (const hook2 of isObject3(entry) && Array.isArray(entry.hooks) ? entry.hooks : []) {
          if (!isObject3(hook2) || !JSON.stringify(hook2).includes("test-guard")) {
            continue;
          }
          for (const id of [hook2.name, hook2.command]) {
            if (typeof id === "string") ours.add(id);
          }
        }
      }
    }
  }
  const named = (c) => Array.isArray(c.disabled) ? c.disabled.filter(
    (n) => String(n).includes("test-guard") || ours.has(String(n))
  ) : [];
  const disabled = named(now).filter((n) => !named(was).includes(n));
  return disabled.length > 0 ? `turned off test-guard's Gemini CLI hook (\`hooksConfig.disabled\`: ${String(disabled[0])})` : null;
}
function geminiSettings(text) {
  try {
    const value = parseJsonc(text);
    return isObject3(value) ? value : {};
  } catch {
    return {};
  }
}
function lineChanges(before, after2, add) {
  const lost = added(after2, before);
  if (after2.length < before.length) {
    add(
      `removed test-guard from hook config (lines ${before.length} \u2192 ${after2.length})`,
      { before: before.length, after: after2.length }
    );
  } else if (lost.length > 0) {
    add(`changed how test-guard runs: \`${lost[0]}\``);
  }
}
var normalize = (line) => line.trim().replace(/,$/, "").replace(/(test-guard)@[\w.^~<>=*-]+/g, "$1").replace(/^("test-guard"\s*:\s*)"[^"]*"$/, '$1"*"');
function added(before, after2) {
  const remaining = /* @__PURE__ */ new Map();
  for (const line of before) {
    remaining.set(normalize(line), (remaining.get(normalize(line)) ?? 0) + 1);
  }
  return after2.filter((line) => {
    const left = remaining.get(normalize(line)) ?? 0;
    if (left > 0) remaining.set(normalize(line), left - 1);
    return left === 0;
  }).map(normalize);
}
function agentHooks(lines) {
  let settings;
  try {
    settings = parseJsonc(lines.join("\n"));
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
  const [start2, end] = yamlBlockRange(lines, index);
  return lines.slice(start2, end);
}
function yamlBlockRange(lines, index) {
  const line = lines[index] ?? "";
  const own = indent(line.replace(/-\s*/, (m) => " ".repeat(m.length)));
  let start2 = index;
  while (start2 > 0 && indent(lines[start2] ?? "") >= own) start2--;
  const parent = indent(lines[start2] ?? "");
  let end = index + 1;
  while (end < lines.length && ((lines[end] ?? "").trim() === "" || indent(lines[end] ?? "") > parent)) {
    end++;
  }
  return [start2, end];
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
  return lines.filter((line, i2) => {
    if (/^\s*-?\s*(?:if|skip|only|stages|files|exclude|glob|exclude_tags|piped|types|types_or|exclude_types)\s*:/.test(
      line
    )) {
      return yamlBlock(lines, i2).some((l) => l.includes("test-guard"));
    }
    if (!script || i2 >= last) return false;
    const text = line.trim();
    if (text.includes("husky.sh")) return false;
    if (/\b(?:exit|return|exec|kill)\b|^(?:\.|source|eval|trap)\s|^cd\b|\w+\s*\(\)\s*\{|\bPATH=/.test(
      text
    )) {
      return true;
    }
    const open = /^(?:if|while|until|case)\b/.exec(text);
    return open !== null && blockEnd(lines, i2) > last;
  });
}
function blockEnd(lines, start2) {
  let depth = 0;
  for (let i2 = start2; i2 < lines.length; i2++) {
    const text = lines[i2] ?? "";
    depth += (text.match(/(?:^|[;\s])(?:if|while|until|case)\b/g) ?? []).length;
    depth -= (text.match(/(?:^|[;\s])(?:fi|done|esac)\b/g) ?? []).length;
    if (depth <= 0) return i2;
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
var NODE_TEST = {
  re: /--test-(?:name-pattern|skip-pattern|only|shard)\b/,
  label: "node --test filter"
};
var TOKENS = {
  "package.json": [...JEST.map(word), NODE_TEST],
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
  NODE_TEST,
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
    re: /(?:^|\s)(?:-u|--updateSnapshot|--update-snapshots?|--test-update-snapshots|--snapshot-update)(?=[\s=]|$)/,
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
  for (let i2 = index - 1; i2 >= 0; i2--) {
    const line = lines[i2] ?? "";
    if (line.trim() === "" || indent2(line) >= own) continue;
    if (!/^\s*-?\s*run\s*:\s*[|>]/.test(line)) {
      if (/^\s*-?\s*[\w-]+\s*:/.test(line)) return [];
      own = indent2(line);
      continue;
    }
    const block = [line];
    for (let j = i2 + 1; j < lines.length; j++) {
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
    const [start2] = yamlBlockRange(lines, index);
    const old = !before.added.has(start2) || before.deleted.some((l) => TEST_COMMAND.test(l));
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
function removedTestCommands(before, after2) {
  const commands = (lines) => lines.map((l) => l.replace(/(?:^|\s)#.*$/, "").trim()).filter((l) => TEST_COMMAND.test(l) && !l.includes("test-guard"));
  const left = commands(after2);
  const removed = commands(before).filter((l) => {
    const i2 = left.indexOf(l);
    if (i2 === -1) return true;
    left.splice(i2, 1);
    return false;
  });
  return removed.slice(left.length);
}
var TEST_SCRIPT = /"test(?::[^"]*)?"\s*:/;
function outOfScope(kind, lines, index) {
  if (kind === "vitest" || kind === "vite") {
    const indent2 = (s) => s.length - s.trimStart().length;
    let own = Number.POSITIVE_INFINITY;
    for (let i2 = index; i2 >= 0; i2--) {
      const line = lines[i2] ?? "";
      if (line.trim() === "" || i2 < index && indent2(line) >= own) continue;
      if (/\bcoverage\b/.test(line)) return true;
      if (kind === "vite" && /\btest\s*:/.test(line)) return false;
      own = indent2(line);
      if (own === 0) break;
    }
    return kind === "vite";
  }
  if (kind === "maven") {
    for (let i2 = index; i2 >= 0; i2--) {
      const line = lines[i2] ?? "";
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
  for (let i2 = index; i2 >= 0; i2--) {
    const line = lines[i2] ?? "";
    if (/<\/plugin>/.test(line) && i2 !== index) depth++;
    if (/<plugin>/.test(line)) {
      if (depth > 0) {
        depth--;
        continue;
      }
      for (let j = i2; j <= index; j++) {
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
  const lost = mochaNarrowed(beforePath, afterPath, beforeLines, afterLines);
  if (lost && path) {
    findings.push({
      ruleId: "TG005",
      path,
      message: `narrowed Mocha's test files: \`${lost}\` no longer included`
    });
  }
  const lostNode = nodeNarrowed(beforePath, afterPath, beforeLines, afterLines);
  if (lostNode && path) {
    findings.push({
      ruleId: "TG005",
      path,
      message: `narrowed the files \`node --test\` runs: \`${lostNode}\` no longer included`
    });
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
var nameOf = (path) => path?.split("/").pop() ?? null;
function fromRoot(path, lines, of) {
  if (path === null) return [];
  const dir = path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : ".";
  return of((p) => p === nameOf(path) ? lines.join("\n") : null).map(
    (p) => inDir(dir, p)
  );
}
function nodeNarrowed(beforePath, afterPath, beforeLines, afterLines) {
  if (nameOf(beforePath) !== "package.json") return void 0;
  const patterns = (path, lines) => fromRoot(path, lines, nodeTestPatterns);
  const now = patterns(afterPath, afterLines);
  const reached = now.length > 0 ? (0, import_picomatch3.default)(now) : () => false;
  return patterns(beforePath, beforeLines).find(
    (pattern) => !now.includes(pattern) && samples(pattern).some((path) => !reached(path))
  );
}
function samples(pattern) {
  const brace = /\{([^{}]*)\}/.exec(pattern);
  if (brace) {
    return (brace[1] ?? "").split(",").flatMap((choice) => samples(pattern.replace(brace[0], choice)));
  }
  const path = pattern.replace(/\*\*\//g, "");
  return ["a", "z"].map((x) => path.replace(/[*?]/g, x));
}
function mochaNarrowed(beforePath, afterPath, beforeLines, afterLines) {
  const name2 = nameOf(beforePath) ?? "";
  if (name2 !== "package.json" && !/^\.mocharc(?:\.\w+)?$/.test(name2)) {
    return void 0;
  }
  const patterns = (path, lines) => fromRoot(path, lines, mochaTestPatterns);
  const now = new Set(patterns(afterPath, afterLines));
  return patterns(beforePath, beforeLines).find((p) => !now.has(p));
}

// src/languages/ast.ts
function reportsFailure(body2, fails, alwaysPasses, caught) {
  const quote = (s) => s.replace(/[$.]/g, "\\$&");
  const checked = (name2, code) => new RegExp(
    String.raw`(?:(?<![\w$.])(?:throw|raise)\b|(?<![\w$.])(?:expect|assert\w*)\s*\(|(?<![\w$.])assert\s)[^;\n{}]*?(?<![\w$.])${quote(name2)}(?![\w$])|\bif\b[^\n]*?(?<![\w$.])${quote(name2)}(?![\w$])[^\n]*?\b(?:throw|raise|fail)\b`
  ).test(code);
  if (caught) {
    const stored = new RegExp(
      String.raw`((?:self\.|this\.)?[\w$]+)\.(?:push|append|add|addError)\s*\([^;\n]*?(?<![\w$.])${quote(caught.name)}(?![\w$])`,
      "g"
    );
    for (const [, list2] of body2.matchAll(stored)) {
      if (list2 && checked(list2, caught.code)) return true;
    }
  }
  const kept = caught && new RegExp(
    `([\\w$]+)\\s*(?<![=!<>])=(?!=)\\s*${quote(caught.name)}(?![\\w$])`
  ).exec(body2)?.[1];
  if (caught && kept && new RegExp(
    `(?<![\\w$.])(?:(?:throw|raise)\\s+|(?:expect|assert\\w*)\\s*\\(\\s*|assert\\s+(?:not\\s+)?)${quote(kept)}(?![\\w$])`
  ).test(caught.code)) {
    return true;
  }
  return fails.test(body2.replace(alwaysPasses, " "));
}
var caughtIn = (handler, name2) => name2 ? { name: name2, code: handler.tree.rootNode.text } : void 0;
function descendants(node, types) {
  return node.descendantsOfType(types).filter((n) => n !== null);
}
var callee = (node) => (node?.text ?? "").replace(/\s+/g, "");
function insideSwallowingTry(node, tries, swallows3, ignores4 = () => false) {
  for (let n = node; n?.parent; n = n.parent) {
    const parent = n.parent;
    if (!tries.includes(parent.type)) continue;
    if (parent.childForFieldName("body")?.id === n.id) {
      if (swallows3(parent)) return true;
    } else if (ignores4(n)) {
      return true;
    }
  }
  return false;
}
var FALSY = /^(?:false|False|0|null|None|undefined)$/;
var TRUTHY = /^(?:true|True|1)$/;
var LITERAL = /^(?:false|False|0|null|None|undefined|true|True|1)$/;
function literalConstants(bindings2) {
  const count4 = /* @__PURE__ */ new Map();
  for (const [name2] of bindings2) count4.set(name2, (count4.get(name2) ?? 0) + 1);
  return new Map(
    bindings2.filter(
      ([name2, value]) => count4.get(name2) === 1 && LITERAL.test(value)
    )
  );
}
function truth(text, constants4) {
  let t = text.trim();
  while (/^\(.*\)$/s.test(t)) t = t.slice(1, -1).trim();
  const not = /^(?:!|not\s)\s*([\s\S]+)$/.exec(t);
  if (not) {
    const inner = truth(not[1] ?? "", constants4);
    return inner === null ? null : !inner;
  }
  t = constants4.get(t) ?? t;
  if (FALSY.test(t)) return false;
  if (TRUTHY.test(t)) return true;
  return null;
}
var EMPTY = /^(?:\[\]|\(\))$/;
var BLOCKS = ["program", "statement_block", "module", "block"];
var HOISTED = ["function_declaration", "generator_function_declaration"];
var has = (field, node) => field?.id === node.id;
function deadCode(never = () => false, constants4 = /* @__PURE__ */ new Map()) {
  const value = (node) => truth(node.childForFieldName("condition")?.text ?? "", constants4);
  const returns = (node) => {
    if (node?.type === "return_statement") return true;
    if (node?.type !== "if_statement" || value(node) !== true) return false;
    const then = node.childForFieldName("consequence");
    return returns(then) || (then?.namedChildren.some((c) => c?.type === "return_statement") ?? false);
  };
  const cut = /* @__PURE__ */ new Map();
  const returnAt = (block) => {
    let at = cut.get(block.id);
    if (at === void 0) {
      at = block.namedChildren.find(returns)?.endIndex ?? Number.POSITIVE_INFINITY;
      cut.set(block.id, at);
    }
    return at;
  };
  return (node) => {
    for (let n = node; n?.parent; n = n.parent) {
      const p = n.parent;
      if ((p.type === "if_statement" || p.type === "elif_clause") && has(p.childForFieldName("consequence"), n) && value(p) === false || p.type === "if_statement" && p.childrenForFieldName("alternative").some((a) => a && has(a, n)) && value(p) === true || p.type === "while_statement" && has(p.childForFieldName("body"), n) && value(p) === false || (p.type === "for_in_statement" || p.type === "for_statement") && has(p.childForFieldName("body"), n) && EMPTY.test(callee(p.childForFieldName("right"))) || BLOCKS.includes(p.type) && !HOISTED.includes(n.type) && n.startIndex >= returnAt(p) || never(n, p)) {
        return true;
      }
    }
    return false;
  };
}
var CALLS = ["call_expression", "call", "method_invocation"];
function callOf(name2) {
  const p = name2.parent;
  if (!p) return null;
  if (CALLS.includes(p.type) && (has(p.childForFieldName("function"), name2) || has(p.childForFieldName("name"), name2))) {
    return p;
  }
  const g = p.parent;
  if (g && CALLS.includes(g.type) && has(g.childForFieldName("function"), p) && (has(p.childForFieldName("property"), name2) || has(p.childForFieldName("attribute"), name2))) {
    return g;
  }
  return null;
}
function countAssertions(root, assertions, { dead, swallowed, helper: helper4 }) {
  let names;
  const uses = (name2) => {
    if (!names) {
      names = /* @__PURE__ */ new Map();
      for (const id of descendants(root, [
        "identifier",
        "property_identifier",
        "shorthand_property_identifier"
      ])) {
        const same2 = names.get(id.text) ?? [];
        same2.push(id);
        names.set(id.text, same2);
      }
    }
    return (names.get(name2.text) ?? []).filter((u) => u.id !== name2.id);
  };
  const lost = (node) => dead(node) ? "dead" : swallowed(node) ? "swallowed" : null;
  const counts = { assertions: 0, swallowed: 0, unreachable: 0 };
  for (const assertion of assertions) {
    let reason = lost(assertion);
    const found = reason ? null : helper4(assertion);
    if (found) {
      const reasons = uses(found.name).map((use) => {
        const call = callOf(use);
        return call && lost(call);
      });
      if (reasons.length === 0) {
        if (found.local) reason = "dead";
      } else if (reasons.every((r) => r)) {
        reason = reasons.every((r) => r === "dead") ? "dead" : "swallowed";
      }
    }
    if (reason === "dead") counts.unreachable++;
    else if (reason === "swallowed") counts.swallowed++;
    else counts.assertions++;
  }
  return counts;
}

// src/languages/strip.ts
function scanString(src, start2, quote, multiline) {
  let j = start2;
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
  const out2 = src.split("");
  return {
    blank(from, to) {
      for (let k = from; k < Math.min(to, out2.length); k++) {
        if (out2[k] !== "\n" && out2[k] !== "\r") out2[k] = " ";
      }
    },
    result: () => out2.join("")
  };
}
function stripCLike(src, options) {
  const out2 = createBlanker(src);
  const scanTemplate = (start2) => {
    let j = start2;
    let textStart = start2;
    while (j < src.length) {
      const ch = src[j];
      if (ch === "\\") {
        j += 2;
      } else if (ch === "`") {
        out2.blank(textStart, j);
        return j + 1;
      } else if (src.startsWith("${", j)) {
        out2.blank(textStart, j + 2);
        j = scanCode(j + 2, true);
        out2.blank(j - 1, j);
        textStart = j;
      } else {
        j++;
      }
    }
    out2.blank(textStart, src.length);
    return src.length;
  };
  const scanCode = (start2, inExpression) => {
    let i2 = start2;
    let depth = 0;
    while (i2 < src.length) {
      const ch = src[i2];
      if (src.startsWith("//", i2)) {
        const end = lineEnd(src, i2);
        out2.blank(i2, end);
        i2 = end;
      } else if (src.startsWith("/*", i2)) {
        const close = src.indexOf("*/", i2 + 2);
        const end = close === -1 ? src.length : close + 2;
        out2.blank(i2, end);
        i2 = end;
      } else if (options.textBlocks && src.startsWith('"""', i2)) {
        const scan = scanString(src, i2 + 3, '"""', true);
        out2.blank(i2 + 3, scan.contentEnd);
        i2 = scan.next;
      } else if (ch === '"' || ch === "'") {
        const scan = scanString(src, i2 + 1, ch, false);
        out2.blank(i2 + 1, scan.contentEnd);
        i2 = scan.next;
      } else if (options.templateLiterals && ch === "`") {
        i2 = scanTemplate(i2 + 1);
      } else if (inExpression && ch === "{") {
        depth++;
        i2++;
      } else if (inExpression && ch === "}") {
        if (depth === 0) return i2 + 1;
        depth--;
        i2++;
      } else {
        i2++;
      }
    }
    return i2;
  };
  scanCode(0, false);
  return out2.result();
}
function stripJava(src) {
  const options = { templateLiterals: false, textBlocks: true };
  if (!src.includes("\\u")) return stripCLike(src, options);
  const unicodeEscape = /\\u+([0-9a-fA-F]{4})/y;
  let decoded = "";
  const synthetic = [];
  let backslashes = 0;
  for (let i2 = 0; i2 < src.length; ) {
    unicodeEscape.lastIndex = i2;
    const match = backslashes % 2 === 0 ? unicodeEscape.exec(src) : null;
    if (match) {
      decoded += String.fromCharCode(Number.parseInt(match[1] ?? "", 16));
      synthetic.push(true);
      backslashes = 0;
      i2 += match[0].length;
    } else {
      const ch = src[i2] ?? "";
      decoded += ch;
      synthetic.push(false);
      backslashes = ch === "\\" ? backslashes + 1 : 0;
      i2++;
    }
  }
  const stripped = stripCLike(decoded, options);
  let out2 = "";
  for (let k = 0; k < stripped.length; k++) {
    const ch = stripped[k] ?? "";
    out2 += synthetic[k] && (ch === "\n" || ch === "\r") ? " " : ch;
  }
  return out2;
}
function stripPython(src) {
  const out2 = createBlanker(src);
  let i2 = 0;
  while (i2 < src.length) {
    const ch = src[i2];
    if (ch === "#") {
      const end = lineEnd(src, i2);
      out2.blank(i2, end);
      i2 = end;
    } else if (src.startsWith('"""', i2) || src.startsWith("'''", i2)) {
      const quote = src.slice(i2, i2 + 3);
      const scan = scanString(src, i2 + 3, quote, true);
      out2.blank(i2 + 3, scan.contentEnd);
      i2 = scan.next;
    } else if (ch === '"' || ch === "'") {
      const scan = scanString(src, i2 + 1, ch, false);
      out2.blank(i2 + 1, scan.contentEnd);
      i2 = scan.next;
    } else {
      i2++;
    }
  }
  return out2.result();
}

// src/languages/java.ts
var ASSERT_METHODS = "assertEquals|assertNotEquals|assertTrue|assertFalse|assertNull|assertNotNull|assertSame|assertNotSame|assertThrows|assertThrowsExactly|assertArrayEquals|assertThat|assertAll|assertDoesNotThrow|assertIterableEquals|assertLinesMatch|assertTimeout|assertTimeoutPreemptively|assertInstanceOf|fail";
var TEST_ANNOTATIONS = "Test|ParameterizedTest|RepeatedTest|TestFactory|TestTemplate";
var TRUSTED_PACKAGES = "org\\.junit\\.|org\\.testng\\.|junit\\.";
var ASSERTION_LIBRARIES = "org\\.hamcrest\\.|org\\.assertj\\.|com\\.google\\.common\\.truth\\.|org\\.springframework\\.";
var TYPES = [
  "class_declaration",
  "interface_declaration",
  "enum_declaration",
  "record_declaration",
  "annotation_type_declaration"
];
var TEST_NAME = new RegExp(`^(?:[\\w$]+\\.)*(?:${TEST_ANNOTATIONS})$`);
var TESTED = new RegExp(`@(?:[\\w$]+\\.)*(?:${TEST_ANNOTATIONS})\\b`);
var modifiersOf = (node) => node?.namedChildren.find((c) => c?.type === "modifiers")?.text ?? "";
function runs(node, junit4) {
  const method2 = node.parent?.parent;
  if (method2?.type === "method_declaration") {
    const modifiers = modifiersOf(method2);
    if (/\b(?:private|static)\b/.test(modifiers)) return false;
    if (junit4 && !/\bpublic\b/.test(modifiers)) return false;
    const factory = /\b(?:TestFactory|TestTemplate)$/.test(
      callee(node.childForFieldName("name"))
    );
    if (!junit4 && !factory && method2.childForFieldName("type")?.type !== "void_type") {
      return false;
    }
  }
  const types = [];
  for (let n = node.parent; n; n = n.parent) {
    if (TYPES.includes(n.type)) types.push(n);
  }
  if (types.some((t) => /\babstract\b/.test(modifiersOf(t)))) return false;
  return types.slice(0, -1).every((type) => {
    if (type.type !== "class_declaration") return true;
    return /@(?:[\w$]+\.)*Nested\b|\bstatic\b/.test(modifiersOf(type));
  });
}
var CATCHES_ASSERTIONS = /\b(?:Throwable|Error|AssertionError|AssertionFailedError|ComparisonFailure)\b/;
var HANDLER_FAILS = /(?<![\w$])(?:throw\b|fail\s*\(|assert\w*\s*\()/;
var ALWAYS_PASSES = /(?<![\w$])assert(?:True\s*\(\s*true|NotNull\s*\(\s*[\w$]+)\s*\)/g;
function ignores(clause) {
  if (clause.type !== "catch_clause") return false;
  const param = clause.namedChildren.find((c) => c?.type === "catch_formal_parameter")?.text ?? "";
  return CATCHES_ASSERTIONS.test(param) && !reportsFailure(
    clause.childForFieldName("body")?.text ?? "",
    HANDLER_FAILS,
    ALWAYS_PASSES,
    caughtIn(clause, /([\w$]+)\s*$/.exec(param)?.[1])
  );
}
var swallows = (tryNode) => tryNode.namedChildren.some((clause) => clause && ignores(clause));
function constants(root) {
  const bindings2 = [];
  for (const decl of descendants(root, ["variable_declarator"])) {
    const name2 = decl.childForFieldName("name");
    if (!name2) continue;
    const final = /\bfinal\b/.test(modifiersOf(decl.parent));
    bindings2.push([
      name2.text,
      final ? decl.childForFieldName("value")?.text ?? "" : ""
    ]);
  }
  for (const node of descendants(root, [
    "assignment_expression",
    "formal_parameter",
    "catch_formal_parameter"
  ])) {
    const name2 = node.childForFieldName("left") ?? node.childForFieldName("name");
    if (name2?.type === "identifier") bindings2.push([name2.text, ""]);
  }
  return literalConstants(bindings2);
}
function helper(node) {
  let fn = node.parent;
  while (fn && fn.type !== "method_declaration" && fn.type !== "lambda_expression") {
    fn = fn.parent;
  }
  if (fn?.type !== "method_declaration") return null;
  const modifiers = modifiersOf(fn);
  const name2 = fn.childForFieldName("name");
  if (!name2 || TESTED.test(modifiers)) return null;
  return {
    name: name2,
    local: /\bprivate\b/.test(modifiers) && !modifiers.includes("@")
  };
}
function count(root) {
  const imports = descendants(root, ["import_declaration"]).map((i2) => i2.text);
  const junit4 = imports.some((i2) => /\borg\.junit\.(?:Test|\*)\s*;/.test(i2)) && !imports.some((i2) => /\borg\.junit\.jupiter\./.test(i2));
  const tests = descendants(root, ["marker_annotation", "annotation"]).filter(
    (a) => TEST_NAME.test(callee(a.childForFieldName("name"))) && runs(a, junit4)
  ).length;
  const assertions = [
    ...descendants(root, ["method_invocation"]).filter(
      (m) => /^(?:assert\w*|fail)$/.test(m.childForFieldName("name")?.text ?? "")
    ),
    // `assert (x)` reads like a call.
    ...descendants(root, ["assert_statement"]).filter(
      (s) => /^assert\s*\(/.test(s.text)
    )
  ];
  return {
    tests,
    deadTests: 0,
    // `@Test` methods can't sit in dead code
    ...countAssertions(root, assertions, {
      dead: deadCode(void 0, constants(root)),
      swallowed: (node) => insideSwallowingTry(
        node,
        ["try_statement", "try_with_resources_statement"],
        swallows,
        ignores
      ),
      helper
    })
  };
}
var ASSERT_EQUAL = /^(?:assertEquals|assertSame|assertArrayEquals|assertIterableEquals)$/;
var VALUE_ASSERT = /^assert(?:Not)?(?:Equals|Same|ArrayEquals|IterableEquals|LinesMatch|InstanceOf)$/;
var DESCRIBES = /^(?:as|describedAs|withFailMessage|overridingErrorMessage|usingRecursiveComparison)$/;
var HAMCREST_EQUAL = /^(?:is|equalTo|sameInstance)$/;
var HAMCREST = /^(?:is|equalTo|sameInstance|not|hasSize|hasLength|hasItem|hasItems|hasKey|hasValue|hasToString|contains|containsInAnyOrder|containsString|startsWith|endsWith|greaterThan(?:OrEqualTo)?|lessThan(?:OrEqualTo)?|closeTo|everyItem|arrayContaining|arrayWithSize|iterableWithSize)$/;
function checks(root) {
  const found = [];
  const argsOf = (call) => (call.childForFieldName("arguments")?.namedChildren ?? []).filter(
    (a) => a !== null
  );
  const nameOf2 = (call) => call?.type === "method_invocation" ? call.childForFieldName("name")?.text ?? "" : "";
  for (const call of descendants(root, ["method_invocation"])) {
    const name2 = nameOf2(call);
    const args2 = argsOf(call);
    if (VALUE_ASSERT.test(name2)) {
      const string = (a) => a?.type === "string_literal";
      const readings = args2.length !== 3 ? [args2] : string(args2[0]) && !string(args2[2]) ? [args2.slice(1)] : string(args2[2]) && !string(args2[0]) ? [args2] : [args2, args2.slice(1)];
      const equal2 = ASSERT_EQUAL.test(name2);
      for (const [first, second] of readings) {
        if (first && second) {
          found.push({ node: call, sides: [first, second], equal: equal2 });
        }
      }
      continue;
    }
    if (name2 === "assertThat" && args2.length >= 2) {
      const [subject2, matcher] = args2.slice(-2);
      let expected = matcher ?? null;
      let equal2 = true;
      while (expected && argsOf(expected).length === 1 && HAMCREST.test(nameOf2(expected))) {
        equal2 &&= HAMCREST_EQUAL.test(nameOf2(expected));
        expected = argsOf(expected)[0] ?? null;
      }
      if (subject2 && expected && expected !== matcher) {
        found.push({ node: call, sides: [subject2, expected], equal: equal2 });
      }
      continue;
    }
    if (args2.length === 0) continue;
    let object = call.childForFieldName("object");
    let described = true;
    while (object && nameOf2(object) && nameOf2(object) !== "assertThat") {
      described &&= DESCRIBES.test(nameOf2(object));
      object = object.childForFieldName("object");
    }
    const [subject] = object && nameOf2(object) ? argsOf(object) : [];
    if (!subject) continue;
    const equal = /^(?:isEqualTo|isSameAs)$/.test(name2) && args2.length === 1 && described;
    for (const arg of args2) {
      found.push({ node: call, sides: [subject, arg], equal });
    }
  }
  return found;
}
var java = {
  strip: stripJava,
  checks,
  // A leading `.` is allowed: `Assertions.assertEquals(`.
  assertions: /(?<![\w$])(?:assert\w*|fail)\s*\(/g,
  count,
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
var TEST_CALL = new RegExp(
  `^(?:(?:it|test)(?:\\.(?:${MODIFIERS}))*|xit|xtest|fit)$`
);
var ASSERT_CALL = /^(?:expect(?:\.soft)?|assert(?:\.\w+)?)$/;
var HANDLER_FAILS2 = /(?<![\w$])(?:throw|expect|assert|fail|reject)(?![\w$])|\.(?:fail|reject)\s*\(|(?<![\w$.])done\s*\(\s*[^\s)]|(?<![\w$.])t\.(?!log|pass|plan|teardown|timeout)\w+\s*\(|\.should\b/;
var ALWAYS_PASSES2 = /(?<![\w$.])expect\s*\(\s*[\w$]+\s*\)\s*\.\s*(?:toBeDefined|toBeTruthy|not\s*\.\s*toBe(?:Null|Undefined))\s*\(\s*\)|(?<![\w$.])expect\s*\(\s*(true|false|null|\d+)\s*\)\s*\.\s*(?:toBe|toEqual)\s*\(\s*\1\s*\)|(?<![\w$.])assert(?:\.ok)?\s*\(\s*[\w$]+\s*\)/g;
var SKIP_PROPS = /^(?:skip|only|todo|skipIf|runIf|fails|failing)$/;
var RUNNERS = /^(?:it|test|describe|context|suite|specify)$/;
var decode = (text) => text.replace(
  /\\u(?:\{([0-9a-fA-F]+)\}|([0-9a-fA-F]{4}))/g,
  (_, a, b) => String.fromCodePoint(Number.parseInt(a ?? b, 16))
);
var stringValue = (node) => {
  if (node?.type === "string") return node.text.slice(1, -1);
  if (node?.type === "template_string" && !node.namedChildren.some((c) => c?.type === "template_substitution")) {
    return node.text.slice(1, -1);
  }
  return null;
};
var FALSY2 = /^(?:false|0|null|undefined|''|""|``)$/;
var FUNCTIONS = ["arrow_function", "function_expression", "function"];
function treeSkips(root, path) {
  const found = [];
  const at = (node, text) => found.push({ line: node.startPosition.row + 1, text });
  const name2 = (node) => decode(callee(node)).replace(/\?\./g, ".");
  const args2 = (call) => (call.childForFieldName("arguments")?.namedChildren ?? []).filter(
    (a) => a !== null
  );
  const calls = descendants(root, ["call_expression"]);
  const runnerCalls = calls.filter(
    (c) => (
      // `t.test(…)` is a node:test subtest.
      /^(?:[\w$]+\.)?(?:it|test|describe|suite|context|specify)(?:\.\w+)*$/.test(
        name2(c.childForFieldName("function"))
      )
    )
  );
  const contexts2 = /* @__PURE__ */ new Set(["this", "t", "ctx", "context"]);
  const contextPatterns = [];
  const addContext = (param) => {
    const pattern = param?.type === "required_parameter" || param?.type === "optional_parameter" ? param.childForFieldName("pattern") : param;
    if (pattern?.type === "identifier") contexts2.add(pattern.text);
    if (pattern?.type === "object_pattern") contextPatterns.push(pattern);
  };
  for (const call of runnerCalls) {
    for (const arg of args2(call)) {
      if (!FUNCTIONS.includes(arg.type)) continue;
      addContext(
        arg.childForFieldName("parameter") ?? arg.childForFieldName("parameters")?.namedChildren[0]
      );
    }
  }
  for (const decl of descendants(root, ["variable_declarator"])) {
    const pattern = decl.childForFieldName("name");
    const value = decl.childForFieldName("value");
    if (pattern?.type === "object_pattern" && contexts2.has(value?.text ?? "")) {
      contextPatterns.push(pattern);
    }
  }
  const root0 = (text) => /^[\w$]+/.exec(text)?.[0] ?? "";
  for (const sub of descendants(root, ["subscript_expression"])) {
    const prop = stringValue(sub.childForFieldName("index"));
    if (!prop || !SKIP_PROPS.test(decode(prop))) continue;
    const object = decode(sub.childForFieldName("object")?.text ?? "");
    const base = root0(object);
    if (contexts2.has(base) || RUNNERS.test(base)) {
      at(sub, `${object}['${decode(prop)}']`);
    }
  }
  const called = new Set(
    calls.map((c) => c.childForFieldName("function")).filter((f) => f?.type === "identifier").map((f) => f?.text)
  );
  for (const pattern of contextPatterns) {
    for (const prop of pattern.namedChildren) {
      if (!prop) continue;
      let key = "";
      let local = null;
      if (prop.type === "pair_pattern") {
        const k = prop.childForFieldName("key");
        key = stringValue(k) ?? k?.text ?? "";
        local = prop.childForFieldName("value");
        if (local?.type === "assignment_pattern") {
          local = local.childForFieldName("left");
        }
      } else if (prop.type === "shorthand_property_identifier_pattern") {
        key = prop.text;
        local = prop;
      } else if (prop.type === "object_assignment_pattern") {
        local = prop.childForFieldName("left");
        key = local?.text ?? "";
      }
      if (/^(?:skip|todo)$/.test(key) && local && called.has(local.text)) {
        at(prop, key === local.text ? key : `${key}: ${local.text}`);
      }
    }
  }
  const options = (object) => {
    for (const pair of object.namedChildren) {
      if (pair?.type !== "pair") continue;
      const key = pair.childForFieldName("key");
      const prop = stringValue(key) ?? key?.text ?? "";
      const value = pair.childForFieldName("value")?.text ?? "";
      if (/^(?:skip|todo|only)$/.test(prop) && !FALSY2.test(value)) {
        at(pair, `${prop}: ${value}`);
      }
    }
  };
  const objects = /* @__PURE__ */ new Map();
  for (const decl of descendants(root, ["variable_declarator"])) {
    const id = decl.childForFieldName("name");
    const value = decl.childForFieldName("value");
    if (id?.type === "identifier" && value?.type === "object") {
      objects.set(id.text, value);
    }
  }
  const passed = /* @__PURE__ */ new Set();
  for (const call of runnerCalls) {
    for (const arg of args2(call)) {
      if (arg.type === "object") options(arg);
      if (arg.type !== "identifier") continue;
      passed.add(arg.text);
      const object = objects.get(arg.text);
      if (object) options(object);
    }
  }
  for (const assign of descendants(root, ["assignment_expression"])) {
    const left = assign.childForFieldName("left");
    const right = assign.childForFieldName("right")?.text ?? "";
    const object = left?.childForFieldName("object")?.text ?? "";
    const prop = left?.type === "subscript_expression" ? stringValue(left.childForFieldName("index")) : left?.childForFieldName("property")?.text;
    if (passed.has(object) && /^(?:skip|todo|only)$/.test(prop ?? "") && !FALSY2.test(right)) {
      at(assign, `${prop}: ${right}`);
    }
  }
  found.push(...subjectMocks(calls, path));
  return found;
}
function modulePath(path) {
  const out2 = [];
  for (const part of path.replace(/\.[cm]?[jt]sx?$/, "").split("/")) {
    if (part === "..") out2.pop();
    else if (part !== "." && part !== "") out2.push(part);
  }
  if (out2.at(-1) === "index") out2.pop();
  return out2.join("/");
}
function subjectsOf(path) {
  const parts2 = path.split("/");
  const base = parts2.pop() ?? "";
  let stem = /^(.+?)[._-](?:test|spec)s?\.[^.]+$/.exec(base)?.[1];
  if (parts2.at(-1) === "__tests__") {
    parts2.pop();
    stem ??= base.replace(/\..*$/, "");
  }
  if (!stem) return [];
  const subject = modulePath([...parts2, stem].join("/"));
  const mirrored = parts2.findIndex(
    (p) => /^(?:tests?|spec|__tests__)$/.test(p)
  );
  if (mirrored === -1) return [subject];
  const swap = (by) => modulePath(
    [
      ...parts2.slice(0, mirrored),
      ...by,
      ...parts2.slice(mirrored + 1),
      stem
    ].join("/")
  );
  return [subject, swap([]), swap(["src"])];
}
var MOCK = /^(?:vi|jest)\.(?:mock|doMock|unstable_mockModule)$/;
function subjectMocks(calls, path) {
  const subjects = subjectsOf(path);
  if (subjects.length === 0) return [];
  const dir = path.split("/").slice(0, -1).join("/");
  return calls.flatMap((call) => {
    if (!MOCK.test(callee(call.childForFieldName("function")))) return [];
    const [arg, factory, ...rest] = call.childForFieldName("arguments")?.namedChildren ?? [];
    const specifier = arg?.type === "call_expression" && arg.childForFieldName("function")?.type === "import" ? arg.childForFieldName("arguments")?.namedChildren[0] : arg;
    const module2 = stringValue(specifier);
    if (!module2 || rest.length > 0) return [];
    const relative2 = /^\.{1,2}(?:\/|$)/.test(module2);
    const alias = /^(?:[@~]\/|#)/.test(module2) ? modulePath(module2.replace(/^(?:[@~]\/|#)/, "")) : null;
    const target = relative2 ? modulePath(`${dir}/${module2}`) : null;
    const mocked = subjects.some(
      (s) => target !== null ? s === target : alias !== null && alias !== "" && (s === alias || s.endsWith(`/${alias}`))
    );
    if (!mocked) return [];
    if (factory && (!FUNCTIONS.includes(factory.type) || // `(orig) => …`, or `orig => …` (no `parameters` field).
    (factory.childForFieldName("parameters")?.namedChildren.length ?? 1) > 0 || /\b(?:importActual|importOriginal|requireActual)\b/.test(factory.text))) {
      return [];
    }
    return [
      {
        line: call.startPosition.row + 1,
        text: `${callee(call.childForFieldName("function"))}('${module2}')`
      }
    ];
  });
}
var BUILTIN_MATCHERS = "toBe|toEqual|toStrictEqual|toThrow|toThrowError|toHaveLength|toBeTruthy|toBeFalsy|toBeDefined|toBeUndefined|toBeNull|toBeNaN|toContain|toContainEqual|toMatch|toMatchObject|toHaveProperty|toBeCloseTo|toBeGreaterThan|toBeGreaterThanOrEqual|toBeLessThan|toBeLessThanOrEqual|toBeInstanceOf|toHaveBeenCalled|toHaveBeenCalledWith|toHaveBeenCalledTimes|toHaveBeenLastCalledWith|toHaveBeenNthCalledWith|toHaveReturned|toHaveReturnedWith|toMatchSnapshot|toMatchInlineSnapshot|toThrowErrorMatchingSnapshot|toThrowErrorMatchingInlineSnapshot";
var SKIPS = [
  // `?.` too: `it?.skip(…)`.
  `(?<![\\w$.])(?:it|test|describe|context|suite|specify)(?:\\??\\.\\w+)*\\??\\.(?:skip|only|todo|skipIf|runIf|fails|failing)\\b`,
  "(?<![\\w$.])(?:xit|xtest|xdescribe|xcontext|fit|fdescribe)\\s*\\(",
  // Skipping from inside a test: Mocha `this.skip()`, node:test `t.skip()`,
  // Vitest `ctx.skip()`, also as `ctx?.skip?.()`. node:test options
  // (`{ skip: true }`) are found on the tree.
  "(?<![\\w$.])(?:this|t|ctx|context)\\??\\.(?:skip|todo)\\s*(?:\\?\\.\\s*)?\\("
];
var redefinitions = (names) => [
  `(?<![\\w$.])function\\*?\\s+(?:${names})\\s*\\(`,
  `(?<![\\w$.])(?:const|let|var)\\s+(?:${names})\\s*=\\s*(?:async\\s*)?(?:function\\b|\\([^()]*\\)\\s*=>|[\\w$]+\\s*=>)`,
  `(?<![\\w$])(?:globalThis|global|window|self)\\.(?:${names})\\s*=(?!=)`,
  `^[ \\t]*(?:${names})\\s*=(?![=>])`
];
function runnerNames(code) {
  const titled = ["it", "test", "describe"].filter(
    (name2) => new RegExp(`(?<![\\w$.])${name2}(?:\\.\\w+)*\\s*\\(\\s*['"\`]`).test(code)
  );
  return ["expect", ...titled].join("|");
}
function contextNames(code) {
  const names = /* @__PURE__ */ new Set();
  const callback = /,\s*(?:async\s+)?(?:function\s*[\w$]*\s*\(\s*([\w$]+)|\(\s*([\w$]+)[^()]*\)\s*=>|([\w$]+)\s*=>)/;
  for (const call of code.matchAll(/(?<![\w$.])(?:it|test)(?:\.\w+)*\s*\(/g)) {
    const m = callback.exec(code.slice(call.index, call.index + 400));
    const name2 = m?.[1] ?? m?.[2] ?? m?.[3];
    if (name2 && !["this", "t", "ctx", "context"].includes(name2)) {
      names.add(name2);
    }
  }
  return [...names];
}
var DROPS = /^(?:console\.\w+|(?:_|lodash)\.noop|noop)$/;
function ignores2(handler) {
  if (!handler) return false;
  if (handler.type === "identifier" || handler.type === "member_expression") {
    return DROPS.test(callee(handler));
  }
  if (handler.type !== "catch_clause" && !FUNCTIONS.includes(handler.type)) {
    return false;
  }
  const param = handler.childForFieldName("parameter") ?? handler.childForFieldName("parameters")?.namedChildren[0];
  const caught = param?.type === "required_parameter" ? param.childForFieldName("pattern") : param;
  return !reportsFailure(
    handler.childForFieldName("body")?.text ?? "",
    HANDLER_FAILS2,
    ALWAYS_PASSES2,
    caughtIn(handler, caught?.type === "identifier" ? caught.text : void 0)
  );
}
function caughtLater(node) {
  for (let c = node; ; ) {
    const p = c.parent;
    if (p?.type === "member_expression" && has2(p, "object", c)) {
      const call = p.parent;
      if (call?.type === "call_expression" && has2(call, "function", p)) {
        if (p.childForFieldName("property")?.text === "catch" && ignores2(call.childForFieldName("arguments")?.namedChildren[0])) {
          return true;
        }
        c = call;
      } else {
        c = p;
      }
    } else if (p?.type === "call_expression" && has2(p, "function", c)) {
      c = p;
    } else {
      return false;
    }
  }
}
var has2 = (node, field, child) => node.childForFieldName(field)?.id === child.id;
function insideSwallowingCatch(node) {
  if (caughtLater(node)) return true;
  for (let n = node; n?.parent; n = n.parent) {
    const call = n.parent;
    if (n.type !== "arguments" || call.type !== "call_expression") continue;
    const fn = call.childForFieldName("function");
    if (fn?.childForFieldName("property")?.text === "then" && caughtLater(call)) {
      return true;
    }
  }
  return false;
}
var emptyEach = (fn) => fn?.type === "call_expression" && /\.each$/.test(
  callee(fn.childForFieldName("function")).replace(/\?\./g, ".")
) && callee(fn.childForFieldName("arguments")) === "([])";
var DECLARATIONS = [
  ...FUNCTIONS,
  "function_declaration",
  "method_definition"
];
function helper2(node) {
  let fn = node.parent;
  while (fn && !DECLARATIONS.includes(fn.type)) fn = fn.parent;
  if (fn?.type === "method_definition" || fn?.parent?.type === "pair") {
    return method(fn);
  }
  const named = fn?.type === "function_declaration" ? fn : fn?.parent;
  const name2 = named?.childForFieldName("name");
  if (named?.type !== "function_declaration" && named?.type !== "variable_declarator" || name2?.type !== "identifier") {
    return null;
  }
  const statement = named.type === "function_declaration" ? named : named.parent;
  return statement?.parent?.type === "export_statement" ? null : { name: name2, local: true };
}
function method(fn) {
  const definition = fn.type === "method_definition" ? fn : fn.parent;
  const name2 = definition?.childForFieldName(
    definition.type === "pair" ? "key" : "name"
  );
  if (!definition || name2?.type !== "property_identifier" || name2.text === "constructor" || definition.children.some((c) => c?.type === "get" || c?.type === "set")) {
    return null;
  }
  const container = definition.parent;
  const owner = container?.type === "class_body" ? container.parent : container?.type === "object" ? container.parent : null;
  if (owner?.type !== "class_declaration" && owner?.type !== "variable_declarator") {
    return { name: name2, local: false };
  }
  const ownerName = owner.childForFieldName("name");
  const statement = owner.type === "class_declaration" ? owner : owner.parent;
  if (!ownerName || !["identifier", "type_identifier"].includes(ownerName.type) || statement?.parent?.type === "export_statement") {
    return { name: name2, local: false };
  }
  const usedAsValue = descendants(owner.tree.rootNode, [
    "identifier",
    "type_identifier"
  ]).some(
    (use) => use.text === ownerName.text && use.id !== ownerName.id && !(use.parent?.type === "new_expression" && use.parent.childForFieldName("constructor")?.id === use.id) && !(use.parent?.type === "member_expression" && use.parent.childForFieldName("object")?.id === use.id)
  );
  return { name: name2, local: !usedAsValue };
}
function constants2(root) {
  const bindings2 = [];
  for (const decl of descendants(root, ["variable_declarator"])) {
    const name2 = decl.childForFieldName("name");
    if (name2?.type !== "identifier") continue;
    const constant = decl.parent?.type === "lexical_declaration" && decl.parent.child(0)?.text === "const";
    bindings2.push([
      name2.text,
      constant ? decl.childForFieldName("value")?.text ?? "" : ""
    ]);
  }
  for (const id of descendants(root, [
    "assignment_expression",
    "augmented_assignment_expression",
    "update_expression"
  ])) {
    const target = id.childForFieldName("left") ?? id.childForFieldName("argument");
    if (target?.type === "identifier") bindings2.push([target.text, ""]);
  }
  return literalConstants(bindings2);
}
function count2(root) {
  const calls = descendants(root, ["call_expression"]);
  const named = (re) => calls.filter(
    (c) => (
      // `it?.skip(…)` declares a test too.
      re.test(callee(c.childForFieldName("function")).replace(/\?\./g, "."))
    )
  );
  const dead = deadCode(
    (_, parent) => parent.type === "call_expression" && emptyEach(parent.childForFieldName("function")),
    constants2(root)
  );
  const tests = named(TEST_CALL);
  const deadTests = tests.filter(dead).length;
  return {
    tests: tests.length - deadTests,
    deadTests,
    // `catch` takes every error; it swallows unless it fails the test.
    ...countAssertions(root, named(ASSERT_CALL), {
      dead,
      swallowed: (node) => insideSwallowingCatch(node) || insideSwallowingTry(
        node,
        ["try_statement"],
        (tryNode) => ignores2(tryNode.childForFieldName("handler")),
        ignores2
      ),
      helper: helper2
    })
  };
}
var EQUALS = /^(?:toBe|toEqual|toStrictEqual|equal|equals|eql)$/;
var ASSERT_EQUALS = /^assert\.(?:equal|strictEqual|deepEqual|deepStrictEqual)$/;
function checks2(root) {
  const found = [];
  for (const call of descendants(root, ["call_expression"])) {
    const fn = call.childForFieldName("function");
    const args2 = (call.childForFieldName("arguments")?.namedChildren ?? []).filter((a) => a !== null);
    const [first, second] = args2;
    if (/^assert\.\w+$/.test(callee(fn))) {
      if (first && second) {
        const equal2 = ASSERT_EQUALS.test(callee(fn));
        found.push({ node: call, sides: [first, second], equal: equal2 });
      }
      continue;
    }
    if (fn?.type !== "member_expression" || !first) continue;
    let object = fn.childForFieldName("object");
    let negated = false;
    while (object?.type === "member_expression") {
      if (object.childForFieldName("property")?.text === "not") negated = true;
      object = object.childForFieldName("object");
    }
    const subject = object?.type === "call_expression" && /^expect(?:\.soft)?$/.test(callee(object.childForFieldName("function"))) ? object.childForFieldName("arguments")?.namedChildren[0] : null;
    if (!subject) continue;
    const equal = EQUALS.test(fn.childForFieldName("property")?.text ?? "") && !second && !negated;
    for (const arg of args2) {
      found.push({ node: call, sides: [subject, arg], equal });
    }
  }
  return found;
}
var js = {
  // With strings and comments blanked, a `\u` left is in an identifier:
  // `it.skip` is `it.skip`.
  strip: (source) => stripCLike(source, { templateLiterals: true, textBlocks: false }).replace(
    /\\u(?:\{([0-9a-fA-F]+)\}|([0-9a-fA-F]{4}))/g,
    (_, braced, plain) => String.fromCodePoint(Number.parseInt(braced ?? plain, 16))
  ),
  // `(?<![\w$.])` keeps `regex.test(`, `profit(` and `obj.expect(` out.
  assertions: /(?<![\w$.])(?:expect(?:\.soft)?|assert(?:\.\w+)?)\s*\(/g,
  treeSkips,
  count: count2,
  checks: checks2,
  skips: (code) => {
    const patterns = [...SKIPS, ...redefinitions(runnerNames(code))];
    const names = contextNames(code);
    if (names.length > 0) {
      patterns.push(
        `(?<![\\w$.])(?:${names.join("|")})\\??\\.(?:skip|todo)\\s*(?:\\?\\.\\s*)?\\(`
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
  // Kept under another name (`sk = pytest.skip`), or raised directly.
  /^[ \t]*\w+[ \t]*=[ \t]*(?:pytest\.)?(?:skip|xfail)[ \t]*$/,
  /(?<![\w.])pytest\.skip\.Exception\b/,
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
    if ((m[2] ?? "").trim() === "*") {
      patterns.push(
        m[1] === "pytest" ? "(?<![\\w.])(?<!def\\s+)(?:skip|xfail|importorskip)\\b(?=\\s*\\()" : "(?<![\\w.])(?<!def\\s+)(?:skip|skipIf|skipUnless)\\b(?=\\s*\\()"
      );
      continue;
    }
    for (const item of (m[2] ?? "").replace(/[()]/g, "").split(",")) {
      const [name2, alias = name2] = item.trim().split(/\s+as\s+/);
      if (!name2 || !alias || !/^\w+$/.test(alias)) continue;
      if (name2 === "mark") {
        patterns.push(`(?<![\\w.])${alias}\\.(?:skip|skipif|xfail)\\b`);
      } else if (/^(?:skip|skipIf|skipUnless|xfail|importorskip)$/.test(name2) && alias !== name2) {
        patterns.push(`(?<![\\w.])${alias}\\b(?=\\s*\\()`);
      } else if (/^(?:skip|xfail|importorskip)$/.test(name2)) {
        patterns.push(`(?<![\\w.])${name2}\\b(?=\\s*\\()`);
      } else if (/^(?:SkipTest|expectedFailure)$/.test(name2)) {
        patterns.push(`(?<![\\w.])${alias}\\b`);
      }
    }
  }
  return patterns;
}
function countTests(root, dead) {
  const tests = /* @__PURE__ */ new Set();
  const deadTests = /* @__PURE__ */ new Set();
  const visit = (node, path, collected) => {
    for (const child of node.namedChildren) {
      if (!child) continue;
      const def = child.type === "decorated_definition" ? child.childForFieldName("definition") : child;
      const name2 = def?.childForFieldName("name")?.text ?? "";
      if (def?.type === "function_definition") {
        if (collected && name2.startsWith("test")) {
          (dead(def) ? deadTests : tests).add([...path, name2].join("."));
        }
        continue;
      }
      const body2 = def?.childForFieldName("body");
      if (def?.type === "class_definition" && body2) {
        const bases = def.childForFieldName("superclasses")?.text ?? "";
        visit(
          body2,
          [...path, name2],
          collected && (name2.startsWith("Test") || /Test/.test(bases))
        );
        continue;
      }
      visit(child, path, collected);
    }
  };
  visit(root, [], true);
  for (const name2 of tests) deadTests.delete(name2);
  return { tests: tests.size, deadTests: deadTests.size };
}
function emptyParametrize(decorated) {
  return decorated.namedChildren.some((decorator) => {
    const call = decorator?.type === "decorator" ? decorator.namedChildren[0] : null;
    if (call?.type !== "call" || !/(?:^|\.)parametrize$/.test(callee(call.childForFieldName("function")))) {
      return false;
    }
    const args2 = call.childForFieldName("arguments")?.namedChildren ?? [];
    const values = args2.find(
      (a) => a?.type === "keyword_argument" && a.childForFieldName("name")?.text === "argvalues"
    )?.childForFieldName("value") ?? args2[1];
    return /^(?:\[\]|\(\))$/.test(callee(values ?? null));
  });
}
var enclosing = (node) => {
  let fn = node.parent;
  while (fn && fn.type !== "function_definition" && fn.type !== "lambda") {
    fn = fn.parent;
  }
  return fn;
};
function helper3(node) {
  const fn = enclosing(node);
  const name2 = fn?.type === "function_definition" ? fn.childForFieldName("name") : null;
  if (!fn || !name2 || name2.text.startsWith("test")) return null;
  return {
    name: name2,
    local: fn.parent?.type !== "decorated_definition" && enclosing(fn)?.type === "function_definition"
  };
}
function constants3(root) {
  const bindings2 = [];
  for (const node of descendants(root, [
    "assignment",
    "augmented_assignment",
    "parameters",
    "for_statement"
  ])) {
    if (node.type === "parameters") {
      for (const id of descendants(node, ["identifier"])) {
        bindings2.push([id.text, ""]);
      }
      continue;
    }
    const left = node.childForFieldName("left");
    if (left?.type !== "identifier") continue;
    bindings2.push([
      left.text,
      node.type === "assignment" ? node.childForFieldName("right")?.text ?? "" : ""
    ]);
  }
  return literalConstants(bindings2);
}
var CATCHES_ASSERTIONS2 = /\b(?:BaseException|Exception|AssertionError)\b/;
var HANDLER_FAILS3 = /(?<![\w.])(?:raise|assert)\b|\bfail\s*\(|\.fail\w*\s*\(|\.assert\w*\s*\(/;
var ALWAYS_PASSES3 = /(?<![\w.])assert\s+(?:True|\w+)\s*$|\bself\.assert(?:True\s*\(\s*True|IsNotNone\s*\(\s*\w+)\s*\)/gm;
function swallows2(node) {
  if (node.type === "with_statement") {
    return descendants(node, ["with_item"]).some((item) => {
      const call = item.childForFieldName("value");
      const args2 = call?.childForFieldName("arguments")?.text ?? "";
      return call?.type === "call" && /^(?:contextlib\.)?suppress$/.test(
        callee(call.childForFieldName("function"))
      ) && CATCHES_ASSERTIONS2.test(args2);
    });
  }
  return node.namedChildren.some((clause) => clause && ignores3(clause));
}
function ignores3(clause) {
  if (clause.type !== "except_clause") return false;
  const [, types = "", body2 = ""] = /^except\*?([^:]*):([\s\S]*)$/.exec(clause.text) ?? [];
  return (types.trim() === "" || CATCHES_ASSERTIONS2.test(types)) && !reportsFailure(
    body2,
    HANDLER_FAILS3,
    ALWAYS_PASSES3,
    caughtIn(clause, /\bas\s+(\w+)\s*$/.exec(types)?.[1])
  );
}
var ASSERT_CALL2 = /^(?:self\.assert\w*|pytest\.raises)$/;
function count3(root) {
  const assertions = [
    ...descendants(root, ["assert_statement"]),
    ...descendants(root, ["call"]).filter(
      (c) => ASSERT_CALL2.test(callee(c.childForFieldName("function")))
    )
  ];
  const dead = deadCode(
    (node, parent) => parent.type === "decorated_definition" && parent.childForFieldName("definition")?.id === node.id && emptyParametrize(parent),
    constants3(root)
  );
  return {
    ...countTests(root, dead),
    ...countAssertions(root, assertions, {
      dead,
      swallowed: (node) => insideSwallowingTry(
        node,
        ["try_statement", "with_statement"],
        swallows2,
        ignores3
      ),
      helper: helper3
    })
  };
}
var ASSERT_EQUAL2 = /^self\.assert(?:Equals?|Is|ListEqual|DictEqual|TupleEqual|SetEqual|SequenceEqual|CountEqual|MultiLineEqual)$/;
function checks3(root) {
  const found = [];
  for (const node of descendants(root, ["assert_statement"])) {
    let test = node.namedChildren[0] ?? null;
    while (test?.type === "parenthesized_expression") {
      test = test.namedChildren[0] ?? null;
    }
    if (test?.type !== "comparison_operator") continue;
    const [left, right, extra] = test.namedChildren;
    const operators = test.children.filter((c) => c && !c.isNamed);
    if (left && right && !extra) {
      const equal = operators.length === 1 && /^(?:==|is)$/.test(operators[0]?.text ?? "");
      found.push({ node, sides: [left, right], equal });
    }
  }
  for (const call of descendants(root, ["call"])) {
    const name2 = callee(call.childForFieldName("function"));
    if (!/^self\.assert\w*$/.test(name2)) continue;
    const [first, second] = (call.childForFieldName("arguments")?.namedChildren ?? []).filter((a) => a !== null && a.type !== "keyword_argument");
    if (first && second) {
      const equal = ASSERT_EQUAL2.test(name2);
      found.push({ node: call, sides: [first, second], equal });
    }
  }
  return found;
}
var python = {
  strip: stripPython,
  checks: checks3,
  assertions: /(?<![\w.])assert(?=[\s(])|(?<![\w.])self\.assert\w*\s*\(|(?<![\w.])pytest\.raises\s*\(/g,
  count: count3,
  skips: (code) => new RegExp([...SKIPS2, ...importedSkips(code)].join("|"), "gm")
};

// src/languages/syntax.ts
import { existsSync } from "fs";
import { createRequire } from "module";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// node_modules/.pnpm/web-tree-sitter@0.27.1/node_modules/web-tree-sitter/web-tree-sitter.js
var __defProp2 = Object.defineProperty;
var __name = (target, value) => __defProp2(target, "name", { value, configurable: true });
var Edit = class {
  static {
    __name(this, "Edit");
  }
  /** The start position of the change. */
  startPosition;
  /** The end position of the change before the edit. */
  oldEndPosition;
  /** The end position of the change after the edit. */
  newEndPosition;
  /** The start index of the change. */
  startIndex;
  /** The end index of the change before the edit. */
  oldEndIndex;
  /** The end index of the change after the edit. */
  newEndIndex;
  constructor({
    startIndex,
    oldEndIndex,
    newEndIndex,
    startPosition,
    oldEndPosition,
    newEndPosition
  }) {
    this.startIndex = startIndex >>> 0;
    this.oldEndIndex = oldEndIndex >>> 0;
    this.newEndIndex = newEndIndex >>> 0;
    this.startPosition = startPosition;
    this.oldEndPosition = oldEndPosition;
    this.newEndPosition = newEndPosition;
  }
  /**
   * Edit a point and index to keep it in-sync with source code that has been edited.
   *
   * This function updates a single point's byte offset and row/column position
   * based on an edit operation. This is useful for editing points without
   * requiring a tree or node instance.
   */
  editPoint(point, index) {
    let newIndex = index;
    const newPoint = { ...point };
    if (index >= this.oldEndIndex) {
      newIndex = this.newEndIndex + (index - this.oldEndIndex);
      const originalRow = point.row;
      newPoint.row = this.newEndPosition.row + (point.row - this.oldEndPosition.row);
      newPoint.column = originalRow === this.oldEndPosition.row ? this.newEndPosition.column + (point.column - this.oldEndPosition.column) : point.column;
    } else if (index > this.startIndex) {
      newIndex = this.newEndIndex;
      newPoint.row = this.newEndPosition.row;
      newPoint.column = this.newEndPosition.column;
    }
    return { point: newPoint, index: newIndex };
  }
  /**
   * Edit a range to keep it in-sync with source code that has been edited.
   *
   * This function updates a range's start and end positions based on an edit
   * operation. This is useful for editing ranges without requiring a tree
   * or node instance.
   */
  editRange(range) {
    const newRange = {
      startIndex: range.startIndex,
      startPosition: { ...range.startPosition },
      endIndex: range.endIndex,
      endPosition: { ...range.endPosition }
    };
    if (range.endIndex >= this.oldEndIndex) {
      if (range.endIndex !== Number.MAX_SAFE_INTEGER) {
        newRange.endIndex = this.newEndIndex + (range.endIndex - this.oldEndIndex);
        newRange.endPosition = {
          row: this.newEndPosition.row + (range.endPosition.row - this.oldEndPosition.row),
          column: range.endPosition.row === this.oldEndPosition.row ? this.newEndPosition.column + (range.endPosition.column - this.oldEndPosition.column) : range.endPosition.column
        };
        if (newRange.endIndex < this.newEndIndex) {
          newRange.endIndex = Number.MAX_SAFE_INTEGER;
          newRange.endPosition = { row: Number.MAX_SAFE_INTEGER, column: Number.MAX_SAFE_INTEGER };
        }
      }
    } else if (range.endIndex > this.startIndex) {
      newRange.endIndex = this.startIndex;
      newRange.endPosition = { ...this.startPosition };
    }
    if (range.startIndex >= this.oldEndIndex) {
      newRange.startIndex = this.newEndIndex + (range.startIndex - this.oldEndIndex);
      newRange.startPosition = {
        row: this.newEndPosition.row + (range.startPosition.row - this.oldEndPosition.row),
        column: range.startPosition.row === this.oldEndPosition.row ? this.newEndPosition.column + (range.startPosition.column - this.oldEndPosition.column) : range.startPosition.column
      };
      if (newRange.startIndex < this.newEndIndex) {
        newRange.startIndex = Number.MAX_SAFE_INTEGER;
        newRange.startPosition = { row: Number.MAX_SAFE_INTEGER, column: Number.MAX_SAFE_INTEGER };
      }
    } else if (range.startIndex > this.startIndex) {
      newRange.startIndex = this.startIndex;
      newRange.startPosition = { ...this.startPosition };
    }
    return newRange;
  }
};
var SIZE_OF_SHORT = 2;
var SIZE_OF_INT = 4;
var SIZE_OF_CURSOR = 4 * SIZE_OF_INT;
var SIZE_OF_NODE = 5 * SIZE_OF_INT;
var SIZE_OF_POINT = 2 * SIZE_OF_INT;
var SIZE_OF_RANGE = 2 * SIZE_OF_INT + 2 * SIZE_OF_POINT;
var ZERO_POINT = { row: 0, column: 0 };
var INTERNAL = /* @__PURE__ */ Symbol("INTERNAL");
function assertInternal(x) {
  if (x !== INTERNAL) throw new Error("Illegal constructor");
}
__name(assertInternal, "assertInternal");
function isPoint(point) {
  return !!point && typeof point.row === "number" && typeof point.column === "number";
}
__name(isPoint, "isPoint");
function setModule(module2) {
  C = module2;
}
__name(setModule, "setModule");
var C;
function newFinalizer(handler) {
  try {
    return new FinalizationRegistry(handler);
  } catch (e) {
    console.error("Unsupported FinalizationRegistry:", e);
    return;
  }
}
__name(newFinalizer, "newFinalizer");
var finalizer = newFinalizer((address) => {
  C._ts_lookahead_iterator_delete(address);
});
var LookaheadIterator = class {
  static {
    __name(this, "LookaheadIterator");
  }
  /** @internal */
  [0] = 0;
  // Internal handle for Wasm
  /** @internal */
  language;
  /** @internal */
  positioned = false;
  /** @internal */
  constructor(internal, address, language) {
    assertInternal(internal);
    this[0] = address;
    this.language = language;
    finalizer?.register(this, address, this);
  }
  /**
   * Get the current symbol of the lookahead iterator.
   *
   * Returns `null` if the iterator is not positioned on a symbol:
   *
   * - Before the first iteration step
   * - After the iterator is exhausted
   * - After a {@link reset} or {@link resetState} call
   */
  get currentTypeId() {
    return this.positioned ? C._ts_lookahead_iterator_current_symbol(this[0]) : null;
  }
  /**
   * Get the current symbol name of the lookahead iterator.
   *
   * Returns `null` if the iterator is not positioned on a symbol.
   */
  get currentType() {
    const id = this.currentTypeId;
    if (id === null) return null;
    return this.language.types[id] ?? C.UTF8ToString(C._ts_language_symbol_name(this.language[0], id));
  }
  /** Delete the lookahead iterator, freeing its resources. */
  delete() {
    finalizer?.unregister(this);
    C._ts_lookahead_iterator_delete(this[0]);
    this[0] = 0;
  }
  /**
   * Reset the lookahead iterator.
   *
   * This returns `true` if the language was set successfully and `false`
   * otherwise.
   */
  reset(language, stateId) {
    if (C._ts_lookahead_iterator_reset(this[0], language[0], stateId)) {
      this.language = language;
      this.positioned = false;
      return true;
    }
    return false;
  }
  /**
   * Reset the lookahead iterator to another state.
   *
   * This returns `true` if the iterator was reset to the given state and
   * `false` otherwise.
   */
  resetState(stateId) {
    if (!C._ts_lookahead_iterator_reset_state(this[0], stateId)) return false;
    this.positioned = false;
    return true;
  }
  /**
   * Returns an iterator that iterates over the symbols of the lookahead iterator.
   *
   * The iterator will yield the current symbol name as a string for each step
   * until there are no more symbols to iterate over.
   */
  [Symbol.iterator]() {
    return {
      next: /* @__PURE__ */ __name(() => {
        this.positioned = Boolean(C._ts_lookahead_iterator_next(this[0]));
        const value = this.currentType;
        return value === null ? { done: true, value: "" } : { done: false, value };
      }, "next")
    };
  }
};
function getText(tree, startIndex, endIndex, startPosition) {
  const length = endIndex - startIndex;
  let result = tree.textCallback(startIndex, startPosition);
  if (result) {
    startIndex += result.length;
    while (startIndex < endIndex) {
      const string = tree.textCallback(startIndex, startPosition);
      if (string && string.length > 0) {
        startIndex += string.length;
        result += string;
      } else {
        break;
      }
    }
    if (startIndex > endIndex) {
      result = result.slice(0, length);
    }
  }
  return result ?? "";
}
__name(getText, "getText");
var finalizer2 = newFinalizer((address) => {
  C._ts_tree_delete(address);
});
var Tree = class _Tree {
  static {
    __name(this, "Tree");
  }
  /** @internal */
  [0] = 0;
  // Internal handle for Wasm
  /** @internal */
  textCallback;
  /** The language that was used to parse the syntax tree. */
  language;
  /** @internal */
  constructor(internal, address, language, textCallback) {
    assertInternal(internal);
    this[0] = address;
    this.language = language;
    this.textCallback = textCallback;
    finalizer2?.register(this, address, this);
  }
  /** Create a shallow copy of the syntax tree. This is very fast. */
  copy() {
    const address = C._ts_tree_copy(this[0]);
    return new _Tree(INTERNAL, address, this.language, this.textCallback);
  }
  /** Delete the syntax tree, freeing its resources. */
  delete() {
    finalizer2?.unregister(this);
    C._ts_tree_delete(this[0]);
    this[0] = 0;
  }
  /** Get the root node of the syntax tree. */
  get rootNode() {
    C._ts_tree_root_node_wasm(this[0]);
    return unmarshalNode(this);
  }
  /**
   * Get the root node of the syntax tree, but with its position shifted
   * forward by the given offset.
   */
  rootNodeWithOffset(offsetBytes, offsetExtent) {
    const address = TRANSFER_BUFFER + SIZE_OF_NODE;
    C.setValue(address, offsetBytes, "i32");
    marshalPoint(address + SIZE_OF_INT, offsetExtent);
    C._ts_tree_root_node_with_offset_wasm(this[0]);
    return unmarshalNode(this);
  }
  /**
   * Edit the syntax tree to keep it in sync with source code that has been
   * edited.
   *
   * You must describe the edit both in terms of byte offsets and in terms of
   * row/column coordinates.
   */
  edit(edit) {
    marshalEdit(edit);
    C._ts_tree_edit_wasm(this[0]);
  }
  /** Create a new {@link TreeCursor} starting from the root of the tree. */
  walk() {
    return this.rootNode.walk();
  }
  /**
   * Compare this old edited syntax tree to a new syntax tree representing
   * the same document, returning a sequence of ranges whose syntactic
   * structure has changed.
   *
   * For this to work correctly, this syntax tree must have been edited such
   * that its ranges match up to the new tree. Generally, you'll want to
   * call this method right after calling one of the [`Parser::parse`]
   * functions. Call it on the old tree that was passed to parse, and
   * pass the new tree that was returned from `parse`.
   */
  getChangedRanges(other) {
    if (!(other instanceof _Tree)) {
      throw new TypeError("Argument must be a Tree");
    }
    C._ts_tree_get_changed_ranges_wasm(this[0], other[0]);
    const count4 = C.getValue(TRANSFER_BUFFER, "i32");
    const buffer = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
    const result = new Array(count4);
    if (count4 > 0) {
      let address = buffer;
      for (let i2 = 0; i2 < count4; i2++) {
        result[i2] = unmarshalRange(address);
        address += SIZE_OF_RANGE;
      }
      C._free(buffer);
    }
    return result;
  }
  /** Get the included ranges that were used to parse the syntax tree. */
  getIncludedRanges() {
    C._ts_tree_included_ranges_wasm(this[0]);
    const count4 = C.getValue(TRANSFER_BUFFER, "i32");
    const buffer = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
    const result = new Array(count4);
    if (count4 > 0) {
      let address = buffer;
      for (let i2 = 0; i2 < count4; i2++) {
        result[i2] = unmarshalRange(address);
        address += SIZE_OF_RANGE;
      }
      C._free(buffer);
    }
    return result;
  }
};
var finalizer3 = newFinalizer((address) => {
  C._ts_tree_cursor_delete_wasm(address);
});
var TreeCursor = class _TreeCursor {
  static {
    __name(this, "TreeCursor");
  }
  /** @internal */
  // @ts-expect-error: never read
  [0] = 0;
  // Internal handle for Wasm
  /** @internal */
  // @ts-expect-error: never read
  [1] = 0;
  // Internal handle for Wasm
  /** @internal */
  // @ts-expect-error: never read
  [2] = 0;
  // Internal handle for Wasm
  /** @internal */
  // @ts-expect-error: never read
  [3] = 0;
  // Internal handle for Wasm
  /** @internal */
  tree;
  /** @internal */
  constructor(internal, tree) {
    assertInternal(internal);
    this.tree = tree;
    unmarshalTreeCursor(this);
    finalizer3?.register(this, this.tree[0], this);
  }
  /** Creates a deep copy of the tree cursor. This allocates new memory. */
  copy() {
    const copy = new _TreeCursor(INTERNAL, this.tree);
    C._ts_tree_cursor_copy_wasm(this.tree[0]);
    unmarshalTreeCursor(copy);
    return copy;
  }
  /** Delete the tree cursor, freeing its resources. */
  delete() {
    finalizer3?.unregister(this);
    marshalTreeCursor(this);
    C._ts_tree_cursor_delete_wasm(this.tree[0]);
    this[0] = this[1] = this[2] = 0;
  }
  /** Get the tree cursor's current {@link Node}. */
  get currentNode() {
    marshalTreeCursor(this);
    C._ts_tree_cursor_current_node_wasm(this.tree[0]);
    return unmarshalNode(this.tree);
  }
  /**
   * Get the numerical field id of this tree cursor's current node.
   *
   * See also {@link TreeCursor#currentFieldName}.
   */
  get currentFieldId() {
    marshalTreeCursor(this);
    return C._ts_tree_cursor_current_field_id_wasm(this.tree[0]);
  }
  /** Get the field name of this tree cursor's current node. */
  get currentFieldName() {
    return this.tree.language.fields[this.currentFieldId];
  }
  /**
   * Get the depth of the cursor's current node relative to the original
   * node that the cursor was constructed with.
   */
  get currentDepth() {
    marshalTreeCursor(this);
    return C._ts_tree_cursor_current_depth_wasm(this.tree[0]);
  }
  /**
   * Get the index of the cursor's current node out of all of the
   * descendants of the original node that the cursor was constructed with.
   */
  get currentDescendantIndex() {
    marshalTreeCursor(this);
    return C._ts_tree_cursor_current_descendant_index_wasm(this.tree[0]);
  }
  /** Get the type of the cursor's current node. */
  get nodeType() {
    return this.tree.language.types[this.nodeTypeId] || "ERROR";
  }
  /** Get the type id of the cursor's current node. */
  get nodeTypeId() {
    marshalTreeCursor(this);
    return C._ts_tree_cursor_current_node_type_id_wasm(this.tree[0]);
  }
  /** Get the state id of the cursor's current node. */
  get nodeStateId() {
    marshalTreeCursor(this);
    return C._ts_tree_cursor_current_node_state_id_wasm(this.tree[0]);
  }
  /** Get the id of the cursor's current node. */
  get nodeId() {
    marshalTreeCursor(this);
    return C._ts_tree_cursor_current_node_id_wasm(this.tree[0]);
  }
  /**
   * Check if the cursor's current node is *named*.
   *
   * Named nodes correspond to named rules in the grammar, whereas
   * *anonymous* nodes correspond to string literals in the grammar.
   */
  get nodeIsNamed() {
    marshalTreeCursor(this);
    return C._ts_tree_cursor_current_node_is_named_wasm(this.tree[0]) === 1;
  }
  /**
   * Check if the cursor's current node is *missing*.
   *
   * Missing nodes are inserted by the parser in order to recover from
   * certain kinds of syntax errors.
   */
  get nodeIsMissing() {
    marshalTreeCursor(this);
    return C._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0]) === 1;
  }
  /** Get the string content of the cursor's current node. */
  get nodeText() {
    marshalTreeCursor(this);
    const startIndex = C._ts_tree_cursor_start_index_wasm(this.tree[0]);
    const endIndex = C._ts_tree_cursor_end_index_wasm(this.tree[0]);
    C._ts_tree_cursor_start_position_wasm(this.tree[0]);
    const startPosition = unmarshalPoint(TRANSFER_BUFFER);
    return getText(this.tree, startIndex, endIndex, startPosition);
  }
  /** Get the start position of the cursor's current node. */
  get startPosition() {
    marshalTreeCursor(this);
    C._ts_tree_cursor_start_position_wasm(this.tree[0]);
    return unmarshalPoint(TRANSFER_BUFFER);
  }
  /** Get the end position of the cursor's current node. */
  get endPosition() {
    marshalTreeCursor(this);
    C._ts_tree_cursor_end_position_wasm(this.tree[0]);
    return unmarshalPoint(TRANSFER_BUFFER);
  }
  /** Get the start index of the cursor's current node. */
  get startIndex() {
    marshalTreeCursor(this);
    return C._ts_tree_cursor_start_index_wasm(this.tree[0]);
  }
  /** Get the end index of the cursor's current node. */
  get endIndex() {
    marshalTreeCursor(this);
    return C._ts_tree_cursor_end_index_wasm(this.tree[0]);
  }
  /**
   * Move this cursor to the first child of its current node.
   *
   * This returns `true` if the cursor successfully moved, and returns
   * `false` if there were no children.
   */
  gotoFirstChild() {
    marshalTreeCursor(this);
    const result = C._ts_tree_cursor_goto_first_child_wasm(this.tree[0]);
    unmarshalTreeCursor(this);
    return result === 1;
  }
  /**
   * Move this cursor to the last child of its current node.
   *
   * This returns `true` if the cursor successfully moved, and returns
   * `false` if there were no children.
   *
   * Note that this function may be slower than
   * {@link TreeCursor#gotoFirstChild} because it needs to
   * iterate through all the children to compute the child's position.
   */
  gotoLastChild() {
    marshalTreeCursor(this);
    const result = C._ts_tree_cursor_goto_last_child_wasm(this.tree[0]);
    unmarshalTreeCursor(this);
    return result === 1;
  }
  /**
   * Move this cursor to the parent of its current node.
   *
   * This returns `true` if the cursor successfully moved, and returns
   * `false` if there was no parent node (the cursor was already on the
   * root node).
   *
   * Note that the node the cursor was constructed with is considered the root
   * of the cursor, and the cursor cannot walk outside this node.
   */
  gotoParent() {
    marshalTreeCursor(this);
    const result = C._ts_tree_cursor_goto_parent_wasm(this.tree[0]);
    unmarshalTreeCursor(this);
    return result === 1;
  }
  /**
   * Move this cursor to the next sibling of its current node.
   *
   * This returns `true` if the cursor successfully moved, and returns
   * `false` if there was no next sibling node.
   *
   * Note that the node the cursor was constructed with is considered the root
   * of the cursor, and the cursor cannot walk outside this node.
   */
  gotoNextSibling() {
    marshalTreeCursor(this);
    const result = C._ts_tree_cursor_goto_next_sibling_wasm(this.tree[0]);
    unmarshalTreeCursor(this);
    return result === 1;
  }
  /**
   * Move this cursor to the previous sibling of its current node.
   *
   * This returns `true` if the cursor successfully moved, and returns
   * `false` if there was no previous sibling node.
   *
   * Note that this function may be slower than
   * {@link TreeCursor#gotoNextSibling} due to how node
   * positions are stored. In the worst case, this will need to iterate
   * through all the children up to the previous sibling node to recalculate
   * its position. Also note that the node the cursor was constructed with is
   * considered the root of the cursor, and the cursor cannot walk outside this node.
   */
  gotoPreviousSibling() {
    marshalTreeCursor(this);
    const result = C._ts_tree_cursor_goto_previous_sibling_wasm(this.tree[0]);
    unmarshalTreeCursor(this);
    return result === 1;
  }
  /**
   * Move the cursor to the node that is the nth descendant of
   * the original node that the cursor was constructed with, where
   * zero represents the original node itself.
   */
  gotoDescendant(goalDescendantIndex) {
    marshalTreeCursor(this);
    C._ts_tree_cursor_goto_descendant_wasm(this.tree[0], goalDescendantIndex);
    unmarshalTreeCursor(this);
  }
  /**
   * Move this cursor to the first child of its current node that contains or
   * starts after the given byte offset.
   *
   * This returns `true` if the cursor successfully moved to a child node, and returns
   * `false` if no such child was found.
   */
  gotoFirstChildForIndex(goalIndex) {
    marshalTreeCursor(this);
    C.setValue(TRANSFER_BUFFER + SIZE_OF_CURSOR, goalIndex, "i32");
    const result = C._ts_tree_cursor_goto_first_child_for_index_wasm(this.tree[0]);
    unmarshalTreeCursor(this);
    return result === 1;
  }
  /**
   * Move this cursor to the first child of its current node that contains or
   * starts after the given byte offset.
   *
   * This returns the index of the child node if one was found, and returns
   * `null` if no such child was found.
   */
  gotoFirstChildForPosition(goalPosition) {
    marshalTreeCursor(this);
    marshalPoint(TRANSFER_BUFFER + SIZE_OF_CURSOR, goalPosition);
    const result = C._ts_tree_cursor_goto_first_child_for_position_wasm(this.tree[0]);
    unmarshalTreeCursor(this);
    return result === 1;
  }
  /**
   * Re-initialize this tree cursor to start at the original node that the
   * cursor was constructed with.
   */
  reset(node) {
    marshalNode(node);
    marshalTreeCursor(this, TRANSFER_BUFFER + SIZE_OF_NODE);
    C._ts_tree_cursor_reset_wasm(this.tree[0]);
    unmarshalTreeCursor(this);
  }
  /**
   * Re-initialize a tree cursor to the same position as another cursor.
   *
   * Unlike {@link TreeCursor#reset}, this will not lose parent
   * information and allows reusing already created cursors.
   */
  resetTo(cursor) {
    marshalTreeCursor(this, TRANSFER_BUFFER);
    marshalTreeCursor(cursor, TRANSFER_BUFFER + SIZE_OF_CURSOR);
    C._ts_tree_cursor_reset_to_wasm(this.tree[0], cursor.tree[0]);
    unmarshalTreeCursor(this);
  }
};
var Node = class {
  static {
    __name(this, "Node");
  }
  /** @internal */
  // @ts-expect-error: never read
  [0] = 0;
  // Internal handle for Wasm
  /** @internal */
  _children;
  /** @internal */
  _namedChildren;
  /** @internal */
  constructor(internal, {
    id,
    tree,
    startIndex,
    startPosition,
    other
  }) {
    assertInternal(internal);
    this[0] = other;
    this.id = id;
    this.tree = tree;
    this.startIndex = startIndex;
    this.startPosition = startPosition;
  }
  /**
   * The numeric id for this node that is unique.
   *
   * Within a given syntax tree, no two nodes have the same id. However:
   *
   * * If a new tree is created based on an older tree, and a node from the old tree is reused in
   *   the process, then that node will have the same id in both trees.
   *
   * * A node not marked as having changes does not guarantee it was reused.
   *
   * * If a node is marked as having changed in the old tree, it will not be reused.
   */
  id;
  /** The byte index where this node starts. */
  startIndex;
  /** The position where this node starts. */
  startPosition;
  /** The tree that this node belongs to. */
  tree;
  /** Get this node's type as a numerical id. */
  get typeId() {
    marshalNode(this);
    return C._ts_node_symbol_wasm(this.tree[0]);
  }
  /**
   * Get the node's type as a numerical id as it appears in the grammar,
   * ignoring aliases.
   */
  get grammarId() {
    marshalNode(this);
    return C._ts_node_grammar_symbol_wasm(this.tree[0]);
  }
  /** Get this node's type as a string. */
  get type() {
    return this.tree.language.types[this.typeId] || "ERROR";
  }
  /**
   * Get this node's symbol name as it appears in the grammar, ignoring
   * aliases as a string.
   */
  get grammarType() {
    return this.tree.language.types[this.grammarId] || "ERROR";
  }
  /**
   * Check if this node is *named*.
   *
   * Named nodes correspond to named rules in the grammar, whereas
   * *anonymous* nodes correspond to string literals in the grammar.
   */
  get isNamed() {
    marshalNode(this);
    return C._ts_node_is_named_wasm(this.tree[0]) === 1;
  }
  /**
   * Check if this node is *extra*.
   *
   * Extra nodes represent things like comments, which are not required
   * by the grammar, but can appear anywhere.
   */
  get isExtra() {
    marshalNode(this);
    return C._ts_node_is_extra_wasm(this.tree[0]) === 1;
  }
  /**
   * Check if this node represents a syntax error.
   *
   * Syntax errors represent parts of the code that could not be incorporated
   * into a valid syntax tree.
   */
  get isError() {
    marshalNode(this);
    return C._ts_node_is_error_wasm(this.tree[0]) === 1;
  }
  /**
   * Check if this node is *missing*.
   *
   * Missing nodes are inserted by the parser in order to recover from
   * certain kinds of syntax errors.
   */
  get isMissing() {
    marshalNode(this);
    return C._ts_node_is_missing_wasm(this.tree[0]) === 1;
  }
  /** Check if this node has been edited. */
  get hasChanges() {
    marshalNode(this);
    return C._ts_node_has_changes_wasm(this.tree[0]) === 1;
  }
  /**
   * Check if this node represents a syntax error or contains any syntax
   * errors anywhere within it.
   */
  get hasError() {
    marshalNode(this);
    return C._ts_node_has_error_wasm(this.tree[0]) === 1;
  }
  /** Get the byte index where this node ends. */
  get endIndex() {
    marshalNode(this);
    return C._ts_node_end_index_wasm(this.tree[0]);
  }
  /** Get the position where this node ends. */
  get endPosition() {
    marshalNode(this);
    C._ts_node_end_point_wasm(this.tree[0]);
    return unmarshalPoint(TRANSFER_BUFFER);
  }
  /** Get the string content of this node. */
  get text() {
    return getText(this.tree, this.startIndex, this.endIndex, this.startPosition);
  }
  /** Get this node's parse state. */
  get parseState() {
    marshalNode(this);
    return C._ts_node_parse_state_wasm(this.tree[0]);
  }
  /** Get the parse state after this node. */
  get nextParseState() {
    marshalNode(this);
    return C._ts_node_next_parse_state_wasm(this.tree[0]);
  }
  /** Check if this node is equal to another node. */
  equals(other) {
    return this.tree === other.tree && this.id === other.id;
  }
  /**
   * Get the node's child at the given index, where zero represents the first child.
   *
   * This method is fairly fast, but its cost is technically log(n), so if
   * you might be iterating over a long list of children, you should use
   * {@link Node#children} instead.
   */
  child(index) {
    marshalNode(this);
    C._ts_node_child_wasm(this.tree[0], index);
    return unmarshalNode(this.tree);
  }
  /**
   * Get this node's *named* child at the given index.
   *
   * See also {@link Node#isNamed}.
   * This method is fairly fast, but its cost is technically log(n), so if
   * you might be iterating over a long list of children, you should use
   * {@link Node#namedChildren} instead.
   */
  namedChild(index) {
    marshalNode(this);
    C._ts_node_named_child_wasm(this.tree[0], index);
    return unmarshalNode(this.tree);
  }
  /**
   * Get this node's child with the given numerical field id.
   *
   * See also {@link Node#childForFieldName}. You can
   * convert a field name to an id using {@link Language#fieldIdForName}.
   */
  childForFieldId(fieldId) {
    marshalNode(this);
    C._ts_node_child_by_field_id_wasm(this.tree[0], fieldId);
    return unmarshalNode(this.tree);
  }
  /**
   * Get the first child with the given field name.
   *
   * If multiple children may have the same field name, access them using
   * {@link Node#childrenForFieldName}.
   */
  childForFieldName(fieldName) {
    const fieldId = this.tree.language.fields.indexOf(fieldName);
    if (fieldId !== -1) return this.childForFieldId(fieldId);
    return null;
  }
  /** Get the field name of this node's child at the given index. */
  fieldNameForChild(index) {
    marshalNode(this);
    const address = C._ts_node_field_name_for_child_wasm(this.tree[0], index);
    if (!address) return null;
    return C.AsciiToString(address);
  }
  /** Get the field name of this node's named child at the given index. */
  fieldNameForNamedChild(index) {
    marshalNode(this);
    const address = C._ts_node_field_name_for_named_child_wasm(this.tree[0], index);
    if (!address) return null;
    return C.AsciiToString(address);
  }
  /**
   * Get an array of this node's children with a given field name.
   *
   * See also {@link Node#children}.
   */
  childrenForFieldName(fieldName) {
    const fieldId = this.tree.language.fields.indexOf(fieldName);
    if (fieldId !== -1 && fieldId !== 0) return this.childrenForFieldId(fieldId);
    return [];
  }
  /**
    * Get an array of this node's children with a given field id.
    *
    * See also {@link Node#childrenForFieldName}.
    */
  childrenForFieldId(fieldId) {
    marshalNode(this);
    C._ts_node_children_by_field_id_wasm(this.tree[0], fieldId);
    const count4 = C.getValue(TRANSFER_BUFFER, "i32");
    const buffer = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
    const result = new Array(count4);
    if (count4 > 0) {
      let address = buffer;
      for (let i2 = 0; i2 < count4; i2++) {
        result[i2] = unmarshalNode(this.tree, address);
        address += SIZE_OF_NODE;
      }
      C._free(buffer);
    }
    return result;
  }
  /** Get the node's first child that contains or starts after the given byte offset. */
  firstChildForIndex(index) {
    marshalNode(this);
    const address = TRANSFER_BUFFER + SIZE_OF_NODE;
    C.setValue(address, index, "i32");
    C._ts_node_first_child_for_byte_wasm(this.tree[0]);
    return unmarshalNode(this.tree);
  }
  /** Get the node's first named child that contains or starts after the given byte offset. */
  firstNamedChildForIndex(index) {
    marshalNode(this);
    const address = TRANSFER_BUFFER + SIZE_OF_NODE;
    C.setValue(address, index, "i32");
    C._ts_node_first_named_child_for_byte_wasm(this.tree[0]);
    return unmarshalNode(this.tree);
  }
  /** Get this node's number of children. */
  get childCount() {
    marshalNode(this);
    return C._ts_node_child_count_wasm(this.tree[0]);
  }
  /**
   * Get this node's number of *named* children.
   *
   * See also {@link Node#isNamed}.
   */
  get namedChildCount() {
    marshalNode(this);
    return C._ts_node_named_child_count_wasm(this.tree[0]);
  }
  /** Get this node's first child. */
  get firstChild() {
    return this.child(0);
  }
  /**
   * Get this node's first named child.
   *
   * See also {@link Node#isNamed}.
   */
  get firstNamedChild() {
    return this.namedChild(0);
  }
  /** Get this node's last child. */
  get lastChild() {
    return this.child(this.childCount - 1);
  }
  /**
   * Get this node's last named child.
   *
   * See also {@link Node#isNamed}.
   */
  get lastNamedChild() {
    return this.namedChild(this.namedChildCount - 1);
  }
  /**
   * Iterate over this node's children.
   *
   * If you're walking the tree recursively, you may want to use the
   * {@link TreeCursor} APIs directly instead.
   */
  get children() {
    if (!this._children) {
      marshalNode(this);
      C._ts_node_children_wasm(this.tree[0]);
      const count4 = C.getValue(TRANSFER_BUFFER, "i32");
      const buffer = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
      this._children = new Array(count4);
      if (count4 > 0) {
        let address = buffer;
        for (let i2 = 0; i2 < count4; i2++) {
          this._children[i2] = unmarshalNode(this.tree, address);
          address += SIZE_OF_NODE;
        }
        C._free(buffer);
      }
    }
    return this._children;
  }
  /**
   * Iterate over this node's named children.
   *
   * See also {@link Node#children}.
   */
  get namedChildren() {
    if (!this._namedChildren) {
      marshalNode(this);
      C._ts_node_named_children_wasm(this.tree[0]);
      const count4 = C.getValue(TRANSFER_BUFFER, "i32");
      const buffer = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
      this._namedChildren = new Array(count4);
      if (count4 > 0) {
        let address = buffer;
        for (let i2 = 0; i2 < count4; i2++) {
          this._namedChildren[i2] = unmarshalNode(this.tree, address);
          address += SIZE_OF_NODE;
        }
        C._free(buffer);
      }
    }
    return this._namedChildren;
  }
  /**
   * Get the descendants of this node that are the given type, or in the given types array.
   *
   * The types array should contain node type strings, which can be retrieved from {@link Language#types}.
   *
   * Additionally, a `startPosition` and `endPosition` can be passed in to restrict the search to a byte range.
   */
  descendantsOfType(types, startPosition = ZERO_POINT, endPosition = ZERO_POINT) {
    if (!Array.isArray(types)) types = [types];
    const symbols = [];
    const typesBySymbol = this.tree.language.types;
    for (const node_type of types) {
      if (node_type == "ERROR") {
        symbols.push(65535);
      }
    }
    for (let i2 = 0, n = typesBySymbol.length; i2 < n; i2++) {
      if (types.includes(typesBySymbol[i2])) {
        symbols.push(i2);
      }
    }
    const symbolsAddress = C._malloc(SIZE_OF_INT * symbols.length);
    for (let i2 = 0, n = symbols.length; i2 < n; i2++) {
      C.setValue(symbolsAddress + i2 * SIZE_OF_INT, symbols[i2], "i32");
    }
    marshalNode(this);
    C._ts_node_descendants_of_type_wasm(
      this.tree[0],
      symbolsAddress,
      symbols.length,
      startPosition.row,
      startPosition.column,
      endPosition.row,
      endPosition.column
    );
    const descendantCount = C.getValue(TRANSFER_BUFFER, "i32");
    const descendantAddress = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
    const result = new Array(descendantCount);
    if (descendantCount > 0) {
      let address = descendantAddress;
      for (let i2 = 0; i2 < descendantCount; i2++) {
        result[i2] = unmarshalNode(this.tree, address);
        address += SIZE_OF_NODE;
      }
    }
    C._free(descendantAddress);
    C._free(symbolsAddress);
    return result;
  }
  /** Get this node's next sibling. */
  get nextSibling() {
    marshalNode(this);
    C._ts_node_next_sibling_wasm(this.tree[0]);
    return unmarshalNode(this.tree);
  }
  /** Get this node's previous sibling. */
  get previousSibling() {
    marshalNode(this);
    C._ts_node_prev_sibling_wasm(this.tree[0]);
    return unmarshalNode(this.tree);
  }
  /**
   * Get this node's next *named* sibling.
   *
   * See also {@link Node#isNamed}.
   */
  get nextNamedSibling() {
    marshalNode(this);
    C._ts_node_next_named_sibling_wasm(this.tree[0]);
    return unmarshalNode(this.tree);
  }
  /**
   * Get this node's previous *named* sibling.
   *
   * See also {@link Node#isNamed}.
   */
  get previousNamedSibling() {
    marshalNode(this);
    C._ts_node_prev_named_sibling_wasm(this.tree[0]);
    return unmarshalNode(this.tree);
  }
  /** Get the node's number of descendants, including one for the node itself. */
  get descendantCount() {
    marshalNode(this);
    return C._ts_node_descendant_count_wasm(this.tree[0]);
  }
  /**
   * Get this node's immediate parent.
   * Prefer {@link Node#childWithDescendant} for iterating over this node's ancestors.
   */
  get parent() {
    marshalNode(this);
    C._ts_node_parent_wasm(this.tree[0]);
    return unmarshalNode(this.tree);
  }
  /**
   * Get the node that contains `descendant`.
   *
   * Note that this can return `descendant` itself.
   */
  childWithDescendant(descendant) {
    marshalNode(this);
    marshalNode(descendant, 1);
    C._ts_node_child_with_descendant_wasm(this.tree[0]);
    return unmarshalNode(this.tree);
  }
  /** Get the smallest node within this node that spans the given byte range. */
  descendantForIndex(start2, end = start2) {
    if (typeof start2 !== "number" || typeof end !== "number") {
      throw new Error("Arguments must be numbers");
    }
    marshalNode(this);
    const address = TRANSFER_BUFFER + SIZE_OF_NODE;
    C.setValue(address, start2, "i32");
    C.setValue(address + SIZE_OF_INT, end, "i32");
    C._ts_node_descendant_for_index_wasm(this.tree[0]);
    return unmarshalNode(this.tree);
  }
  /** Get the smallest named node within this node that spans the given byte range. */
  namedDescendantForIndex(start2, end = start2) {
    if (typeof start2 !== "number" || typeof end !== "number") {
      throw new Error("Arguments must be numbers");
    }
    marshalNode(this);
    const address = TRANSFER_BUFFER + SIZE_OF_NODE;
    C.setValue(address, start2, "i32");
    C.setValue(address + SIZE_OF_INT, end, "i32");
    C._ts_node_named_descendant_for_index_wasm(this.tree[0]);
    return unmarshalNode(this.tree);
  }
  /** Get the smallest node within this node that spans the given point range. */
  descendantForPosition(start2, end = start2) {
    if (!isPoint(start2) || !isPoint(end)) {
      throw new Error("Arguments must be {row, column} objects");
    }
    marshalNode(this);
    const address = TRANSFER_BUFFER + SIZE_OF_NODE;
    marshalPoint(address, start2);
    marshalPoint(address + SIZE_OF_POINT, end);
    C._ts_node_descendant_for_position_wasm(this.tree[0]);
    return unmarshalNode(this.tree);
  }
  /** Get the smallest named node within this node that spans the given point range. */
  namedDescendantForPosition(start2, end = start2) {
    if (!isPoint(start2) || !isPoint(end)) {
      throw new Error("Arguments must be {row, column} objects");
    }
    marshalNode(this);
    const address = TRANSFER_BUFFER + SIZE_OF_NODE;
    marshalPoint(address, start2);
    marshalPoint(address + SIZE_OF_POINT, end);
    C._ts_node_named_descendant_for_position_wasm(this.tree[0]);
    return unmarshalNode(this.tree);
  }
  /**
   * Create a new {@link TreeCursor} starting from this node.
   *
   * Note that the given node is considered the root of the cursor,
   * and the cursor cannot walk outside this node.
   */
  walk() {
    marshalNode(this);
    C._ts_tree_cursor_new_wasm(this.tree[0]);
    return new TreeCursor(INTERNAL, this.tree);
  }
  /**
   * Edit this node to keep it in-sync with source code that has been edited.
   *
   * This function is only rarely needed. When you edit a syntax tree with
   * the {@link Tree#edit} method, all of the nodes that you retrieve from
   * the tree afterward will already reflect the edit. You only need to
   * use {@link Node#edit} when you have a specific {@link Node} instance that
   * you want to keep and continue to use after an edit.
   */
  edit(edit) {
    if (this.startIndex >= edit.oldEndIndex) {
      this.startIndex = edit.newEndIndex + (this.startIndex - edit.oldEndIndex);
      let subbedPointRow;
      let subbedPointColumn;
      if (this.startPosition.row > edit.oldEndPosition.row) {
        subbedPointRow = this.startPosition.row - edit.oldEndPosition.row;
        subbedPointColumn = this.startPosition.column;
      } else {
        subbedPointRow = 0;
        subbedPointColumn = this.startPosition.column;
        if (this.startPosition.column >= edit.oldEndPosition.column) {
          subbedPointColumn = this.startPosition.column - edit.oldEndPosition.column;
        }
      }
      if (subbedPointRow > 0) {
        this.startPosition.row += subbedPointRow;
        this.startPosition.column = subbedPointColumn;
      } else {
        this.startPosition.column += subbedPointColumn;
      }
    } else if (this.startIndex > edit.startIndex) {
      this.startIndex = edit.newEndIndex;
      this.startPosition.row = edit.newEndPosition.row;
      this.startPosition.column = edit.newEndPosition.column;
    }
  }
  /** Get the S-expression representation of this node. */
  toString() {
    marshalNode(this);
    const address = C._ts_node_to_string_wasm(this.tree[0]);
    const result = C.AsciiToString(address);
    C._free(address);
    return result;
  }
};
function unmarshalCaptures(query, tree, address, patternIndex, result) {
  for (let i2 = 0, n = result.length; i2 < n; i2++) {
    const captureIndex = C.getValue(address, "i32");
    address += SIZE_OF_INT;
    const node = unmarshalNode(tree, address);
    address += SIZE_OF_NODE;
    result[i2] = { patternIndex, name: query.captureNames[captureIndex], node };
  }
  return address;
}
__name(unmarshalCaptures, "unmarshalCaptures");
function marshalNode(node, index = 0) {
  let address = TRANSFER_BUFFER + index * SIZE_OF_NODE;
  C.setValue(address, node.id, "i32");
  address += SIZE_OF_INT;
  C.setValue(address, node.startIndex, "i32");
  address += SIZE_OF_INT;
  C.setValue(address, node.startPosition.row, "i32");
  address += SIZE_OF_INT;
  C.setValue(address, node.startPosition.column, "i32");
  address += SIZE_OF_INT;
  C.setValue(address, node[0], "i32");
}
__name(marshalNode, "marshalNode");
function unmarshalNode(tree, address = TRANSFER_BUFFER) {
  const id = C.getValue(address, "i32");
  address += SIZE_OF_INT;
  if (id === 0) return null;
  const index = C.getValue(address, "i32");
  address += SIZE_OF_INT;
  const row = C.getValue(address, "i32");
  address += SIZE_OF_INT;
  const column = C.getValue(address, "i32");
  address += SIZE_OF_INT;
  const other = C.getValue(address, "i32");
  const result = new Node(INTERNAL, {
    id,
    tree,
    startIndex: index,
    startPosition: { row, column },
    other
  });
  return result;
}
__name(unmarshalNode, "unmarshalNode");
function marshalTreeCursor(cursor, address = TRANSFER_BUFFER) {
  C.setValue(address + 0 * SIZE_OF_INT, cursor[0], "i32");
  C.setValue(address + 1 * SIZE_OF_INT, cursor[1], "i32");
  C.setValue(address + 2 * SIZE_OF_INT, cursor[2], "i32");
  C.setValue(address + 3 * SIZE_OF_INT, cursor[3], "i32");
}
__name(marshalTreeCursor, "marshalTreeCursor");
function unmarshalTreeCursor(cursor) {
  cursor[0] = C.getValue(TRANSFER_BUFFER + 0 * SIZE_OF_INT, "i32");
  cursor[1] = C.getValue(TRANSFER_BUFFER + 1 * SIZE_OF_INT, "i32");
  cursor[2] = C.getValue(TRANSFER_BUFFER + 2 * SIZE_OF_INT, "i32");
  cursor[3] = C.getValue(TRANSFER_BUFFER + 3 * SIZE_OF_INT, "i32");
}
__name(unmarshalTreeCursor, "unmarshalTreeCursor");
function marshalPoint(address, point) {
  C.setValue(address, point.row, "i32");
  C.setValue(address + SIZE_OF_INT, point.column, "i32");
}
__name(marshalPoint, "marshalPoint");
function unmarshalPoint(address) {
  const result = {
    row: C.getValue(address, "i32") >>> 0,
    column: C.getValue(address + SIZE_OF_INT, "i32") >>> 0
  };
  return result;
}
__name(unmarshalPoint, "unmarshalPoint");
function marshalRange(address, range) {
  marshalPoint(address, range.startPosition);
  address += SIZE_OF_POINT;
  marshalPoint(address, range.endPosition);
  address += SIZE_OF_POINT;
  C.setValue(address, range.startIndex, "i32");
  address += SIZE_OF_INT;
  C.setValue(address, range.endIndex, "i32");
  address += SIZE_OF_INT;
}
__name(marshalRange, "marshalRange");
function unmarshalRange(address) {
  const result = {};
  result.startPosition = unmarshalPoint(address);
  address += SIZE_OF_POINT;
  result.endPosition = unmarshalPoint(address);
  address += SIZE_OF_POINT;
  result.startIndex = C.getValue(address, "i32") >>> 0;
  address += SIZE_OF_INT;
  result.endIndex = C.getValue(address, "i32") >>> 0;
  return result;
}
__name(unmarshalRange, "unmarshalRange");
function marshalEdit(edit, address = TRANSFER_BUFFER) {
  marshalPoint(address, edit.startPosition);
  address += SIZE_OF_POINT;
  marshalPoint(address, edit.oldEndPosition);
  address += SIZE_OF_POINT;
  marshalPoint(address, edit.newEndPosition);
  address += SIZE_OF_POINT;
  C.setValue(address, edit.startIndex, "i32");
  address += SIZE_OF_INT;
  C.setValue(address, edit.oldEndIndex, "i32");
  address += SIZE_OF_INT;
  C.setValue(address, edit.newEndIndex, "i32");
  address += SIZE_OF_INT;
}
__name(marshalEdit, "marshalEdit");
function unmarshalLanguageMetadata(address) {
  const major_version = C.getValue(address, "i32");
  const minor_version = C.getValue(address += SIZE_OF_INT, "i32");
  const patch_version = C.getValue(address += SIZE_OF_INT, "i32");
  return { major_version, minor_version, patch_version };
}
__name(unmarshalLanguageMetadata, "unmarshalLanguageMetadata");
var LANGUAGE_FUNCTION_REGEX = /^tree_sitter_\w+$/;
var Language = class _Language {
  static {
    __name(this, "Language");
  }
  /** @internal */
  [0] = 0;
  // Internal handle for Wasm
  /**
   * A list of all node types in the language. The index of each type in this
   * array is its node type id.
   */
  types;
  /**
   * A list of all field names in the language. The index of each field name in
   * this array is its field id.
   */
  fields;
  /** @internal */
  constructor(internal, address) {
    assertInternal(internal);
    this[0] = address;
    this.types = new Array(C._ts_language_symbol_count(this[0]));
    for (let i2 = 0, n = this.types.length; i2 < n; i2++) {
      if (C._ts_language_symbol_type(this[0], i2) < 2) {
        this.types[i2] = C.UTF8ToString(C._ts_language_symbol_name(this[0], i2));
      }
    }
    this.fields = new Array(C._ts_language_field_count(this[0]) + 1);
    for (let i2 = 0, n = this.fields.length; i2 < n; i2++) {
      const fieldName = C._ts_language_field_name_for_id(this[0], i2);
      if (fieldName !== 0) {
        this.fields[i2] = C.UTF8ToString(fieldName);
      } else {
        this.fields[i2] = null;
      }
    }
  }
  /**
   * Gets the name of the language.
   */
  get name() {
    const ptr = C._ts_language_name(this[0]);
    if (ptr === 0) return null;
    return C.UTF8ToString(ptr);
  }
  /**
   * Gets the ABI version of the language.
   */
  get abiVersion() {
    return C._ts_language_abi_version(this[0]);
  }
  /**
  * Get the metadata for this language. This information is generated by the
  * CLI, and relies on the language author providing the correct metadata in
  * the language's `tree-sitter.json` file.
  */
  get metadata() {
    C._ts_language_metadata_wasm(this[0]);
    const length = C.getValue(TRANSFER_BUFFER, "i32");
    if (length === 0) return null;
    return unmarshalLanguageMetadata(TRANSFER_BUFFER + SIZE_OF_INT);
  }
  /**
   * Gets the number of fields in the language.
   */
  get fieldCount() {
    return this.fields.length - 1;
  }
  /**
   * Gets the number of states in the language.
   */
  get stateCount() {
    return C._ts_language_state_count(this[0]);
  }
  /**
   * Get the field id for a field name.
   */
  fieldIdForName(fieldName) {
    const result = this.fields.indexOf(fieldName);
    return result !== -1 ? result : null;
  }
  /**
   * Get the field name for a field id.
   */
  fieldNameForId(fieldId) {
    return this.fields[fieldId] ?? null;
  }
  /**
   * Get the node type id for a node type name.
   */
  idForNodeType(type, named) {
    const typeLength = C.lengthBytesUTF8(type);
    const typeAddress = C._malloc(typeLength + 1);
    C.stringToUTF8(type, typeAddress, typeLength + 1);
    const result = C._ts_language_symbol_for_name(this[0], typeAddress, typeLength, named ? 1 : 0);
    C._free(typeAddress);
    return result || null;
  }
  /**
   * Gets the number of node types in the language.
   */
  get nodeTypeCount() {
    return C._ts_language_symbol_count(this[0]);
  }
  /**
   * Get the node type name for a node type id.
   */
  nodeTypeForId(typeId) {
    const name2 = C._ts_language_symbol_name(this[0], typeId);
    return name2 ? C.UTF8ToString(name2) : null;
  }
  /**
   * Check if a node type is named.
   *
   * @see {@link https://tree-sitter.github.io/tree-sitter/using-parsers/2-basic-parsing.html#named-vs-anonymous-nodes}
   */
  nodeTypeIsNamed(typeId) {
    return C._ts_language_type_is_named_wasm(this[0], typeId) ? true : false;
  }
  /**
   * Check if a node type is visible.
   */
  nodeTypeIsVisible(typeId) {
    return C._ts_language_type_is_visible_wasm(this[0], typeId) ? true : false;
  }
  /**
   * Get the supertypes ids of this language.
   *
   * @see {@link https://tree-sitter.github.io/tree-sitter/using-parsers/6-static-node-types.html?highlight=supertype#supertype-nodes}
   */
  get supertypes() {
    C._ts_language_supertypes_wasm(this[0]);
    const count4 = C.getValue(TRANSFER_BUFFER, "i32");
    const buffer = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
    const result = new Array(count4);
    if (count4 > 0) {
      let address = buffer;
      for (let i2 = 0; i2 < count4; i2++) {
        result[i2] = C.getValue(address, "i16");
        address += SIZE_OF_SHORT;
      }
    }
    return result;
  }
  /**
   * Get the subtype ids for a given supertype node id.
   */
  subtypes(supertype) {
    C._ts_language_subtypes_wasm(this[0], supertype);
    const count4 = C.getValue(TRANSFER_BUFFER, "i32");
    const buffer = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
    const result = new Array(count4);
    if (count4 > 0) {
      let address = buffer;
      for (let i2 = 0; i2 < count4; i2++) {
        result[i2] = C.getValue(address, "i16");
        address += SIZE_OF_SHORT;
      }
    }
    return result;
  }
  /**
   * Get the next state id for a given state id and node type id.
   */
  nextState(stateId, typeId) {
    return C._ts_language_next_state(this[0], stateId, typeId);
  }
  /**
   * Create a new lookahead iterator for this language and parse state.
   *
   * This returns `null` if state is invalid for this language.
   *
   * Iterating {@link LookaheadIterator} will yield valid symbols in the given
   * parse state. A newly created iterator is not positioned on a symbol, so
   * {@link LookaheadIterator#currentType} returns `null` until the first
   * iteration step.
   *
   * Lookahead iterators can be useful for generating suggestions and improving
   * syntax error diagnostics. To get symbols valid in an `ERROR` node, use the
   * lookahead iterator on its first leaf node state. For `MISSING` nodes, a
   * lookahead iterator created on the previous non-extra leaf node may be
   * appropriate.
   */
  lookaheadIterator(stateId) {
    const address = C._ts_lookahead_iterator_new(this[0], stateId);
    if (address) return new LookaheadIterator(INTERNAL, address, this);
    return null;
  }
  /**
   * Load a language from a WebAssembly module.
   * The module can be provided as a path to a file, a `URL` to a file, or as a
   * buffer.
   */
  static async load(input) {
    let binary2;
    if (input instanceof Uint8Array) {
      binary2 = input;
    } else if (globalThis.process?.versions.node) {
      const fs2 = await import("fs/promises");
      binary2 = await fs2.readFile(input);
    } else {
      const response = await fetch(input);
      if (!response.ok) {
        const body2 = await response.text();
        throw new Error(`Language.load failed with status ${response.status}.

${body2}`);
      }
      const retryResp = response.clone();
      try {
        binary2 = await WebAssembly.compileStreaming(response);
      } catch (reason) {
        console.error("wasm streaming compile failed:", reason);
        console.error("falling back to ArrayBuffer instantiation");
        binary2 = new Uint8Array(await retryResp.arrayBuffer());
      }
    }
    const mod = await C.loadWebAssemblyModule(binary2, { loadAsync: true });
    return _Language.loadFromWasmExports(mod, { sync: false });
  }
  static loadFromWasmExports(mod, { sync }) {
    const symbolNames = Object.keys(mod);
    const functionName = symbolNames.find((key) => LANGUAGE_FUNCTION_REGEX.test(key) && !key.includes("external_scanner_"));
    if (!functionName) {
      console.log(`Couldn't find language function in Wasm file. Symbols:
${JSON.stringify(symbolNames, null, 2)}`);
      throw new Error(`Language.${sync ? "loadSync" : "load"} failed: no language function found in Wasm file`);
    }
    const languageAddress = mod[functionName]();
    return new _Language(INTERNAL, languageAddress);
  }
  /**
   * Load a language synchronously from a pre-compiled WebAssembly module.
   * Use this when the host environment provides a `WebAssembly.Module` directly.
   */
  static loadSync(wasmModule) {
    const mod = C.loadWebAssemblyModule(wasmModule, { loadAsync: false });
    return _Language.loadFromWasmExports(mod, { sync: true });
  }
};
async function Module2(moduleArg = {}) {
  var moduleRtn;
  var Module = moduleArg;
  var ENVIRONMENT_IS_WEB = typeof window == "object";
  var ENVIRONMENT_IS_WORKER = typeof WorkerGlobalScope != "undefined";
  var ENVIRONMENT_IS_NODE = typeof process == "object" && process.versions?.node && process.type != "renderer";
  if (ENVIRONMENT_IS_NODE) {
    const { createRequire: createRequire2 } = await import("module");
    var require = createRequire2(import.meta.url);
  }
  Module.currentQueryProgressCallback = null;
  Module.currentProgressCallback = null;
  Module.currentLogCallback = null;
  Module.currentParseCallback = null;
  var arguments_ = [];
  var thisProgram = "./this.program";
  var quit_ = /* @__PURE__ */ __name((status, toThrow) => {
    throw toThrow;
  }, "quit_");
  var _scriptName = import.meta.url;
  var scriptDirectory = "";
  function locateFile(path) {
    if (Module["locateFile"]) {
      return Module["locateFile"](path, scriptDirectory);
    }
    return scriptDirectory + path;
  }
  __name(locateFile, "locateFile");
  var readAsync, readBinary;
  if (ENVIRONMENT_IS_NODE) {
    var fs = require("fs");
    if (_scriptName.startsWith("file:")) {
      scriptDirectory = require("path").dirname(require("url").fileURLToPath(_scriptName)) + "/";
    }
    readBinary = /* @__PURE__ */ __name((filename) => {
      filename = isFileURI(filename) ? new URL(filename) : filename;
      var ret = fs.readFileSync(filename);
      return ret;
    }, "readBinary");
    readAsync = /* @__PURE__ */ __name(async (filename, binary2 = true) => {
      filename = isFileURI(filename) ? new URL(filename) : filename;
      var ret = fs.readFileSync(filename, binary2 ? void 0 : "utf8");
      return ret;
    }, "readAsync");
    if (process.argv.length > 1) {
      thisProgram = process.argv[1].replace(/\\/g, "/");
    }
    arguments_ = process.argv.slice(2);
    quit_ = /* @__PURE__ */ __name((status, toThrow) => {
      process.exitCode = status;
      throw toThrow;
    }, "quit_");
  } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    try {
      scriptDirectory = new URL(".", _scriptName).href;
    } catch {
    }
    {
      if (ENVIRONMENT_IS_WORKER) {
        readBinary = /* @__PURE__ */ __name((url) => {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, false);
          xhr.responseType = "arraybuffer";
          xhr.send(null);
          return new Uint8Array(
            /** @type{!ArrayBuffer} */
            xhr.response
          );
        }, "readBinary");
      }
      readAsync = /* @__PURE__ */ __name(async (url) => {
        if (isFileURI(url)) {
          return new Promise((resolve9, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";
            xhr.onload = () => {
              if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                resolve9(xhr.response);
                return;
              }
              reject(xhr.status);
            };
            xhr.onerror = reject;
            xhr.send(null);
          });
        }
        var response = await fetch(url, {
          credentials: "same-origin"
        });
        if (response.ok) {
          return response.arrayBuffer();
        }
        throw new Error(response.status + " : " + response.url);
      }, "readAsync");
    }
  } else {
  }
  var out = console.log.bind(console);
  var err = console.error.bind(console);
  var dynamicLibraries = [];
  var wasmBinary;
  var ABORT = false;
  var EXITSTATUS;
  var isFileURI = /* @__PURE__ */ __name((filename) => filename.startsWith("file://"), "isFileURI");
  var readyPromiseResolve, readyPromiseReject;
  var wasmMemory;
  var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
  var HEAP64, HEAPU64;
  var HEAP_DATA_VIEW;
  var runtimeInitialized = false;
  function updateMemoryViews() {
    var b = wasmMemory.buffer;
    Module["HEAP8"] = HEAP8 = new Int8Array(b);
    Module["HEAP16"] = HEAP16 = new Int16Array(b);
    Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
    Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
    Module["HEAP32"] = HEAP32 = new Int32Array(b);
    Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
    Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
    Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
    Module["HEAP64"] = HEAP64 = new BigInt64Array(b);
    Module["HEAPU64"] = HEAPU64 = new BigUint64Array(b);
    Module["HEAP_DATA_VIEW"] = HEAP_DATA_VIEW = new DataView(b);
    LE_HEAP_UPDATE();
  }
  __name(updateMemoryViews, "updateMemoryViews");
  function initMemory() {
    if (Module["wasmMemory"]) {
      wasmMemory = Module["wasmMemory"];
    } else {
      var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 33554432;
      wasmMemory = new WebAssembly.Memory({
        "initial": INITIAL_MEMORY / 65536,
        // In theory we should not need to emit the maximum if we want "unlimited"
        // or 4GB of memory, but VMs error on that atm, see
        // https://github.com/emscripten-core/emscripten/issues/14130
        // And in the pthreads case we definitely need to emit a maximum. So
        // always emit one.
        "maximum": 32768
      });
    }
    updateMemoryViews();
  }
  __name(initMemory, "initMemory");
  var __RELOC_FUNCS__ = [];
  function preRun() {
    if (Module["preRun"]) {
      if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
      while (Module["preRun"].length) {
        addOnPreRun(Module["preRun"].shift());
      }
    }
    callRuntimeCallbacks(onPreRuns);
  }
  __name(preRun, "preRun");
  function initRuntime() {
    runtimeInitialized = true;
    callRuntimeCallbacks(__RELOC_FUNCS__);
    wasmExports["__wasm_call_ctors"]();
    callRuntimeCallbacks(onPostCtors);
  }
  __name(initRuntime, "initRuntime");
  function preMain() {
  }
  __name(preMain, "preMain");
  function postRun() {
    if (Module["postRun"]) {
      if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
      while (Module["postRun"].length) {
        addOnPostRun(Module["postRun"].shift());
      }
    }
    callRuntimeCallbacks(onPostRuns);
  }
  __name(postRun, "postRun");
  function abort(what) {
    Module["onAbort"]?.(what);
    what = "Aborted(" + what + ")";
    err(what);
    ABORT = true;
    what += ". Build with -sASSERTIONS for more info.";
    var e = new WebAssembly.RuntimeError(what);
    readyPromiseReject?.(e);
    throw e;
  }
  __name(abort, "abort");
  var wasmBinaryFile;
  function findWasmBinary() {
    if (Module["locateFile"]) {
      return locateFile("web-tree-sitter.wasm");
    }
    return new URL("web-tree-sitter.wasm", import.meta.url).href;
  }
  __name(findWasmBinary, "findWasmBinary");
  function getBinarySync(file) {
    if (file == wasmBinaryFile && wasmBinary) {
      return new Uint8Array(wasmBinary);
    }
    if (readBinary) {
      return readBinary(file);
    }
    throw "both async and sync fetching of the wasm failed";
  }
  __name(getBinarySync, "getBinarySync");
  async function getWasmBinary(binaryFile) {
    if (!wasmBinary) {
      try {
        var response = await readAsync(binaryFile);
        return new Uint8Array(response);
      } catch {
      }
    }
    return getBinarySync(binaryFile);
  }
  __name(getWasmBinary, "getWasmBinary");
  async function instantiateArrayBuffer(binaryFile, imports) {
    try {
      var binary2 = await getWasmBinary(binaryFile);
      var instance2 = await WebAssembly.instantiate(binary2, imports);
      return instance2;
    } catch (reason) {
      err(`failed to asynchronously prepare wasm: ${reason}`);
      abort(reason);
    }
  }
  __name(instantiateArrayBuffer, "instantiateArrayBuffer");
  async function instantiateAsync(binary2, binaryFile, imports) {
    if (!binary2 && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE) {
      try {
        var response = fetch(binaryFile, {
          credentials: "same-origin"
        });
        var instantiationResult = await WebAssembly.instantiateStreaming(response, imports);
        return instantiationResult;
      } catch (reason) {
        err(`wasm streaming compile failed: ${reason}`);
        err("falling back to ArrayBuffer instantiation");
      }
    }
    return instantiateArrayBuffer(binaryFile, imports);
  }
  __name(instantiateAsync, "instantiateAsync");
  function getWasmImports() {
    return {
      "env": wasmImports,
      "wasi_snapshot_preview1": wasmImports,
      "GOT.mem": new Proxy(wasmImports, GOTHandler),
      "GOT.func": new Proxy(wasmImports, GOTHandler)
    };
  }
  __name(getWasmImports, "getWasmImports");
  async function createWasm() {
    function receiveInstance(instance2, module2) {
      wasmExports = instance2.exports;
      wasmExports = relocateExports(wasmExports, 1024);
      var metadata2 = getDylinkMetadata(module2);
      if (metadata2.neededDynlibs) {
        dynamicLibraries = metadata2.neededDynlibs.concat(dynamicLibraries);
      }
      mergeLibSymbols(wasmExports, "main");
      LDSO.init();
      loadDylibs();
      __RELOC_FUNCS__.push(wasmExports["__wasm_apply_data_relocs"]);
      assignWasmExports(wasmExports);
      return wasmExports;
    }
    __name(receiveInstance, "receiveInstance");
    function receiveInstantiationResult(result2) {
      return receiveInstance(result2["instance"], result2["module"]);
    }
    __name(receiveInstantiationResult, "receiveInstantiationResult");
    var info2 = getWasmImports();
    if (Module["instantiateWasm"]) {
      return new Promise((resolve9, reject) => {
        Module["instantiateWasm"](info2, (mod, inst) => {
          resolve9(receiveInstance(mod, inst));
        });
      });
    }
    wasmBinaryFile ??= findWasmBinary();
    var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info2);
    var exports = receiveInstantiationResult(result);
    return exports;
  }
  __name(createWasm, "createWasm");
  class ExitStatus {
    static {
      __name(this, "ExitStatus");
    }
    name = "ExitStatus";
    constructor(status) {
      this.message = `Program terminated with exit(${status})`;
      this.status = status;
    }
  }
  var GOT = {};
  var currentModuleWeakSymbols = /* @__PURE__ */ new Set([]);
  var GOTHandler = {
    get(obj, symName) {
      var rtn = GOT[symName];
      if (!rtn) {
        rtn = GOT[symName] = new WebAssembly.Global({
          "value": "i32",
          "mutable": true
        });
      }
      if (!currentModuleWeakSymbols.has(symName)) {
        rtn.required = true;
      }
      return rtn;
    }
  };
  var LE_ATOMICS_NATIVE_BYTE_ORDER = [];
  var LE_HEAP_LOAD_F32 = /* @__PURE__ */ __name((byteOffset) => HEAP_DATA_VIEW.getFloat32(byteOffset, true), "LE_HEAP_LOAD_F32");
  var LE_HEAP_LOAD_F64 = /* @__PURE__ */ __name((byteOffset) => HEAP_DATA_VIEW.getFloat64(byteOffset, true), "LE_HEAP_LOAD_F64");
  var LE_HEAP_LOAD_I16 = /* @__PURE__ */ __name((byteOffset) => HEAP_DATA_VIEW.getInt16(byteOffset, true), "LE_HEAP_LOAD_I16");
  var LE_HEAP_LOAD_I32 = /* @__PURE__ */ __name((byteOffset) => HEAP_DATA_VIEW.getInt32(byteOffset, true), "LE_HEAP_LOAD_I32");
  var LE_HEAP_LOAD_I64 = /* @__PURE__ */ __name((byteOffset) => HEAP_DATA_VIEW.getBigInt64(byteOffset, true), "LE_HEAP_LOAD_I64");
  var LE_HEAP_LOAD_U32 = /* @__PURE__ */ __name((byteOffset) => HEAP_DATA_VIEW.getUint32(byteOffset, true), "LE_HEAP_LOAD_U32");
  var LE_HEAP_STORE_F32 = /* @__PURE__ */ __name((byteOffset, value) => HEAP_DATA_VIEW.setFloat32(byteOffset, value, true), "LE_HEAP_STORE_F32");
  var LE_HEAP_STORE_F64 = /* @__PURE__ */ __name((byteOffset, value) => HEAP_DATA_VIEW.setFloat64(byteOffset, value, true), "LE_HEAP_STORE_F64");
  var LE_HEAP_STORE_I16 = /* @__PURE__ */ __name((byteOffset, value) => HEAP_DATA_VIEW.setInt16(byteOffset, value, true), "LE_HEAP_STORE_I16");
  var LE_HEAP_STORE_I32 = /* @__PURE__ */ __name((byteOffset, value) => HEAP_DATA_VIEW.setInt32(byteOffset, value, true), "LE_HEAP_STORE_I32");
  var LE_HEAP_STORE_I64 = /* @__PURE__ */ __name((byteOffset, value) => HEAP_DATA_VIEW.setBigInt64(byteOffset, value, true), "LE_HEAP_STORE_I64");
  var LE_HEAP_STORE_U32 = /* @__PURE__ */ __name((byteOffset, value) => HEAP_DATA_VIEW.setUint32(byteOffset, value, true), "LE_HEAP_STORE_U32");
  var callRuntimeCallbacks = /* @__PURE__ */ __name((callbacks) => {
    while (callbacks.length > 0) {
      callbacks.shift()(Module);
    }
  }, "callRuntimeCallbacks");
  var onPostRuns = [];
  var addOnPostRun = /* @__PURE__ */ __name((cb) => onPostRuns.push(cb), "addOnPostRun");
  var onPreRuns = [];
  var addOnPreRun = /* @__PURE__ */ __name((cb) => onPreRuns.push(cb), "addOnPreRun");
  var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder() : void 0;
  var findStringEnd = /* @__PURE__ */ __name((heapOrArray, idx, maxBytesToRead, ignoreNul) => {
    var maxIdx = idx + maxBytesToRead;
    if (ignoreNul) return maxIdx;
    while (heapOrArray[idx] && !(idx >= maxIdx)) ++idx;
    return idx;
  }, "findStringEnd");
  var UTF8ArrayToString = /* @__PURE__ */ __name((heapOrArray, idx = 0, maxBytesToRead, ignoreNul) => {
    var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
    if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
      return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
    }
    var str = "";
    while (idx < endPtr) {
      var u0 = heapOrArray[idx++];
      if (!(u0 & 128)) {
        str += String.fromCharCode(u0);
        continue;
      }
      var u1 = heapOrArray[idx++] & 63;
      if ((u0 & 224) == 192) {
        str += String.fromCharCode((u0 & 31) << 6 | u1);
        continue;
      }
      var u2 = heapOrArray[idx++] & 63;
      if ((u0 & 240) == 224) {
        u0 = (u0 & 15) << 12 | u1 << 6 | u2;
      } else {
        u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
      }
      if (u0 < 65536) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 65536;
        str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
      }
    }
    return str;
  }, "UTF8ArrayToString");
  var getDylinkMetadata = /* @__PURE__ */ __name((binary2) => {
    var offset = 0;
    var end = 0;
    function getU8() {
      return binary2[offset++];
    }
    __name(getU8, "getU8");
    function getLEB() {
      var ret = 0;
      var mul = 1;
      while (1) {
        var byte = binary2[offset++];
        ret += (byte & 127) * mul;
        mul *= 128;
        if (!(byte & 128)) break;
      }
      return ret;
    }
    __name(getLEB, "getLEB");
    function getString() {
      var len = getLEB();
      offset += len;
      return UTF8ArrayToString(binary2, offset - len, len);
    }
    __name(getString, "getString");
    function getStringList() {
      var count22 = getLEB();
      var rtn = [];
      while (count22--) rtn.push(getString());
      return rtn;
    }
    __name(getStringList, "getStringList");
    function failIf(condition, message) {
      if (condition) throw new Error(message);
    }
    __name(failIf, "failIf");
    if (binary2 instanceof WebAssembly.Module) {
      var dylinkSection = WebAssembly.Module.customSections(binary2, "dylink.0");
      failIf(dylinkSection.length === 0, "need dylink section");
      binary2 = new Uint8Array(dylinkSection[0]);
      end = binary2.length;
    } else {
      var int32View = new Uint32Array(new Uint8Array(binary2.subarray(0, 24)).buffer);
      var magicNumberFound = int32View[0] == 1836278016 || int32View[0] == 6386541;
      failIf(!magicNumberFound, "need to see wasm magic number");
      failIf(binary2[8] !== 0, "need the dylink section to be first");
      offset = 9;
      var section_size = getLEB();
      end = offset + section_size;
      var name2 = getString();
      failIf(name2 !== "dylink.0");
    }
    var customSection = {
      neededDynlibs: [],
      tlsExports: /* @__PURE__ */ new Set(),
      weakImports: /* @__PURE__ */ new Set(),
      runtimePaths: []
    };
    var WASM_DYLINK_MEM_INFO = 1;
    var WASM_DYLINK_NEEDED = 2;
    var WASM_DYLINK_EXPORT_INFO = 3;
    var WASM_DYLINK_IMPORT_INFO = 4;
    var WASM_DYLINK_RUNTIME_PATH = 5;
    var WASM_SYMBOL_TLS = 256;
    var WASM_SYMBOL_BINDING_MASK = 3;
    var WASM_SYMBOL_BINDING_WEAK = 1;
    while (offset < end) {
      var subsectionType = getU8();
      var subsectionSize = getLEB();
      if (subsectionType === WASM_DYLINK_MEM_INFO) {
        customSection.memorySize = getLEB();
        customSection.memoryAlign = getLEB();
        customSection.tableSize = getLEB();
        customSection.tableAlign = getLEB();
      } else if (subsectionType === WASM_DYLINK_NEEDED) {
        customSection.neededDynlibs = getStringList();
      } else if (subsectionType === WASM_DYLINK_EXPORT_INFO) {
        var count4 = getLEB();
        while (count4--) {
          var symname = getString();
          var flags2 = getLEB();
          if (flags2 & WASM_SYMBOL_TLS) {
            customSection.tlsExports.add(symname);
          }
        }
      } else if (subsectionType === WASM_DYLINK_IMPORT_INFO) {
        var count4 = getLEB();
        while (count4--) {
          var modname = getString();
          var symname = getString();
          var flags2 = getLEB();
          if ((flags2 & WASM_SYMBOL_BINDING_MASK) == WASM_SYMBOL_BINDING_WEAK) {
            customSection.weakImports.add(symname);
          }
        }
      } else if (subsectionType === WASM_DYLINK_RUNTIME_PATH) {
        customSection.runtimePaths = getStringList();
      } else {
        offset += subsectionSize;
      }
    }
    return customSection;
  }, "getDylinkMetadata");
  function getValue(ptr, type = "i8") {
    if (type.endsWith("*")) type = "*";
    switch (type) {
      case "i1":
        return HEAP8[ptr];
      case "i8":
        return HEAP8[ptr];
      case "i16":
        return LE_HEAP_LOAD_I16((ptr >> 1) * 2);
      case "i32":
        return LE_HEAP_LOAD_I32((ptr >> 2) * 4);
      case "i64":
        return LE_HEAP_LOAD_I64((ptr >> 3) * 8);
      case "float":
        return LE_HEAP_LOAD_F32((ptr >> 2) * 4);
      case "double":
        return LE_HEAP_LOAD_F64((ptr >> 3) * 8);
      case "*":
        return LE_HEAP_LOAD_U32((ptr >> 2) * 4);
      default:
        abort(`invalid type for getValue: ${type}`);
    }
  }
  __name(getValue, "getValue");
  var newDSO = /* @__PURE__ */ __name((name2, handle2, syms) => {
    var dso = {
      refcount: Infinity,
      name: name2,
      exports: syms,
      global: true
    };
    LDSO.loadedLibsByName[name2] = dso;
    if (handle2 != void 0) {
      LDSO.loadedLibsByHandle[handle2] = dso;
    }
    return dso;
  }, "newDSO");
  var LDSO = {
    loadedLibsByName: {},
    loadedLibsByHandle: {},
    init() {
      newDSO("__main__", 0, wasmImports);
    }
  };
  var ___heap_base = 82240;
  var alignMemory = /* @__PURE__ */ __name((size, alignment) => Math.ceil(size / alignment) * alignment, "alignMemory");
  var getMemory = /* @__PURE__ */ __name((size) => {
    if (runtimeInitialized) {
      return _calloc(size, 1);
    }
    var ret = ___heap_base;
    var end = ret + alignMemory(size, 16);
    ___heap_base = end;
    GOT["__heap_base"].value = end;
    return ret;
  }, "getMemory");
  var isInternalSym = /* @__PURE__ */ __name((symName) => ["__cpp_exception", "__c_longjmp", "__wasm_apply_data_relocs", "__dso_handle", "__tls_size", "__tls_align", "__set_stack_limits", "_emscripten_tls_init", "__wasm_init_tls", "__wasm_call_ctors", "__start_em_asm", "__stop_em_asm", "__start_em_js", "__stop_em_js"].includes(symName) || symName.startsWith("__em_js__"), "isInternalSym");
  var uleb128EncodeWithLen = /* @__PURE__ */ __name((arr) => {
    const n = arr.length;
    return [n % 128 | 128, n >> 7, ...arr];
  }, "uleb128EncodeWithLen");
  var wasmTypeCodes = {
    "i": 127,
    // i32
    "p": 127,
    // i32
    "j": 126,
    // i64
    "f": 125,
    // f32
    "d": 124,
    // f64
    "e": 111
  };
  var generateTypePack = /* @__PURE__ */ __name((types) => uleb128EncodeWithLen(Array.from(types, (type) => {
    var code = wasmTypeCodes[type];
    return code;
  })), "generateTypePack");
  var convertJsFunctionToWasm = /* @__PURE__ */ __name((func2, sig) => {
    var bytes = Uint8Array.of(
      0,
      97,
      115,
      109,
      // magic ("\0asm")
      1,
      0,
      0,
      0,
      // version: 1
      1,
      ...uleb128EncodeWithLen([
        1,
        // count: 1
        96,
        // param types
        ...generateTypePack(sig.slice(1)),
        // return types (for now only supporting [] if `void` and single [T] otherwise)
        ...generateTypePack(sig[0] === "v" ? "" : sig[0])
      ]),
      // The rest of the module is static
      2,
      7,
      // import section
      // (import "e" "f" (func 0 (type 0)))
      1,
      1,
      101,
      1,
      102,
      0,
      0,
      7,
      5,
      // export section
      // (export "f" (func 0 (type 0)))
      1,
      1,
      102,
      0,
      0
    );
    var module2 = new WebAssembly.Module(bytes);
    var instance2 = new WebAssembly.Instance(module2, {
      "e": {
        "f": func2
      }
    });
    var wrappedFunc = instance2.exports["f"];
    return wrappedFunc;
  }, "convertJsFunctionToWasm");
  var wasmTableMirror = [];
  var wasmTable = new WebAssembly.Table({
    "initial": 31,
    "element": "anyfunc"
  });
  var getWasmTableEntry = /* @__PURE__ */ __name((funcPtr) => {
    var func2 = wasmTableMirror[funcPtr];
    if (!func2) {
      wasmTableMirror[funcPtr] = func2 = wasmTable.get(funcPtr);
    }
    return func2;
  }, "getWasmTableEntry");
  var updateTableMap = /* @__PURE__ */ __name((offset, count4) => {
    if (functionsInTableMap) {
      for (var i2 = offset; i2 < offset + count4; i2++) {
        var item = getWasmTableEntry(i2);
        if (item) {
          functionsInTableMap.set(item, i2);
        }
      }
    }
  }, "updateTableMap");
  var functionsInTableMap;
  var getFunctionAddress = /* @__PURE__ */ __name((func2) => {
    if (!functionsInTableMap) {
      functionsInTableMap = /* @__PURE__ */ new WeakMap();
      updateTableMap(0, wasmTable.length);
    }
    return functionsInTableMap.get(func2) || 0;
  }, "getFunctionAddress");
  var freeTableIndexes = [];
  var getEmptyTableSlot = /* @__PURE__ */ __name(() => {
    if (freeTableIndexes.length) {
      return freeTableIndexes.pop();
    }
    return wasmTable["grow"](1);
  }, "getEmptyTableSlot");
  var setWasmTableEntry = /* @__PURE__ */ __name((idx, func2) => {
    wasmTable.set(idx, func2);
    wasmTableMirror[idx] = wasmTable.get(idx);
  }, "setWasmTableEntry");
  var addFunction = /* @__PURE__ */ __name((func2, sig) => {
    var rtn = getFunctionAddress(func2);
    if (rtn) {
      return rtn;
    }
    var ret = getEmptyTableSlot();
    try {
      setWasmTableEntry(ret, func2);
    } catch (err2) {
      if (!(err2 instanceof TypeError)) {
        throw err2;
      }
      var wrapped = convertJsFunctionToWasm(func2, sig);
      setWasmTableEntry(ret, wrapped);
    }
    functionsInTableMap.set(func2, ret);
    return ret;
  }, "addFunction");
  var updateGOT = /* @__PURE__ */ __name((exports, replace) => {
    for (var symName in exports) {
      if (isInternalSym(symName)) {
        continue;
      }
      var value = exports[symName];
      GOT[symName] ||= new WebAssembly.Global({
        "value": "i32",
        "mutable": true
      });
      if (replace || GOT[symName].value == 0) {
        if (typeof value == "function") {
          GOT[symName].value = addFunction(value);
        } else if (typeof value == "number") {
          GOT[symName].value = value;
        } else {
          err(`unhandled export type for '${symName}': ${typeof value}`);
        }
      }
    }
  }, "updateGOT");
  var relocateExports = /* @__PURE__ */ __name((exports, memoryBase2, replace) => {
    var relocated = {};
    for (var e in exports) {
      var value = exports[e];
      if (typeof value == "object") {
        value = value.value;
      }
      if (typeof value == "number") {
        value += memoryBase2;
      }
      relocated[e] = value;
    }
    updateGOT(relocated, replace);
    return relocated;
  }, "relocateExports");
  var isSymbolDefined = /* @__PURE__ */ __name((symName) => {
    var existing = wasmImports[symName];
    if (!existing || existing.stub) {
      return false;
    }
    return true;
  }, "isSymbolDefined");
  var dynCall = /* @__PURE__ */ __name((sig, ptr, args2 = [], promising = false) => {
    var func2 = getWasmTableEntry(ptr);
    var rtn = func2(...args2);
    function convert(rtn2) {
      return rtn2;
    }
    __name(convert, "convert");
    return convert(rtn);
  }, "dynCall");
  var stackSave = /* @__PURE__ */ __name(() => _emscripten_stack_get_current(), "stackSave");
  var stackRestore = /* @__PURE__ */ __name((val) => __emscripten_stack_restore(val), "stackRestore");
  var createInvokeFunction = /* @__PURE__ */ __name((sig) => (ptr, ...args2) => {
    var sp = stackSave();
    try {
      return dynCall(sig, ptr, args2);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0) throw e;
      _setThrew(1, 0);
      if (sig[0] == "j") return 0n;
    }
  }, "createInvokeFunction");
  var resolveGlobalSymbol = /* @__PURE__ */ __name((symName, direct = false) => {
    var sym;
    if (isSymbolDefined(symName)) {
      sym = wasmImports[symName];
    } else if (symName.startsWith("invoke_")) {
      sym = wasmImports[symName] = createInvokeFunction(symName.split("_")[1]);
    }
    return {
      sym,
      name: symName
    };
  }, "resolveGlobalSymbol");
  var onPostCtors = [];
  var addOnPostCtor = /* @__PURE__ */ __name((cb) => onPostCtors.push(cb), "addOnPostCtor");
  var UTF8ToString = /* @__PURE__ */ __name((ptr, maxBytesToRead, ignoreNul) => ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead, ignoreNul) : "", "UTF8ToString");
  var loadWebAssemblyModule = /* @__PURE__ */ __name((binary, flags, libName, localScope, handle) => {
    var metadata = getDylinkMetadata(binary);
    function loadModule() {
      var memAlign = Math.pow(2, metadata.memoryAlign);
      var memoryBase = metadata.memorySize ? alignMemory(getMemory(metadata.memorySize + memAlign), memAlign) : 0;
      var tableBase = metadata.tableSize ? wasmTable.length : 0;
      if (handle) {
        HEAP8[handle + 8] = 1;
        LE_HEAP_STORE_U32((handle + 12 >> 2) * 4, memoryBase);
        LE_HEAP_STORE_I32((handle + 16 >> 2) * 4, metadata.memorySize);
        LE_HEAP_STORE_U32((handle + 20 >> 2) * 4, tableBase);
        LE_HEAP_STORE_I32((handle + 24 >> 2) * 4, metadata.tableSize);
      }
      if (metadata.tableSize) {
        wasmTable.grow(metadata.tableSize);
      }
      var moduleExports;
      function resolveSymbol(sym) {
        var resolved = resolveGlobalSymbol(sym).sym;
        if (!resolved && localScope) {
          resolved = localScope[sym];
        }
        if (!resolved) {
          resolved = moduleExports[sym];
        }
        return resolved;
      }
      __name(resolveSymbol, "resolveSymbol");
      var proxyHandler = {
        get(stubs, prop) {
          switch (prop) {
            case "__memory_base":
              return memoryBase;
            case "__table_base":
              return tableBase;
          }
          if (prop in wasmImports && !wasmImports[prop].stub) {
            var res = wasmImports[prop];
            return res;
          }
          if (!(prop in stubs)) {
            var resolved;
            stubs[prop] = (...args2) => {
              resolved ||= resolveSymbol(prop);
              return resolved(...args2);
            };
          }
          return stubs[prop];
        }
      };
      var proxy = new Proxy({}, proxyHandler);
      currentModuleWeakSymbols = metadata.weakImports;
      var info = {
        "GOT.mem": new Proxy({}, GOTHandler),
        "GOT.func": new Proxy({}, GOTHandler),
        "env": proxy,
        "wasi_snapshot_preview1": proxy
      };
      function postInstantiation(module, instance) {
        updateTableMap(tableBase, metadata.tableSize);
        moduleExports = relocateExports(instance.exports, memoryBase);
        if (!flags.allowUndefined) {
          reportUndefinedSymbols();
        }
        function addEmAsm(addr, body) {
          var args = [];
          var arity = 0;
          for (; arity < 16; arity++) {
            if (body.indexOf("$" + arity) != -1) {
              args.push("$" + arity);
            } else {
              break;
            }
          }
          args = args.join(",");
          var func = `(${args}) => { ${body} };`;
          ASM_CONSTS[start] = eval(func);
        }
        __name(addEmAsm, "addEmAsm");
        if ("__start_em_asm" in moduleExports) {
          var start = moduleExports["__start_em_asm"];
          var stop = moduleExports["__stop_em_asm"];
          while (start < stop) {
            var jsString = UTF8ToString(start);
            addEmAsm(start, jsString);
            start = HEAPU8.indexOf(0, start) + 1;
          }
        }
        function addEmJs(name, cSig, body) {
          var jsArgs = [];
          cSig = cSig.slice(1, -1);
          if (cSig != "void") {
            cSig = cSig.split(",");
            for (var i in cSig) {
              var jsArg = cSig[i].split(" ").pop();
              jsArgs.push(jsArg.replace("*", ""));
            }
          }
          var func = `(${jsArgs}) => ${body};`;
          moduleExports[name] = eval(func);
        }
        __name(addEmJs, "addEmJs");
        for (var name in moduleExports) {
          if (name.startsWith("__em_js__")) {
            var start = moduleExports[name];
            var jsString = UTF8ToString(start);
            var parts = jsString.split("<::>");
            addEmJs(name.replace("__em_js__", ""), parts[0], parts[1]);
            delete moduleExports[name];
          }
        }
        var applyRelocs = moduleExports["__wasm_apply_data_relocs"];
        if (applyRelocs) {
          if (runtimeInitialized) {
            applyRelocs();
          } else {
            __RELOC_FUNCS__.push(applyRelocs);
          }
        }
        var init = moduleExports["__wasm_call_ctors"];
        if (init) {
          if (runtimeInitialized) {
            init();
          } else {
            addOnPostCtor(init);
          }
        }
        return moduleExports;
      }
      __name(postInstantiation, "postInstantiation");
      if (flags.loadAsync) {
        return (async () => {
          var instance2;
          if (binary instanceof WebAssembly.Module) {
            instance2 = new WebAssembly.Instance(binary, info);
          } else {
            ({ module: binary, instance: instance2 } = await WebAssembly.instantiate(binary, info));
          }
          return postInstantiation(binary, instance2);
        })();
      }
      var module = binary instanceof WebAssembly.Module ? binary : new WebAssembly.Module(binary);
      var instance = new WebAssembly.Instance(module, info);
      return postInstantiation(module, instance);
    }
    __name(loadModule, "loadModule");
    flags = {
      ...flags,
      rpath: {
        parentLibPath: libName,
        paths: metadata.runtimePaths
      }
    };
    if (flags.loadAsync) {
      return metadata.neededDynlibs.reduce((chain, dynNeeded) => chain.then(() => loadDynamicLibrary(dynNeeded, flags, localScope)), Promise.resolve()).then(loadModule);
    }
    metadata.neededDynlibs.forEach((needed) => loadDynamicLibrary(needed, flags, localScope));
    return loadModule();
  }, "loadWebAssemblyModule");
  var mergeLibSymbols = /* @__PURE__ */ __name((exports, libName2) => {
    for (var [sym, exp] of Object.entries(exports)) {
      const setImport = /* @__PURE__ */ __name((target) => {
        if (!isSymbolDefined(target)) {
          wasmImports[target] = exp;
        }
      }, "setImport");
      setImport(sym);
      const main_alias = "__main_argc_argv";
      if (sym == "main") {
        setImport(main_alias);
      }
      if (sym == main_alias) {
        setImport("main");
      }
    }
  }, "mergeLibSymbols");
  var asyncLoad = /* @__PURE__ */ __name(async (url) => {
    var arrayBuffer = await readAsync(url);
    return new Uint8Array(arrayBuffer);
  }, "asyncLoad");
  function loadDynamicLibrary(libName2, flags2 = {
    global: true,
    nodelete: true
  }, localScope2, handle2) {
    var dso = LDSO.loadedLibsByName[libName2];
    if (dso) {
      if (!flags2.global) {
        if (localScope2) {
          Object.assign(localScope2, dso.exports);
        }
      } else if (!dso.global) {
        dso.global = true;
        mergeLibSymbols(dso.exports, libName2);
      }
      if (flags2.nodelete && dso.refcount !== Infinity) {
        dso.refcount = Infinity;
      }
      dso.refcount++;
      if (handle2) {
        LDSO.loadedLibsByHandle[handle2] = dso;
      }
      return flags2.loadAsync ? Promise.resolve(true) : true;
    }
    dso = newDSO(libName2, handle2, "loading");
    dso.refcount = flags2.nodelete ? Infinity : 1;
    dso.global = flags2.global;
    function loadLibData() {
      if (handle2) {
        var data = LE_HEAP_LOAD_U32((handle2 + 28 >> 2) * 4);
        var dataSize = LE_HEAP_LOAD_U32((handle2 + 32 >> 2) * 4);
        if (data && dataSize) {
          var libData = HEAP8.slice(data, data + dataSize);
          return flags2.loadAsync ? Promise.resolve(libData) : libData;
        }
      }
      var libFile = locateFile(libName2);
      if (flags2.loadAsync) {
        return asyncLoad(libFile);
      }
      if (!readBinary) {
        throw new Error(`${libFile}: file not found, and synchronous loading of external files is not available`);
      }
      return readBinary(libFile);
    }
    __name(loadLibData, "loadLibData");
    function getExports() {
      if (flags2.loadAsync) {
        return loadLibData().then((libData) => loadWebAssemblyModule(libData, flags2, libName2, localScope2, handle2));
      }
      return loadWebAssemblyModule(loadLibData(), flags2, libName2, localScope2, handle2);
    }
    __name(getExports, "getExports");
    function moduleLoaded(exports) {
      if (dso.global) {
        mergeLibSymbols(exports, libName2);
      } else if (localScope2) {
        Object.assign(localScope2, exports);
      }
      dso.exports = exports;
    }
    __name(moduleLoaded, "moduleLoaded");
    if (flags2.loadAsync) {
      return getExports().then((exports) => {
        moduleLoaded(exports);
        return true;
      });
    }
    moduleLoaded(getExports());
    return true;
  }
  __name(loadDynamicLibrary, "loadDynamicLibrary");
  var reportUndefinedSymbols = /* @__PURE__ */ __name(() => {
    for (var [symName, entry] of Object.entries(GOT)) {
      if (entry.value == 0) {
        var value = resolveGlobalSymbol(symName, true).sym;
        if (!value && !entry.required) {
          continue;
        }
        if (typeof value == "function") {
          entry.value = addFunction(value, value.sig);
        } else if (typeof value == "number") {
          entry.value = value;
        } else {
          throw new Error(`bad export type for '${symName}': ${typeof value}`);
        }
      }
    }
  }, "reportUndefinedSymbols");
  var runDependencies = 0;
  var dependenciesFulfilled = null;
  var removeRunDependency = /* @__PURE__ */ __name((id) => {
    runDependencies--;
    Module["monitorRunDependencies"]?.(runDependencies);
    if (runDependencies == 0) {
      if (dependenciesFulfilled) {
        var callback = dependenciesFulfilled;
        dependenciesFulfilled = null;
        callback();
      }
    }
  }, "removeRunDependency");
  var addRunDependency = /* @__PURE__ */ __name((id) => {
    runDependencies++;
    Module["monitorRunDependencies"]?.(runDependencies);
  }, "addRunDependency");
  var loadDylibs = /* @__PURE__ */ __name(async () => {
    if (!dynamicLibraries.length) {
      reportUndefinedSymbols();
      return;
    }
    addRunDependency("loadDylibs");
    for (var lib of dynamicLibraries) {
      await loadDynamicLibrary(lib, {
        loadAsync: true,
        global: true,
        nodelete: true,
        allowUndefined: true
      });
    }
    reportUndefinedSymbols();
    removeRunDependency("loadDylibs");
  }, "loadDylibs");
  var noExitRuntime = true;
  function setValue(ptr, value, type = "i8") {
    if (type.endsWith("*")) type = "*";
    switch (type) {
      case "i1":
        HEAP8[ptr] = value;
        break;
      case "i8":
        HEAP8[ptr] = value;
        break;
      case "i16":
        LE_HEAP_STORE_I16((ptr >> 1) * 2, value);
        break;
      case "i32":
        LE_HEAP_STORE_I32((ptr >> 2) * 4, value);
        break;
      case "i64":
        LE_HEAP_STORE_I64((ptr >> 3) * 8, BigInt(value));
        break;
      case "float":
        LE_HEAP_STORE_F32((ptr >> 2) * 4, value);
        break;
      case "double":
        LE_HEAP_STORE_F64((ptr >> 3) * 8, value);
        break;
      case "*":
        LE_HEAP_STORE_U32((ptr >> 2) * 4, value);
        break;
      default:
        abort(`invalid type for setValue: ${type}`);
    }
  }
  __name(setValue, "setValue");
  var ___memory_base = new WebAssembly.Global({
    "value": "i32",
    "mutable": false
  }, 1024);
  var ___stack_high = 82240;
  var ___stack_low = 16704;
  var ___stack_pointer = new WebAssembly.Global({
    "value": "i32",
    "mutable": true
  }, 82240);
  var ___table_base = new WebAssembly.Global({
    "value": "i32",
    "mutable": false
  }, 1);
  var __abort_js = /* @__PURE__ */ __name(() => abort(""), "__abort_js");
  __abort_js.sig = "v";
  var getHeapMax = /* @__PURE__ */ __name(() => (
    // Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
    // full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
    // for any code that deals with heap sizes, which would require special
    // casing all heap size related code to treat 0 specially.
    2147483648
  ), "getHeapMax");
  var growMemory = /* @__PURE__ */ __name((size) => {
    var oldHeapSize = wasmMemory.buffer.byteLength;
    var pages = (size - oldHeapSize + 65535) / 65536 | 0;
    try {
      wasmMemory.grow(pages);
      updateMemoryViews();
      return 1;
    } catch (e) {
    }
  }, "growMemory");
  var _emscripten_resize_heap = /* @__PURE__ */ __name((requestedSize) => {
    var oldSize = HEAPU8.length;
    requestedSize >>>= 0;
    var maxHeapSize = getHeapMax();
    if (requestedSize > maxHeapSize) {
      return false;
    }
    for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
      var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
      overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
      var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
      var replacement = growMemory(newSize);
      if (replacement) {
        return true;
      }
    }
    return false;
  }, "_emscripten_resize_heap");
  _emscripten_resize_heap.sig = "ip";
  var _fd_close = /* @__PURE__ */ __name((fd) => 52, "_fd_close");
  _fd_close.sig = "ii";
  var INT53_MAX = 9007199254740992;
  var INT53_MIN = -9007199254740992;
  var bigintToI53Checked = /* @__PURE__ */ __name((num) => num < INT53_MIN || num > INT53_MAX ? NaN : Number(num), "bigintToI53Checked");
  function _fd_seek(fd, offset, whence, newOffset) {
    offset = bigintToI53Checked(offset);
    return 70;
  }
  __name(_fd_seek, "_fd_seek");
  _fd_seek.sig = "iijip";
  var printCharBuffers = [null, [], []];
  var printChar = /* @__PURE__ */ __name((stream, curr) => {
    var buffer = printCharBuffers[stream];
    if (curr === 0 || curr === 10) {
      (stream === 1 ? out : err)(UTF8ArrayToString(buffer));
      buffer.length = 0;
    } else {
      buffer.push(curr);
    }
  }, "printChar");
  var _fd_write = /* @__PURE__ */ __name((fd, iov, iovcnt, pnum) => {
    var num = 0;
    for (var i2 = 0; i2 < iovcnt; i2++) {
      var ptr = LE_HEAP_LOAD_U32((iov >> 2) * 4);
      var len = LE_HEAP_LOAD_U32((iov + 4 >> 2) * 4);
      iov += 8;
      for (var j = 0; j < len; j++) {
        printChar(fd, HEAPU8[ptr + j]);
      }
      num += len;
    }
    LE_HEAP_STORE_U32((pnum >> 2) * 4, num);
    return 0;
  }, "_fd_write");
  _fd_write.sig = "iippp";
  function _tree_sitter_log_callback(isLexMessage, messageAddress) {
    if (Module.currentLogCallback) {
      const message = UTF8ToString(messageAddress);
      Module.currentLogCallback(message, isLexMessage !== 0);
    }
  }
  __name(_tree_sitter_log_callback, "_tree_sitter_log_callback");
  function _tree_sitter_parse_callback(inputBufferAddress, index, row, column, lengthAddress) {
    const INPUT_BUFFER_SIZE = 10 * 1024;
    const string = Module.currentParseCallback(index, {
      row,
      column
    });
    if (typeof string === "string") {
      setValue(lengthAddress, string.length, "i32");
      stringToUTF16(string, inputBufferAddress, INPUT_BUFFER_SIZE);
    } else {
      setValue(lengthAddress, 0, "i32");
    }
  }
  __name(_tree_sitter_parse_callback, "_tree_sitter_parse_callback");
  function _tree_sitter_progress_callback(currentOffset, hasError) {
    if (Module.currentProgressCallback) {
      return Module.currentProgressCallback({
        currentOffset,
        hasError
      });
    }
    return false;
  }
  __name(_tree_sitter_progress_callback, "_tree_sitter_progress_callback");
  function _tree_sitter_query_progress_callback(currentOffset) {
    if (Module.currentQueryProgressCallback) {
      return Module.currentQueryProgressCallback({
        currentOffset
      });
    }
    return false;
  }
  __name(_tree_sitter_query_progress_callback, "_tree_sitter_query_progress_callback");
  var runtimeKeepaliveCounter = 0;
  var keepRuntimeAlive = /* @__PURE__ */ __name(() => noExitRuntime || runtimeKeepaliveCounter > 0, "keepRuntimeAlive");
  var _proc_exit = /* @__PURE__ */ __name((code) => {
    EXITSTATUS = code;
    if (!keepRuntimeAlive()) {
      Module["onExit"]?.(code);
      ABORT = true;
    }
    quit_(code, new ExitStatus(code));
  }, "_proc_exit");
  _proc_exit.sig = "vi";
  var exitJS = /* @__PURE__ */ __name((status, implicit) => {
    EXITSTATUS = status;
    _proc_exit(status);
  }, "exitJS");
  var handleException = /* @__PURE__ */ __name((e) => {
    if (e instanceof ExitStatus || e == "unwind") {
      return EXITSTATUS;
    }
    quit_(1, e);
  }, "handleException");
  var lengthBytesUTF8 = /* @__PURE__ */ __name((str) => {
    var len = 0;
    for (var i2 = 0; i2 < str.length; ++i2) {
      var c = str.charCodeAt(i2);
      if (c <= 127) {
        len++;
      } else if (c <= 2047) {
        len += 2;
      } else if (c >= 55296 && c <= 57343) {
        len += 4;
        ++i2;
      } else {
        len += 3;
      }
    }
    return len;
  }, "lengthBytesUTF8");
  var stringToUTF8Array = /* @__PURE__ */ __name((str, heap, outIdx, maxBytesToWrite) => {
    if (!(maxBytesToWrite > 0)) return 0;
    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i2 = 0; i2 < str.length; ++i2) {
      var u = str.codePointAt(i2);
      if (u <= 127) {
        if (outIdx >= endIdx) break;
        heap[outIdx++] = u;
      } else if (u <= 2047) {
        if (outIdx + 1 >= endIdx) break;
        heap[outIdx++] = 192 | u >> 6;
        heap[outIdx++] = 128 | u & 63;
      } else if (u <= 65535) {
        if (outIdx + 2 >= endIdx) break;
        heap[outIdx++] = 224 | u >> 12;
        heap[outIdx++] = 128 | u >> 6 & 63;
        heap[outIdx++] = 128 | u & 63;
      } else {
        if (outIdx + 3 >= endIdx) break;
        heap[outIdx++] = 240 | u >> 18;
        heap[outIdx++] = 128 | u >> 12 & 63;
        heap[outIdx++] = 128 | u >> 6 & 63;
        heap[outIdx++] = 128 | u & 63;
        i2++;
      }
    }
    heap[outIdx] = 0;
    return outIdx - startIdx;
  }, "stringToUTF8Array");
  var stringToUTF8 = /* @__PURE__ */ __name((str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite), "stringToUTF8");
  var stackAlloc = /* @__PURE__ */ __name((sz) => __emscripten_stack_alloc(sz), "stackAlloc");
  var stringToUTF8OnStack = /* @__PURE__ */ __name((str) => {
    var size = lengthBytesUTF8(str) + 1;
    var ret = stackAlloc(size);
    stringToUTF8(str, ret, size);
    return ret;
  }, "stringToUTF8OnStack");
  var AsciiToString = /* @__PURE__ */ __name((ptr) => {
    var str = "";
    while (1) {
      var ch = HEAPU8[ptr++];
      if (!ch) return str;
      str += String.fromCharCode(ch);
    }
  }, "AsciiToString");
  var stringToUTF16 = /* @__PURE__ */ __name((str, outPtr, maxBytesToWrite) => {
    maxBytesToWrite ??= 2147483647;
    if (maxBytesToWrite < 2) return 0;
    maxBytesToWrite -= 2;
    var startPtr = outPtr;
    var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
    for (var i2 = 0; i2 < numCharsToWrite; ++i2) {
      var codeUnit = str.charCodeAt(i2);
      LE_HEAP_STORE_I16((outPtr >> 1) * 2, codeUnit);
      outPtr += 2;
    }
    LE_HEAP_STORE_I16((outPtr >> 1) * 2, 0);
    return outPtr - startPtr;
  }, "stringToUTF16");
  LE_ATOMICS_NATIVE_BYTE_ORDER = new Int8Array(new Int16Array([1]).buffer)[0] === 1 ? [
    /* little endian */
    ((x) => x),
    ((x) => x),
    void 0,
    ((x) => x)
  ] : [
    /* big endian */
    ((x) => x),
    ((x) => ((x & 65280) << 8 | (x & 255) << 24) >> 16),
    void 0,
    ((x) => x >> 24 & 255 | x >> 8 & 65280 | (x & 65280) << 8 | (x & 255) << 24)
  ];
  function LE_HEAP_UPDATE() {
    HEAPU16.unsigned = ((x) => x & 65535);
    HEAPU32.unsigned = ((x) => x >>> 0);
  }
  __name(LE_HEAP_UPDATE, "LE_HEAP_UPDATE");
  {
    initMemory();
    if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
    if (Module["print"]) out = Module["print"];
    if (Module["printErr"]) err = Module["printErr"];
    if (Module["dynamicLibraries"]) dynamicLibraries = Module["dynamicLibraries"];
    if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
    if (Module["arguments"]) arguments_ = Module["arguments"];
    if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
    if (Module["preInit"]) {
      if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
      while (Module["preInit"].length > 0) {
        Module["preInit"].shift()();
      }
    }
  }
  Module["setValue"] = setValue;
  Module["getValue"] = getValue;
  Module["UTF8ToString"] = UTF8ToString;
  Module["stringToUTF8"] = stringToUTF8;
  Module["lengthBytesUTF8"] = lengthBytesUTF8;
  Module["AsciiToString"] = AsciiToString;
  Module["stringToUTF16"] = stringToUTF16;
  Module["loadWebAssemblyModule"] = loadWebAssemblyModule;
  Module["LE_HEAP_STORE_I64"] = LE_HEAP_STORE_I64;
  var ASM_CONSTS = {};
  var _malloc, _calloc, _realloc, _free, _ts_range_edit, _memcmp, _ts_language_symbol_count, _ts_language_state_count, _ts_language_abi_version, _ts_language_name, _ts_language_field_count, _ts_language_next_state, _ts_language_symbol_name, _ts_language_symbol_for_name, _strncmp, _ts_language_symbol_type, _ts_language_field_name_for_id, _ts_lookahead_iterator_new, _ts_lookahead_iterator_delete, _ts_lookahead_iterator_reset_state, _ts_lookahead_iterator_reset, _ts_lookahead_iterator_next, _ts_lookahead_iterator_current_symbol, _ts_point_edit, _ts_parser_delete, _ts_parser_reset, _ts_parser_set_language, _ts_parser_set_included_ranges, _ts_query_new, _ts_query_delete, _iswspace, _iswalnum, _ts_query_copy, _ts_query_pattern_count, _ts_query_capture_count, _ts_query_string_count, _ts_query_capture_name_for_id, _ts_query_capture_quantifier_for_id, _ts_query_string_value_for_id, _ts_query_predicates_for_pattern, _ts_query_start_byte_for_pattern, _ts_query_end_byte_for_pattern, _ts_query_is_pattern_rooted, _ts_query_is_pattern_non_local, _ts_query_is_pattern_guaranteed_at_step, _ts_query_disable_capture, _ts_query_disable_pattern, _ts_tree_copy, _ts_tree_delete, _ts_init, _ts_parser_new_wasm, _ts_parser_enable_logger_wasm, _ts_parser_parse_wasm, _ts_parser_included_ranges_wasm, _ts_language_type_is_named_wasm, _ts_language_type_is_visible_wasm, _ts_language_metadata_wasm, _ts_language_supertypes_wasm, _ts_language_subtypes_wasm, _ts_tree_root_node_wasm, _ts_tree_root_node_with_offset_wasm, _ts_tree_edit_wasm, _ts_tree_included_ranges_wasm, _ts_tree_get_changed_ranges_wasm, _ts_tree_cursor_new_wasm, _ts_tree_cursor_copy_wasm, _ts_tree_cursor_delete_wasm, _ts_tree_cursor_reset_wasm, _ts_tree_cursor_reset_to_wasm, _ts_tree_cursor_goto_first_child_wasm, _ts_tree_cursor_goto_last_child_wasm, _ts_tree_cursor_goto_first_child_for_index_wasm, _ts_tree_cursor_goto_first_child_for_position_wasm, _ts_tree_cursor_goto_next_sibling_wasm, _ts_tree_cursor_goto_previous_sibling_wasm, _ts_tree_cursor_goto_descendant_wasm, _ts_tree_cursor_goto_parent_wasm, _ts_tree_cursor_current_node_type_id_wasm, _ts_tree_cursor_current_node_state_id_wasm, _ts_tree_cursor_current_node_is_named_wasm, _ts_tree_cursor_current_node_is_missing_wasm, _ts_tree_cursor_current_node_id_wasm, _ts_tree_cursor_start_position_wasm, _ts_tree_cursor_end_position_wasm, _ts_tree_cursor_start_index_wasm, _ts_tree_cursor_end_index_wasm, _ts_tree_cursor_current_field_id_wasm, _ts_tree_cursor_current_depth_wasm, _ts_tree_cursor_current_descendant_index_wasm, _ts_tree_cursor_current_node_wasm, _ts_node_symbol_wasm, _ts_node_field_name_for_child_wasm, _ts_node_field_name_for_named_child_wasm, _ts_node_children_by_field_id_wasm, _ts_node_first_child_for_byte_wasm, _ts_node_first_named_child_for_byte_wasm, _ts_node_grammar_symbol_wasm, _ts_node_child_count_wasm, _ts_node_named_child_count_wasm, _ts_node_child_wasm, _ts_node_named_child_wasm, _ts_node_child_by_field_id_wasm, _ts_node_next_sibling_wasm, _ts_node_prev_sibling_wasm, _ts_node_next_named_sibling_wasm, _ts_node_prev_named_sibling_wasm, _ts_node_descendant_count_wasm, _ts_node_parent_wasm, _ts_node_child_with_descendant_wasm, _ts_node_descendant_for_index_wasm, _ts_node_named_descendant_for_index_wasm, _ts_node_descendant_for_position_wasm, _ts_node_named_descendant_for_position_wasm, _ts_node_start_point_wasm, _ts_node_end_point_wasm, _ts_node_start_index_wasm, _ts_node_end_index_wasm, _ts_node_to_string_wasm, _ts_node_children_wasm, _ts_node_named_children_wasm, _ts_node_descendants_of_type_wasm, _ts_node_is_named_wasm, _ts_node_has_changes_wasm, _ts_node_has_error_wasm, _ts_node_is_error_wasm, _ts_node_is_missing_wasm, _ts_node_is_extra_wasm, _ts_node_parse_state_wasm, _ts_node_next_parse_state_wasm, _ts_query_matches_wasm, _ts_query_captures_wasm, _memset, _memcpy, _memmove, _iswalpha, _iswblank, _iswdigit, _iswlower, _iswpunct, _iswupper, _iswxdigit, _memchr, _strlen, _strcmp, _strncat, _strncpy, _towlower, _towupper, _setThrew, __emscripten_stack_restore, __emscripten_stack_alloc, _emscripten_stack_get_current, ___wasm_apply_data_relocs;
  function assignWasmExports(wasmExports2) {
    Module["_malloc"] = _malloc = wasmExports2["malloc"];
    Module["_calloc"] = _calloc = wasmExports2["calloc"];
    Module["_realloc"] = _realloc = wasmExports2["realloc"];
    Module["_free"] = _free = wasmExports2["free"];
    Module["_ts_range_edit"] = _ts_range_edit = wasmExports2["ts_range_edit"];
    Module["_memcmp"] = _memcmp = wasmExports2["memcmp"];
    Module["_ts_language_symbol_count"] = _ts_language_symbol_count = wasmExports2["ts_language_symbol_count"];
    Module["_ts_language_state_count"] = _ts_language_state_count = wasmExports2["ts_language_state_count"];
    Module["_ts_language_abi_version"] = _ts_language_abi_version = wasmExports2["ts_language_abi_version"];
    Module["_ts_language_name"] = _ts_language_name = wasmExports2["ts_language_name"];
    Module["_ts_language_field_count"] = _ts_language_field_count = wasmExports2["ts_language_field_count"];
    Module["_ts_language_next_state"] = _ts_language_next_state = wasmExports2["ts_language_next_state"];
    Module["_ts_language_symbol_name"] = _ts_language_symbol_name = wasmExports2["ts_language_symbol_name"];
    Module["_ts_language_symbol_for_name"] = _ts_language_symbol_for_name = wasmExports2["ts_language_symbol_for_name"];
    Module["_strncmp"] = _strncmp = wasmExports2["strncmp"];
    Module["_ts_language_symbol_type"] = _ts_language_symbol_type = wasmExports2["ts_language_symbol_type"];
    Module["_ts_language_field_name_for_id"] = _ts_language_field_name_for_id = wasmExports2["ts_language_field_name_for_id"];
    Module["_ts_lookahead_iterator_new"] = _ts_lookahead_iterator_new = wasmExports2["ts_lookahead_iterator_new"];
    Module["_ts_lookahead_iterator_delete"] = _ts_lookahead_iterator_delete = wasmExports2["ts_lookahead_iterator_delete"];
    Module["_ts_lookahead_iterator_reset_state"] = _ts_lookahead_iterator_reset_state = wasmExports2["ts_lookahead_iterator_reset_state"];
    Module["_ts_lookahead_iterator_reset"] = _ts_lookahead_iterator_reset = wasmExports2["ts_lookahead_iterator_reset"];
    Module["_ts_lookahead_iterator_next"] = _ts_lookahead_iterator_next = wasmExports2["ts_lookahead_iterator_next"];
    Module["_ts_lookahead_iterator_current_symbol"] = _ts_lookahead_iterator_current_symbol = wasmExports2["ts_lookahead_iterator_current_symbol"];
    Module["_ts_point_edit"] = _ts_point_edit = wasmExports2["ts_point_edit"];
    Module["_ts_parser_delete"] = _ts_parser_delete = wasmExports2["ts_parser_delete"];
    Module["_ts_parser_reset"] = _ts_parser_reset = wasmExports2["ts_parser_reset"];
    Module["_ts_parser_set_language"] = _ts_parser_set_language = wasmExports2["ts_parser_set_language"];
    Module["_ts_parser_set_included_ranges"] = _ts_parser_set_included_ranges = wasmExports2["ts_parser_set_included_ranges"];
    Module["_ts_query_new"] = _ts_query_new = wasmExports2["ts_query_new"];
    Module["_ts_query_delete"] = _ts_query_delete = wasmExports2["ts_query_delete"];
    Module["_iswspace"] = _iswspace = wasmExports2["iswspace"];
    Module["_iswalnum"] = _iswalnum = wasmExports2["iswalnum"];
    Module["_ts_query_copy"] = _ts_query_copy = wasmExports2["ts_query_copy"];
    Module["_ts_query_pattern_count"] = _ts_query_pattern_count = wasmExports2["ts_query_pattern_count"];
    Module["_ts_query_capture_count"] = _ts_query_capture_count = wasmExports2["ts_query_capture_count"];
    Module["_ts_query_string_count"] = _ts_query_string_count = wasmExports2["ts_query_string_count"];
    Module["_ts_query_capture_name_for_id"] = _ts_query_capture_name_for_id = wasmExports2["ts_query_capture_name_for_id"];
    Module["_ts_query_capture_quantifier_for_id"] = _ts_query_capture_quantifier_for_id = wasmExports2["ts_query_capture_quantifier_for_id"];
    Module["_ts_query_string_value_for_id"] = _ts_query_string_value_for_id = wasmExports2["ts_query_string_value_for_id"];
    Module["_ts_query_predicates_for_pattern"] = _ts_query_predicates_for_pattern = wasmExports2["ts_query_predicates_for_pattern"];
    Module["_ts_query_start_byte_for_pattern"] = _ts_query_start_byte_for_pattern = wasmExports2["ts_query_start_byte_for_pattern"];
    Module["_ts_query_end_byte_for_pattern"] = _ts_query_end_byte_for_pattern = wasmExports2["ts_query_end_byte_for_pattern"];
    Module["_ts_query_is_pattern_rooted"] = _ts_query_is_pattern_rooted = wasmExports2["ts_query_is_pattern_rooted"];
    Module["_ts_query_is_pattern_non_local"] = _ts_query_is_pattern_non_local = wasmExports2["ts_query_is_pattern_non_local"];
    Module["_ts_query_is_pattern_guaranteed_at_step"] = _ts_query_is_pattern_guaranteed_at_step = wasmExports2["ts_query_is_pattern_guaranteed_at_step"];
    Module["_ts_query_disable_capture"] = _ts_query_disable_capture = wasmExports2["ts_query_disable_capture"];
    Module["_ts_query_disable_pattern"] = _ts_query_disable_pattern = wasmExports2["ts_query_disable_pattern"];
    Module["_ts_tree_copy"] = _ts_tree_copy = wasmExports2["ts_tree_copy"];
    Module["_ts_tree_delete"] = _ts_tree_delete = wasmExports2["ts_tree_delete"];
    Module["_ts_init"] = _ts_init = wasmExports2["ts_init"];
    Module["_ts_parser_new_wasm"] = _ts_parser_new_wasm = wasmExports2["ts_parser_new_wasm"];
    Module["_ts_parser_enable_logger_wasm"] = _ts_parser_enable_logger_wasm = wasmExports2["ts_parser_enable_logger_wasm"];
    Module["_ts_parser_parse_wasm"] = _ts_parser_parse_wasm = wasmExports2["ts_parser_parse_wasm"];
    Module["_ts_parser_included_ranges_wasm"] = _ts_parser_included_ranges_wasm = wasmExports2["ts_parser_included_ranges_wasm"];
    Module["_ts_language_type_is_named_wasm"] = _ts_language_type_is_named_wasm = wasmExports2["ts_language_type_is_named_wasm"];
    Module["_ts_language_type_is_visible_wasm"] = _ts_language_type_is_visible_wasm = wasmExports2["ts_language_type_is_visible_wasm"];
    Module["_ts_language_metadata_wasm"] = _ts_language_metadata_wasm = wasmExports2["ts_language_metadata_wasm"];
    Module["_ts_language_supertypes_wasm"] = _ts_language_supertypes_wasm = wasmExports2["ts_language_supertypes_wasm"];
    Module["_ts_language_subtypes_wasm"] = _ts_language_subtypes_wasm = wasmExports2["ts_language_subtypes_wasm"];
    Module["_ts_tree_root_node_wasm"] = _ts_tree_root_node_wasm = wasmExports2["ts_tree_root_node_wasm"];
    Module["_ts_tree_root_node_with_offset_wasm"] = _ts_tree_root_node_with_offset_wasm = wasmExports2["ts_tree_root_node_with_offset_wasm"];
    Module["_ts_tree_edit_wasm"] = _ts_tree_edit_wasm = wasmExports2["ts_tree_edit_wasm"];
    Module["_ts_tree_included_ranges_wasm"] = _ts_tree_included_ranges_wasm = wasmExports2["ts_tree_included_ranges_wasm"];
    Module["_ts_tree_get_changed_ranges_wasm"] = _ts_tree_get_changed_ranges_wasm = wasmExports2["ts_tree_get_changed_ranges_wasm"];
    Module["_ts_tree_cursor_new_wasm"] = _ts_tree_cursor_new_wasm = wasmExports2["ts_tree_cursor_new_wasm"];
    Module["_ts_tree_cursor_copy_wasm"] = _ts_tree_cursor_copy_wasm = wasmExports2["ts_tree_cursor_copy_wasm"];
    Module["_ts_tree_cursor_delete_wasm"] = _ts_tree_cursor_delete_wasm = wasmExports2["ts_tree_cursor_delete_wasm"];
    Module["_ts_tree_cursor_reset_wasm"] = _ts_tree_cursor_reset_wasm = wasmExports2["ts_tree_cursor_reset_wasm"];
    Module["_ts_tree_cursor_reset_to_wasm"] = _ts_tree_cursor_reset_to_wasm = wasmExports2["ts_tree_cursor_reset_to_wasm"];
    Module["_ts_tree_cursor_goto_first_child_wasm"] = _ts_tree_cursor_goto_first_child_wasm = wasmExports2["ts_tree_cursor_goto_first_child_wasm"];
    Module["_ts_tree_cursor_goto_last_child_wasm"] = _ts_tree_cursor_goto_last_child_wasm = wasmExports2["ts_tree_cursor_goto_last_child_wasm"];
    Module["_ts_tree_cursor_goto_first_child_for_index_wasm"] = _ts_tree_cursor_goto_first_child_for_index_wasm = wasmExports2["ts_tree_cursor_goto_first_child_for_index_wasm"];
    Module["_ts_tree_cursor_goto_first_child_for_position_wasm"] = _ts_tree_cursor_goto_first_child_for_position_wasm = wasmExports2["ts_tree_cursor_goto_first_child_for_position_wasm"];
    Module["_ts_tree_cursor_goto_next_sibling_wasm"] = _ts_tree_cursor_goto_next_sibling_wasm = wasmExports2["ts_tree_cursor_goto_next_sibling_wasm"];
    Module["_ts_tree_cursor_goto_previous_sibling_wasm"] = _ts_tree_cursor_goto_previous_sibling_wasm = wasmExports2["ts_tree_cursor_goto_previous_sibling_wasm"];
    Module["_ts_tree_cursor_goto_descendant_wasm"] = _ts_tree_cursor_goto_descendant_wasm = wasmExports2["ts_tree_cursor_goto_descendant_wasm"];
    Module["_ts_tree_cursor_goto_parent_wasm"] = _ts_tree_cursor_goto_parent_wasm = wasmExports2["ts_tree_cursor_goto_parent_wasm"];
    Module["_ts_tree_cursor_current_node_type_id_wasm"] = _ts_tree_cursor_current_node_type_id_wasm = wasmExports2["ts_tree_cursor_current_node_type_id_wasm"];
    Module["_ts_tree_cursor_current_node_state_id_wasm"] = _ts_tree_cursor_current_node_state_id_wasm = wasmExports2["ts_tree_cursor_current_node_state_id_wasm"];
    Module["_ts_tree_cursor_current_node_is_named_wasm"] = _ts_tree_cursor_current_node_is_named_wasm = wasmExports2["ts_tree_cursor_current_node_is_named_wasm"];
    Module["_ts_tree_cursor_current_node_is_missing_wasm"] = _ts_tree_cursor_current_node_is_missing_wasm = wasmExports2["ts_tree_cursor_current_node_is_missing_wasm"];
    Module["_ts_tree_cursor_current_node_id_wasm"] = _ts_tree_cursor_current_node_id_wasm = wasmExports2["ts_tree_cursor_current_node_id_wasm"];
    Module["_ts_tree_cursor_start_position_wasm"] = _ts_tree_cursor_start_position_wasm = wasmExports2["ts_tree_cursor_start_position_wasm"];
    Module["_ts_tree_cursor_end_position_wasm"] = _ts_tree_cursor_end_position_wasm = wasmExports2["ts_tree_cursor_end_position_wasm"];
    Module["_ts_tree_cursor_start_index_wasm"] = _ts_tree_cursor_start_index_wasm = wasmExports2["ts_tree_cursor_start_index_wasm"];
    Module["_ts_tree_cursor_end_index_wasm"] = _ts_tree_cursor_end_index_wasm = wasmExports2["ts_tree_cursor_end_index_wasm"];
    Module["_ts_tree_cursor_current_field_id_wasm"] = _ts_tree_cursor_current_field_id_wasm = wasmExports2["ts_tree_cursor_current_field_id_wasm"];
    Module["_ts_tree_cursor_current_depth_wasm"] = _ts_tree_cursor_current_depth_wasm = wasmExports2["ts_tree_cursor_current_depth_wasm"];
    Module["_ts_tree_cursor_current_descendant_index_wasm"] = _ts_tree_cursor_current_descendant_index_wasm = wasmExports2["ts_tree_cursor_current_descendant_index_wasm"];
    Module["_ts_tree_cursor_current_node_wasm"] = _ts_tree_cursor_current_node_wasm = wasmExports2["ts_tree_cursor_current_node_wasm"];
    Module["_ts_node_symbol_wasm"] = _ts_node_symbol_wasm = wasmExports2["ts_node_symbol_wasm"];
    Module["_ts_node_field_name_for_child_wasm"] = _ts_node_field_name_for_child_wasm = wasmExports2["ts_node_field_name_for_child_wasm"];
    Module["_ts_node_field_name_for_named_child_wasm"] = _ts_node_field_name_for_named_child_wasm = wasmExports2["ts_node_field_name_for_named_child_wasm"];
    Module["_ts_node_children_by_field_id_wasm"] = _ts_node_children_by_field_id_wasm = wasmExports2["ts_node_children_by_field_id_wasm"];
    Module["_ts_node_first_child_for_byte_wasm"] = _ts_node_first_child_for_byte_wasm = wasmExports2["ts_node_first_child_for_byte_wasm"];
    Module["_ts_node_first_named_child_for_byte_wasm"] = _ts_node_first_named_child_for_byte_wasm = wasmExports2["ts_node_first_named_child_for_byte_wasm"];
    Module["_ts_node_grammar_symbol_wasm"] = _ts_node_grammar_symbol_wasm = wasmExports2["ts_node_grammar_symbol_wasm"];
    Module["_ts_node_child_count_wasm"] = _ts_node_child_count_wasm = wasmExports2["ts_node_child_count_wasm"];
    Module["_ts_node_named_child_count_wasm"] = _ts_node_named_child_count_wasm = wasmExports2["ts_node_named_child_count_wasm"];
    Module["_ts_node_child_wasm"] = _ts_node_child_wasm = wasmExports2["ts_node_child_wasm"];
    Module["_ts_node_named_child_wasm"] = _ts_node_named_child_wasm = wasmExports2["ts_node_named_child_wasm"];
    Module["_ts_node_child_by_field_id_wasm"] = _ts_node_child_by_field_id_wasm = wasmExports2["ts_node_child_by_field_id_wasm"];
    Module["_ts_node_next_sibling_wasm"] = _ts_node_next_sibling_wasm = wasmExports2["ts_node_next_sibling_wasm"];
    Module["_ts_node_prev_sibling_wasm"] = _ts_node_prev_sibling_wasm = wasmExports2["ts_node_prev_sibling_wasm"];
    Module["_ts_node_next_named_sibling_wasm"] = _ts_node_next_named_sibling_wasm = wasmExports2["ts_node_next_named_sibling_wasm"];
    Module["_ts_node_prev_named_sibling_wasm"] = _ts_node_prev_named_sibling_wasm = wasmExports2["ts_node_prev_named_sibling_wasm"];
    Module["_ts_node_descendant_count_wasm"] = _ts_node_descendant_count_wasm = wasmExports2["ts_node_descendant_count_wasm"];
    Module["_ts_node_parent_wasm"] = _ts_node_parent_wasm = wasmExports2["ts_node_parent_wasm"];
    Module["_ts_node_child_with_descendant_wasm"] = _ts_node_child_with_descendant_wasm = wasmExports2["ts_node_child_with_descendant_wasm"];
    Module["_ts_node_descendant_for_index_wasm"] = _ts_node_descendant_for_index_wasm = wasmExports2["ts_node_descendant_for_index_wasm"];
    Module["_ts_node_named_descendant_for_index_wasm"] = _ts_node_named_descendant_for_index_wasm = wasmExports2["ts_node_named_descendant_for_index_wasm"];
    Module["_ts_node_descendant_for_position_wasm"] = _ts_node_descendant_for_position_wasm = wasmExports2["ts_node_descendant_for_position_wasm"];
    Module["_ts_node_named_descendant_for_position_wasm"] = _ts_node_named_descendant_for_position_wasm = wasmExports2["ts_node_named_descendant_for_position_wasm"];
    Module["_ts_node_start_point_wasm"] = _ts_node_start_point_wasm = wasmExports2["ts_node_start_point_wasm"];
    Module["_ts_node_end_point_wasm"] = _ts_node_end_point_wasm = wasmExports2["ts_node_end_point_wasm"];
    Module["_ts_node_start_index_wasm"] = _ts_node_start_index_wasm = wasmExports2["ts_node_start_index_wasm"];
    Module["_ts_node_end_index_wasm"] = _ts_node_end_index_wasm = wasmExports2["ts_node_end_index_wasm"];
    Module["_ts_node_to_string_wasm"] = _ts_node_to_string_wasm = wasmExports2["ts_node_to_string_wasm"];
    Module["_ts_node_children_wasm"] = _ts_node_children_wasm = wasmExports2["ts_node_children_wasm"];
    Module["_ts_node_named_children_wasm"] = _ts_node_named_children_wasm = wasmExports2["ts_node_named_children_wasm"];
    Module["_ts_node_descendants_of_type_wasm"] = _ts_node_descendants_of_type_wasm = wasmExports2["ts_node_descendants_of_type_wasm"];
    Module["_ts_node_is_named_wasm"] = _ts_node_is_named_wasm = wasmExports2["ts_node_is_named_wasm"];
    Module["_ts_node_has_changes_wasm"] = _ts_node_has_changes_wasm = wasmExports2["ts_node_has_changes_wasm"];
    Module["_ts_node_has_error_wasm"] = _ts_node_has_error_wasm = wasmExports2["ts_node_has_error_wasm"];
    Module["_ts_node_is_error_wasm"] = _ts_node_is_error_wasm = wasmExports2["ts_node_is_error_wasm"];
    Module["_ts_node_is_missing_wasm"] = _ts_node_is_missing_wasm = wasmExports2["ts_node_is_missing_wasm"];
    Module["_ts_node_is_extra_wasm"] = _ts_node_is_extra_wasm = wasmExports2["ts_node_is_extra_wasm"];
    Module["_ts_node_parse_state_wasm"] = _ts_node_parse_state_wasm = wasmExports2["ts_node_parse_state_wasm"];
    Module["_ts_node_next_parse_state_wasm"] = _ts_node_next_parse_state_wasm = wasmExports2["ts_node_next_parse_state_wasm"];
    Module["_ts_query_matches_wasm"] = _ts_query_matches_wasm = wasmExports2["ts_query_matches_wasm"];
    Module["_ts_query_captures_wasm"] = _ts_query_captures_wasm = wasmExports2["ts_query_captures_wasm"];
    Module["_memset"] = _memset = wasmExports2["memset"];
    Module["_memcpy"] = _memcpy = wasmExports2["memcpy"];
    Module["_memmove"] = _memmove = wasmExports2["memmove"];
    Module["_iswalpha"] = _iswalpha = wasmExports2["iswalpha"];
    Module["_iswblank"] = _iswblank = wasmExports2["iswblank"];
    Module["_iswdigit"] = _iswdigit = wasmExports2["iswdigit"];
    Module["_iswlower"] = _iswlower = wasmExports2["iswlower"];
    Module["_iswpunct"] = _iswpunct = wasmExports2["iswpunct"];
    Module["_iswupper"] = _iswupper = wasmExports2["iswupper"];
    Module["_iswxdigit"] = _iswxdigit = wasmExports2["iswxdigit"];
    Module["_memchr"] = _memchr = wasmExports2["memchr"];
    Module["_strlen"] = _strlen = wasmExports2["strlen"];
    Module["_strcmp"] = _strcmp = wasmExports2["strcmp"];
    Module["_strncat"] = _strncat = wasmExports2["strncat"];
    Module["_strncpy"] = _strncpy = wasmExports2["strncpy"];
    Module["_towlower"] = _towlower = wasmExports2["towlower"];
    Module["_towupper"] = _towupper = wasmExports2["towupper"];
    _setThrew = wasmExports2["setThrew"];
    __emscripten_stack_restore = wasmExports2["_emscripten_stack_restore"];
    __emscripten_stack_alloc = wasmExports2["_emscripten_stack_alloc"];
    _emscripten_stack_get_current = wasmExports2["emscripten_stack_get_current"];
    ___wasm_apply_data_relocs = wasmExports2["__wasm_apply_data_relocs"];
  }
  __name(assignWasmExports, "assignWasmExports");
  var wasmImports = {
    /** @export */
    __heap_base: ___heap_base,
    /** @export */
    __indirect_function_table: wasmTable,
    /** @export */
    __memory_base: ___memory_base,
    /** @export */
    __stack_high: ___stack_high,
    /** @export */
    __stack_low: ___stack_low,
    /** @export */
    __stack_pointer: ___stack_pointer,
    /** @export */
    __table_base: ___table_base,
    /** @export */
    _abort_js: __abort_js,
    /** @export */
    emscripten_resize_heap: _emscripten_resize_heap,
    /** @export */
    fd_close: _fd_close,
    /** @export */
    fd_seek: _fd_seek,
    /** @export */
    fd_write: _fd_write,
    /** @export */
    memory: wasmMemory,
    /** @export */
    tree_sitter_log_callback: _tree_sitter_log_callback,
    /** @export */
    tree_sitter_parse_callback: _tree_sitter_parse_callback,
    /** @export */
    tree_sitter_progress_callback: _tree_sitter_progress_callback,
    /** @export */
    tree_sitter_query_progress_callback: _tree_sitter_query_progress_callback
  };
  function callMain(args2 = []) {
    var entryFunction = resolveGlobalSymbol("main").sym;
    if (!entryFunction) return;
    args2.unshift(thisProgram);
    var argc = args2.length;
    var argv = stackAlloc((argc + 1) * 4);
    var argv_ptr = argv;
    args2.forEach((arg) => {
      LE_HEAP_STORE_U32((argv_ptr >> 2) * 4, stringToUTF8OnStack(arg));
      argv_ptr += 4;
    });
    LE_HEAP_STORE_U32((argv_ptr >> 2) * 4, 0);
    try {
      var ret = entryFunction(argc, argv);
      exitJS(
        ret,
        /* implicit = */
        true
      );
      return ret;
    } catch (e) {
      return handleException(e);
    }
  }
  __name(callMain, "callMain");
  function run(args2 = arguments_) {
    if (runDependencies > 0) {
      dependenciesFulfilled = run;
      return;
    }
    preRun();
    if (runDependencies > 0) {
      dependenciesFulfilled = run;
      return;
    }
    function doRun() {
      Module["calledRun"] = true;
      if (ABORT) return;
      initRuntime();
      preMain();
      readyPromiseResolve?.(Module);
      Module["onRuntimeInitialized"]?.();
      var noInitialRun = Module["noInitialRun"] || false;
      if (!noInitialRun) callMain(args2);
      postRun();
    }
    __name(doRun, "doRun");
    if (Module["setStatus"]) {
      Module["setStatus"]("Running...");
      setTimeout(() => {
        setTimeout(() => Module["setStatus"](""), 1);
        doRun();
      }, 1);
    } else {
      doRun();
    }
  }
  __name(run, "run");
  var wasmExports;
  wasmExports = await createWasm();
  run();
  if (runtimeInitialized) {
    moduleRtn = Module;
  } else {
    moduleRtn = new Promise((resolve9, reject) => {
      readyPromiseResolve = resolve9;
      readyPromiseReject = reject;
    });
  }
  return moduleRtn;
}
__name(Module2, "Module");
var web_tree_sitter_default = Module2;
var Module3 = null;
async function initializeBinding(moduleOptions) {
  return Module3 ??= await web_tree_sitter_default(moduleOptions);
}
__name(initializeBinding, "initializeBinding");
function checkModule() {
  return !!Module3;
}
__name(checkModule, "checkModule");
var TRANSFER_BUFFER;
var LANGUAGE_VERSION;
var MIN_COMPATIBLE_VERSION;
var finalizer4 = newFinalizer((addresses) => {
  C._ts_parser_delete(addresses[0]);
  C._free(addresses[1]);
});
var Parser = class {
  static {
    __name(this, "Parser");
  }
  /** @internal */
  [0] = 0;
  // Internal handle for Wasm
  /** @internal */
  [1] = 0;
  // Internal handle for Wasm
  /** @internal */
  logCallback = null;
  /** The parser's current language. */
  language = null;
  /**
   * This must always be called before creating a Parser.
   *
   * You can optionally pass in options to configure the Wasm module, the most common
   * one being `locateFile` to help the module find the `.wasm` file.
   */
  static async init(moduleOptions) {
    setModule(await initializeBinding(moduleOptions));
    TRANSFER_BUFFER = C._ts_init();
    LANGUAGE_VERSION = C.getValue(TRANSFER_BUFFER, "i32");
    MIN_COMPATIBLE_VERSION = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
  }
  /**
   * Create a new parser.
   */
  constructor() {
    this.initialize();
    finalizer4?.register(this, [this[0], this[1]], this);
  }
  /** @internal */
  initialize() {
    if (!checkModule()) {
      throw new Error("cannot construct a Parser before calling `init()`");
    }
    C._ts_parser_new_wasm();
    this[0] = C.getValue(TRANSFER_BUFFER, "i32");
    this[1] = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
  }
  /** Delete the parser, freeing its resources. */
  delete() {
    finalizer4?.unregister(this);
    C._ts_parser_delete(this[0]);
    C._free(this[1]);
    this[0] = 0;
    this[1] = 0;
  }
  /**
   * Set the language that the parser should use for parsing.
   *
   * If the language was not successfully assigned, an error will be thrown.
   * This happens if the language was generated with an incompatible
   * version of the Tree-sitter CLI. Check the language's version using
   * {@link Language#version} and compare it to this library's
   * {@link LANGUAGE_VERSION} and {@link MIN_COMPATIBLE_VERSION} constants.
   */
  setLanguage(language) {
    let address;
    if (!language) {
      address = 0;
      this.language = null;
    } else if (language.constructor === Language) {
      address = language[0];
      const version = C._ts_language_abi_version(address);
      if (version < MIN_COMPATIBLE_VERSION || LANGUAGE_VERSION < version) {
        throw new Error(
          `Incompatible language version ${version}. Compatibility range ${MIN_COMPATIBLE_VERSION} through ${LANGUAGE_VERSION}.`
        );
      }
      this.language = language;
    } else {
      throw new Error("Argument must be a Language");
    }
    C._ts_parser_set_language(this[0], address);
    return this;
  }
  /**
   * Parse a slice of UTF8 text.
   *
   * @param {string | ParseCallback} callback - The UTF8-encoded text to parse or a callback function.
   *
   * @param {Tree | null} [oldTree] - A previous syntax tree parsed from the same document. If the text of the
   *   document has changed since `oldTree` was created, then you must edit `oldTree` to match
   *   the new text using {@link Tree#edit}.
   *
   * @param {ParseOptions} [options] - Options for parsing the text.
   *  This can be used to set the included ranges, or a progress callback.
   *
   * @returns {Tree | null} A {@link Tree} if parsing succeeded, or `null` if:
   *  - The parser has not yet had a language assigned with {@link Parser#setLanguage}.
   *  - The progress callback returned true.
   */
  parse(callback, oldTree, options) {
    if (typeof callback === "string") {
      C.currentParseCallback = (index) => callback.slice(index);
    } else if (typeof callback === "function") {
      C.currentParseCallback = callback;
    } else {
      throw new Error("Argument must be a string or a function");
    }
    if (options?.progressCallback) {
      C.currentProgressCallback = options.progressCallback;
    } else {
      C.currentProgressCallback = null;
    }
    if (this.logCallback) {
      C.currentLogCallback = this.logCallback;
      C._ts_parser_enable_logger_wasm(this[0], 1);
    } else {
      C.currentLogCallback = null;
      C._ts_parser_enable_logger_wasm(this[0], 0);
    }
    let rangeCount = 0;
    let rangeAddress = 0;
    if (options?.includedRanges) {
      rangeCount = options.includedRanges.length;
      rangeAddress = C._calloc(rangeCount, SIZE_OF_RANGE);
      let address = rangeAddress;
      for (let i2 = 0; i2 < rangeCount; i2++) {
        marshalRange(address, options.includedRanges[i2]);
        address += SIZE_OF_RANGE;
      }
    }
    const treeAddress = C._ts_parser_parse_wasm(
      this[0],
      this[1],
      oldTree ? oldTree[0] : 0,
      rangeAddress,
      rangeCount
    );
    if (!treeAddress) {
      C.currentParseCallback = null;
      C.currentLogCallback = null;
      C.currentProgressCallback = null;
      return null;
    }
    if (!this.language) {
      throw new Error("Parser must have a language to parse");
    }
    const result = new Tree(INTERNAL, treeAddress, this.language, C.currentParseCallback);
    C.currentParseCallback = null;
    C.currentLogCallback = null;
    C.currentProgressCallback = null;
    return result;
  }
  /**
   * Instruct the parser to start the next parse from the beginning.
   *
   * If the parser previously failed because of a callback, 
   * then by default, it will resume where it left off on the
   * next call to {@link Parser#parse} or other parsing functions.
   * If you don't want to resume, and instead intend to use this parser to
   * parse some other document, you must call `reset` first.
   */
  reset() {
    C._ts_parser_reset(this[0]);
  }
  /** Get the ranges of text that the parser will include when parsing. */
  getIncludedRanges() {
    C._ts_parser_included_ranges_wasm(this[0]);
    const count4 = C.getValue(TRANSFER_BUFFER, "i32");
    const buffer = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
    const result = new Array(count4);
    if (count4 > 0) {
      let address = buffer;
      for (let i2 = 0; i2 < count4; i2++) {
        result[i2] = unmarshalRange(address);
        address += SIZE_OF_RANGE;
      }
      C._free(buffer);
    }
    return result;
  }
  /** Set the logging callback that a parser should use during parsing. */
  setLogger(callback) {
    if (!callback) {
      this.logCallback = null;
    } else if (typeof callback !== "function") {
      throw new Error("Logger callback must be a function");
    } else {
      this.logCallback = callback;
    }
    return this;
  }
  /** Get the parser's current logger. */
  getLogger() {
    return this.logCallback;
  }
};
var PREDICATE_STEP_TYPE_CAPTURE = 1;
var PREDICATE_STEP_TYPE_STRING = 2;
var QUERY_WORD_REGEX = /[\w-]+/g;
var CaptureQuantifier = {
  Zero: 0,
  ZeroOrOne: 1,
  ZeroOrMore: 2,
  One: 3,
  OneOrMore: 4
};
var isCaptureStep = /* @__PURE__ */ __name((step) => step.type === "capture", "isCaptureStep");
var isStringStep = /* @__PURE__ */ __name((step) => step.type === "string", "isStringStep");
var QueryErrorKind = {
  Syntax: 1,
  NodeName: 2,
  FieldName: 3,
  CaptureName: 4,
  PatternStructure: 5
};
var QueryError = class _QueryError extends Error {
  constructor(kind, info2, index, length) {
    super(_QueryError.formatMessage(kind, info2));
    this.kind = kind;
    this.info = info2;
    this.index = index;
    this.length = length;
    this.name = "QueryError";
  }
  kind;
  info;
  index;
  length;
  static {
    __name(this, "QueryError");
  }
  /** Formats an error message based on the error kind and info */
  static formatMessage(kind, info2) {
    switch (kind) {
      case QueryErrorKind.NodeName:
        return `Bad node name '${info2.word}'`;
      case QueryErrorKind.FieldName:
        return `Bad field name '${info2.word}'`;
      case QueryErrorKind.CaptureName:
        return `Bad capture name @${info2.word}`;
      case QueryErrorKind.PatternStructure:
        return `Bad pattern structure at offset ${info2.suffix}`;
      case QueryErrorKind.Syntax:
        return `Bad syntax at offset ${info2.suffix}`;
    }
  }
};
function parseAnyPredicate(steps, index, operator, textPredicates) {
  if (steps.length !== 3) {
    throw new Error(
      `Wrong number of arguments to \`#${operator}\` predicate. Expected 2, got ${steps.length - 1}`
    );
  }
  if (!isCaptureStep(steps[1])) {
    throw new Error(
      `First argument of \`#${operator}\` predicate must be a capture. Got "${steps[1].value}"`
    );
  }
  const isPositive = operator === "eq?" || operator === "any-eq?";
  const matchAll = !operator.startsWith("any-");
  if (isCaptureStep(steps[2])) {
    const captureName1 = steps[1].name;
    const captureName2 = steps[2].name;
    textPredicates[index].push((captures) => {
      const nodes1 = [];
      const nodes2 = [];
      for (const c of captures) {
        if (c.name === captureName1) nodes1.push(c.node);
        if (c.name === captureName2) nodes2.push(c.node);
      }
      const compare = /* @__PURE__ */ __name((n1, n2, positive) => {
        return positive ? n1.text === n2.text : n1.text !== n2.text;
      }, "compare");
      return matchAll ? nodes1.every((n1) => nodes2.some((n2) => compare(n1, n2, isPositive))) : nodes1.some((n1) => nodes2.some((n2) => compare(n1, n2, isPositive)));
    });
  } else {
    const captureName = steps[1].name;
    const stringValue2 = steps[2].value;
    const matches = /* @__PURE__ */ __name((n) => n.text === stringValue2, "matches");
    const doesNotMatch = /* @__PURE__ */ __name((n) => n.text !== stringValue2, "doesNotMatch");
    textPredicates[index].push((captures) => {
      const nodes = [];
      for (const c of captures) {
        if (c.name === captureName) nodes.push(c.node);
      }
      const test = isPositive ? matches : doesNotMatch;
      return matchAll ? nodes.every(test) : nodes.some(test);
    });
  }
}
__name(parseAnyPredicate, "parseAnyPredicate");
function parseMatchPredicate(steps, index, operator, textPredicates) {
  if (steps.length !== 3) {
    throw new Error(
      `Wrong number of arguments to \`#${operator}\` predicate. Expected 2, got ${steps.length - 1}.`
    );
  }
  if (steps[1].type !== "capture") {
    throw new Error(
      `First argument of \`#${operator}\` predicate must be a capture. Got "${steps[1].value}".`
    );
  }
  if (steps[2].type !== "string") {
    throw new Error(
      `Second argument of \`#${operator}\` predicate must be a string. Got @${steps[2].name}.`
    );
  }
  const isPositive = operator === "match?" || operator === "any-match?";
  const matchAll = !operator.startsWith("any-");
  const captureName = steps[1].name;
  const regex2 = new RegExp(steps[2].value);
  textPredicates[index].push((captures) => {
    const nodes = [];
    for (const c of captures) {
      if (c.name === captureName) nodes.push(c.node.text);
    }
    const test = /* @__PURE__ */ __name((text, positive) => {
      return positive ? regex2.test(text) : !regex2.test(text);
    }, "test");
    if (nodes.length === 0) return !isPositive;
    return matchAll ? nodes.every((text) => test(text, isPositive)) : nodes.some((text) => test(text, isPositive));
  });
}
__name(parseMatchPredicate, "parseMatchPredicate");
function parseAnyOfPredicate(steps, index, operator, textPredicates) {
  if (steps.length < 2) {
    throw new Error(
      `Wrong number of arguments to \`#${operator}\` predicate. Expected at least 1. Got ${steps.length - 1}.`
    );
  }
  if (steps[1].type !== "capture") {
    throw new Error(
      `First argument of \`#${operator}\` predicate must be a capture. Got "${steps[1].value}".`
    );
  }
  const isPositive = operator === "any-of?";
  const captureName = steps[1].name;
  const stringSteps = steps.slice(2);
  if (!stringSteps.every(isStringStep)) {
    throw new Error(
      `Arguments to \`#${operator}\` predicate must be strings.".`
    );
  }
  const values = stringSteps.map((s) => s.value);
  textPredicates[index].push((captures) => {
    const nodes = [];
    for (const c of captures) {
      if (c.name === captureName) nodes.push(c.node.text);
    }
    if (nodes.length === 0) return !isPositive;
    return nodes.every((text) => values.includes(text)) === isPositive;
  });
}
__name(parseAnyOfPredicate, "parseAnyOfPredicate");
function parseIsPredicate(steps, index, operator, assertedProperties, refutedProperties) {
  if (steps.length < 2 || steps.length > 3) {
    throw new Error(
      `Wrong number of arguments to \`#${operator}\` predicate. Expected 1 or 2. Got ${steps.length - 1}.`
    );
  }
  if (!steps.every(isStringStep)) {
    throw new Error(
      `Arguments to \`#${operator}\` predicate must be strings.".`
    );
  }
  const properties = operator === "is?" ? assertedProperties : refutedProperties;
  if (!properties[index]) properties[index] = {};
  properties[index][steps[1].value] = steps[2]?.value ?? null;
}
__name(parseIsPredicate, "parseIsPredicate");
function parseSetDirective(steps, index, setProperties) {
  if (steps.length < 2 || steps.length > 3) {
    throw new Error(`Wrong number of arguments to \`#set!\` predicate. Expected 1 or 2. Got ${steps.length - 1}.`);
  }
  if (!steps.every(isStringStep)) {
    throw new Error(`Arguments to \`#set!\` predicate must be strings.".`);
  }
  if (!setProperties[index]) setProperties[index] = {};
  setProperties[index][steps[1].value] = steps[2]?.value ?? null;
}
__name(parseSetDirective, "parseSetDirective");
function parsePattern(index, stepType, stepValueId, captureNames, stringValues, steps, textPredicates, predicates, setProperties, assertedProperties, refutedProperties) {
  if (stepType === PREDICATE_STEP_TYPE_CAPTURE) {
    const name2 = captureNames[stepValueId];
    steps.push({ type: "capture", name: name2 });
  } else if (stepType === PREDICATE_STEP_TYPE_STRING) {
    steps.push({ type: "string", value: stringValues[stepValueId] });
  } else if (steps.length > 0) {
    if (steps[0].type !== "string") {
      throw new Error("Predicates must begin with a literal value");
    }
    const operator = steps[0].value;
    switch (operator) {
      case "any-not-eq?":
      case "not-eq?":
      case "any-eq?":
      case "eq?":
        parseAnyPredicate(steps, index, operator, textPredicates);
        break;
      case "any-not-match?":
      case "not-match?":
      case "any-match?":
      case "match?":
        parseMatchPredicate(steps, index, operator, textPredicates);
        break;
      case "not-any-of?":
      case "any-of?":
        parseAnyOfPredicate(steps, index, operator, textPredicates);
        break;
      case "is?":
      case "is-not?":
        parseIsPredicate(steps, index, operator, assertedProperties, refutedProperties);
        break;
      case "set!":
        parseSetDirective(steps, index, setProperties);
        break;
      default:
        predicates[index].push({ operator, operands: steps.slice(1) });
    }
    steps.length = 0;
  }
}
__name(parsePattern, "parsePattern");
var finalizer5 = newFinalizer((address) => {
  C._ts_query_delete(address);
});
var Query = class {
  static {
    __name(this, "Query");
  }
  /** @internal */
  [0] = 0;
  // Internal handle for Wasm
  /** @internal */
  exceededMatchLimit;
  /** @internal */
  textPredicates;
  /** The names of the captures used in the query. */
  captureNames;
  /** The quantifiers of the captures used in the query. */
  captureQuantifiers;
  /**
   * The other user-defined predicates associated with the given index.
   *
   * This includes predicates with operators other than:
   * - `match?`
   * - `eq?` and `not-eq?`
   * - `any-of?` and `not-any-of?`
   * - `is?` and `is-not?`
   * - `set!`
   */
  predicates;
  /** The properties for predicates with the operator `set!`. */
  setProperties;
  /** The properties for predicates with the operator `is?`. */
  assertedProperties;
  /** The properties for predicates with the operator `is-not?`. */
  refutedProperties;
  /** The maximum number of in-progress matches for this cursor. */
  matchLimit;
  /**
   * Create a new query from a string containing one or more S-expression
   * patterns.
   *
   * The query is associated with a particular language, and can only be run
   * on syntax nodes parsed with that language. References to Queries can be
   * shared between multiple threads.
   *
   * @link {@see https://tree-sitter.github.io/tree-sitter/using-parsers/queries}
   */
  constructor(language, source) {
    const sourceLength = C.lengthBytesUTF8(source);
    const sourceAddress = C._malloc(sourceLength + 1);
    C.stringToUTF8(source, sourceAddress, sourceLength + 1);
    const address = C._ts_query_new(
      language[0],
      sourceAddress,
      sourceLength,
      TRANSFER_BUFFER,
      TRANSFER_BUFFER + SIZE_OF_INT
    );
    if (!address) {
      const errorId = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
      const errorByte = C.getValue(TRANSFER_BUFFER, "i32");
      const errorIndex = C.UTF8ToString(sourceAddress, errorByte).length;
      const suffix = source.slice(errorIndex, errorIndex + 100).split("\n")[0];
      const word3 = suffix.match(QUERY_WORD_REGEX)?.[0] ?? "";
      C._free(sourceAddress);
      switch (errorId) {
        case QueryErrorKind.Syntax:
          throw new QueryError(QueryErrorKind.Syntax, { suffix: `${errorIndex}: '${suffix}'...` }, errorIndex, 0);
        case QueryErrorKind.NodeName:
          throw new QueryError(errorId, { word: word3 }, errorIndex, word3.length);
        case QueryErrorKind.FieldName:
          throw new QueryError(errorId, { word: word3 }, errorIndex, word3.length);
        case QueryErrorKind.CaptureName:
          throw new QueryError(errorId, { word: word3 }, errorIndex, word3.length);
        case QueryErrorKind.PatternStructure:
          throw new QueryError(errorId, { suffix: `${errorIndex}: '${suffix}'...` }, errorIndex, 0);
      }
    }
    const stringCount = C._ts_query_string_count(address);
    const captureCount = C._ts_query_capture_count(address);
    const patternCount = C._ts_query_pattern_count(address);
    const captureNames = new Array(captureCount);
    const captureQuantifiers = new Array(patternCount);
    const stringValues = new Array(stringCount);
    for (let i2 = 0; i2 < captureCount; i2++) {
      const nameAddress = C._ts_query_capture_name_for_id(
        address,
        i2,
        TRANSFER_BUFFER
      );
      const nameLength = C.getValue(TRANSFER_BUFFER, "i32");
      captureNames[i2] = C.UTF8ToString(nameAddress, nameLength);
    }
    for (let i2 = 0; i2 < patternCount; i2++) {
      const captureQuantifiersArray = new Array(captureCount);
      for (let j = 0; j < captureCount; j++) {
        const quantifier = C._ts_query_capture_quantifier_for_id(address, i2, j);
        captureQuantifiersArray[j] = quantifier;
      }
      captureQuantifiers[i2] = captureQuantifiersArray;
    }
    for (let i2 = 0; i2 < stringCount; i2++) {
      const valueAddress = C._ts_query_string_value_for_id(
        address,
        i2,
        TRANSFER_BUFFER
      );
      const nameLength = C.getValue(TRANSFER_BUFFER, "i32");
      stringValues[i2] = C.UTF8ToString(valueAddress, nameLength);
    }
    const setProperties = new Array(patternCount);
    const assertedProperties = new Array(patternCount);
    const refutedProperties = new Array(patternCount);
    const predicates = new Array(patternCount);
    const textPredicates = new Array(patternCount);
    for (let i2 = 0; i2 < patternCount; i2++) {
      const predicatesAddress = C._ts_query_predicates_for_pattern(address, i2, TRANSFER_BUFFER);
      const stepCount = C.getValue(TRANSFER_BUFFER, "i32");
      predicates[i2] = [];
      textPredicates[i2] = [];
      const steps = new Array();
      let stepAddress = predicatesAddress;
      for (let j = 0; j < stepCount; j++) {
        const stepType = C.getValue(stepAddress, "i32");
        stepAddress += SIZE_OF_INT;
        const stepValueId = C.getValue(stepAddress, "i32");
        stepAddress += SIZE_OF_INT;
        parsePattern(
          i2,
          stepType,
          stepValueId,
          captureNames,
          stringValues,
          steps,
          textPredicates,
          predicates,
          setProperties,
          assertedProperties,
          refutedProperties
        );
      }
      Object.freeze(textPredicates[i2]);
      Object.freeze(predicates[i2]);
      Object.freeze(setProperties[i2]);
      Object.freeze(assertedProperties[i2]);
      Object.freeze(refutedProperties[i2]);
    }
    C._free(sourceAddress);
    this[0] = address;
    this.captureNames = captureNames;
    this.captureQuantifiers = captureQuantifiers;
    this.textPredicates = textPredicates;
    this.predicates = predicates;
    this.setProperties = setProperties;
    this.assertedProperties = assertedProperties;
    this.refutedProperties = refutedProperties;
    this.exceededMatchLimit = false;
    finalizer5?.register(this, address, this);
  }
  /** Delete the query, freeing its resources. */
  delete() {
    finalizer5?.unregister(this);
    C._ts_query_delete(this[0]);
    this[0] = 0;
  }
  /**
   * Iterate over all of the matches in the order that they were found.
   *
   * Each match contains the index of the pattern that matched, and a list of
   * captures. Because multiple patterns can match the same set of nodes,
   * one match may contain captures that appear *before* some of the
   * captures from a previous match.
   *
   * @param {Node} node - The node to execute the query on.
   *
   * @param {QueryOptions} options - Options for query execution.
   */
  matches(node, options = {}) {
    const startPosition = options.startPosition ?? ZERO_POINT;
    const endPosition = options.endPosition ?? ZERO_POINT;
    const startIndex = options.startIndex ?? 0;
    const endIndex = options.endIndex ?? 0;
    const startContainingPosition = options.startContainingPosition ?? ZERO_POINT;
    const endContainingPosition = options.endContainingPosition ?? ZERO_POINT;
    const startContainingIndex = options.startContainingIndex ?? 0;
    const endContainingIndex = options.endContainingIndex ?? 0;
    const matchLimit = options.matchLimit ?? 4294967295;
    const maxStartDepth = options.maxStartDepth ?? 4294967295;
    const progressCallback = options.progressCallback;
    if (typeof matchLimit !== "number") {
      throw new Error("Arguments must be numbers");
    }
    this.matchLimit = matchLimit;
    if (endIndex !== 0 && startIndex > endIndex) {
      throw new Error("`startIndex` cannot be greater than `endIndex`");
    }
    if (endPosition !== ZERO_POINT && (startPosition.row > endPosition.row || startPosition.row === endPosition.row && startPosition.column > endPosition.column)) {
      throw new Error("`startPosition` cannot be greater than `endPosition`");
    }
    if (endContainingIndex !== 0 && startContainingIndex > endContainingIndex) {
      throw new Error("`startContainingIndex` cannot be greater than `endContainingIndex`");
    }
    if (endContainingPosition !== ZERO_POINT && (startContainingPosition.row > endContainingPosition.row || startContainingPosition.row === endContainingPosition.row && startContainingPosition.column > endContainingPosition.column)) {
      throw new Error("`startContainingPosition` cannot be greater than `endContainingPosition`");
    }
    if (progressCallback) {
      C.currentQueryProgressCallback = progressCallback;
    }
    marshalNode(node);
    C._ts_query_matches_wasm(
      this[0],
      node.tree[0],
      startPosition.row,
      startPosition.column,
      endPosition.row,
      endPosition.column,
      startIndex,
      endIndex,
      startContainingPosition.row,
      startContainingPosition.column,
      endContainingPosition.row,
      endContainingPosition.column,
      startContainingIndex,
      endContainingIndex,
      matchLimit,
      maxStartDepth
    );
    const rawCount = C.getValue(TRANSFER_BUFFER, "i32");
    const startAddress = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
    const didExceedMatchLimit = C.getValue(TRANSFER_BUFFER + 2 * SIZE_OF_INT, "i32");
    const result = new Array(rawCount);
    this.exceededMatchLimit = Boolean(didExceedMatchLimit);
    let filteredCount = 0;
    let address = startAddress;
    for (let i2 = 0; i2 < rawCount; i2++) {
      const patternIndex = C.getValue(address, "i32");
      address += SIZE_OF_INT;
      const captureCount = C.getValue(address, "i32");
      address += SIZE_OF_INT;
      const captures = new Array(captureCount);
      address = unmarshalCaptures(this, node.tree, address, patternIndex, captures);
      if (this.textPredicates[patternIndex].every((p) => p(captures))) {
        result[filteredCount] = { patternIndex, captures };
        const setProperties = this.setProperties[patternIndex];
        result[filteredCount].setProperties = setProperties;
        const assertedProperties = this.assertedProperties[patternIndex];
        result[filteredCount].assertedProperties = assertedProperties;
        const refutedProperties = this.refutedProperties[patternIndex];
        result[filteredCount].refutedProperties = refutedProperties;
        filteredCount++;
      }
    }
    result.length = filteredCount;
    C._free(startAddress);
    C.currentQueryProgressCallback = null;
    return result;
  }
  /**
   * Iterate over all of the individual captures in the order that they
   * appear.
   *
   * This is useful if you don't care about which pattern matched, and just
   * want a single, ordered sequence of captures.
   *
   * @param {Node} node - The node to execute the query on.
   *
   * @param {QueryOptions} options - Options for query execution.
   */
  captures(node, options = {}) {
    const startPosition = options.startPosition ?? ZERO_POINT;
    const endPosition = options.endPosition ?? ZERO_POINT;
    const startIndex = options.startIndex ?? 0;
    const endIndex = options.endIndex ?? 0;
    const startContainingPosition = options.startContainingPosition ?? ZERO_POINT;
    const endContainingPosition = options.endContainingPosition ?? ZERO_POINT;
    const startContainingIndex = options.startContainingIndex ?? 0;
    const endContainingIndex = options.endContainingIndex ?? 0;
    const matchLimit = options.matchLimit ?? 4294967295;
    const maxStartDepth = options.maxStartDepth ?? 4294967295;
    const progressCallback = options.progressCallback;
    if (typeof matchLimit !== "number") {
      throw new Error("Arguments must be numbers");
    }
    this.matchLimit = matchLimit;
    if (endIndex !== 0 && startIndex > endIndex) {
      throw new Error("`startIndex` cannot be greater than `endIndex`");
    }
    if (endPosition !== ZERO_POINT && (startPosition.row > endPosition.row || startPosition.row === endPosition.row && startPosition.column > endPosition.column)) {
      throw new Error("`startPosition` cannot be greater than `endPosition`");
    }
    if (endContainingIndex !== 0 && startContainingIndex > endContainingIndex) {
      throw new Error("`startContainingIndex` cannot be greater than `endContainingIndex`");
    }
    if (endContainingPosition !== ZERO_POINT && (startContainingPosition.row > endContainingPosition.row || startContainingPosition.row === endContainingPosition.row && startContainingPosition.column > endContainingPosition.column)) {
      throw new Error("`startContainingPosition` cannot be greater than `endContainingPosition`");
    }
    if (progressCallback) {
      C.currentQueryProgressCallback = progressCallback;
    }
    marshalNode(node);
    C._ts_query_captures_wasm(
      this[0],
      node.tree[0],
      startPosition.row,
      startPosition.column,
      endPosition.row,
      endPosition.column,
      startIndex,
      endIndex,
      startContainingPosition.row,
      startContainingPosition.column,
      endContainingPosition.row,
      endContainingPosition.column,
      startContainingIndex,
      endContainingIndex,
      matchLimit,
      maxStartDepth
    );
    const count4 = C.getValue(TRANSFER_BUFFER, "i32");
    const startAddress = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
    const didExceedMatchLimit = C.getValue(TRANSFER_BUFFER + 2 * SIZE_OF_INT, "i32");
    const result = new Array();
    this.exceededMatchLimit = Boolean(didExceedMatchLimit);
    const captures = new Array();
    let address = startAddress;
    for (let i2 = 0; i2 < count4; i2++) {
      const patternIndex = C.getValue(address, "i32");
      address += SIZE_OF_INT;
      const captureCount = C.getValue(address, "i32");
      address += SIZE_OF_INT;
      const captureIndex = C.getValue(address, "i32");
      address += SIZE_OF_INT;
      captures.length = captureCount;
      address = unmarshalCaptures(this, node.tree, address, patternIndex, captures);
      if (this.textPredicates[patternIndex].every((p) => p(captures))) {
        const capture = captures[captureIndex];
        const setProperties = this.setProperties[patternIndex];
        capture.setProperties = setProperties;
        const assertedProperties = this.assertedProperties[patternIndex];
        capture.assertedProperties = assertedProperties;
        const refutedProperties = this.refutedProperties[patternIndex];
        capture.refutedProperties = refutedProperties;
        result.push(capture);
      }
    }
    C._free(startAddress);
    C.currentQueryProgressCallback = null;
    return result;
  }
  /** Get the predicates for a given pattern. */
  predicatesForPattern(patternIndex) {
    return this.predicates[patternIndex];
  }
  /**
   * Disable a certain capture within a query.
   *
   * This prevents the capture from being returned in matches, and also
   * avoids any resource usage associated with recording the capture.
   */
  disableCapture(captureName) {
    const captureNameLength = C.lengthBytesUTF8(captureName);
    const captureNameAddress = C._malloc(captureNameLength + 1);
    C.stringToUTF8(captureName, captureNameAddress, captureNameLength + 1);
    C._ts_query_disable_capture(this[0], captureNameAddress, captureNameLength);
    C._free(captureNameAddress);
  }
  /**
   * Disable a certain pattern within a query.
   *
   * This prevents the pattern from matching, and also avoids any resource
   * usage associated with the pattern. This throws an error if the pattern
   * index is out of bounds.
   */
  disablePattern(patternIndex) {
    if (patternIndex >= this.predicates.length) {
      throw new Error(
        `Pattern index is ${patternIndex} but the pattern count is ${this.predicates.length}`
      );
    }
    C._ts_query_disable_pattern(this[0], patternIndex);
  }
  /**
   * Check if, on its last execution, this cursor exceeded its maximum number
   * of in-progress matches.
   */
  didExceedMatchLimit() {
    return this.exceededMatchLimit;
  }
  /** Get the byte offset where the given pattern starts in the query's source. */
  startIndexForPattern(patternIndex) {
    if (patternIndex >= this.predicates.length) {
      throw new Error(
        `Pattern index is ${patternIndex} but the pattern count is ${this.predicates.length}`
      );
    }
    return C._ts_query_start_byte_for_pattern(this[0], patternIndex);
  }
  /** Get the byte offset where the given pattern ends in the query's source. */
  endIndexForPattern(patternIndex) {
    if (patternIndex >= this.predicates.length) {
      throw new Error(
        `Pattern index is ${patternIndex} but the pattern count is ${this.predicates.length}`
      );
    }
    return C._ts_query_end_byte_for_pattern(this[0], patternIndex);
  }
  /** Get the number of patterns in the query. */
  patternCount() {
    return C._ts_query_pattern_count(this[0]);
  }
  /** Get the index for a given capture name. */
  captureIndexForName(captureName) {
    return this.captureNames.indexOf(captureName);
  }
  /** Check if a given pattern within a query has a single root node. */
  isPatternRooted(patternIndex) {
    return C._ts_query_is_pattern_rooted(this[0], patternIndex) === 1;
  }
  /** Check if a given pattern within a query has a single root node. */
  isPatternNonLocal(patternIndex) {
    return C._ts_query_is_pattern_non_local(this[0], patternIndex) === 1;
  }
  /**
   * Check if a given step in a query is 'definite'.
   *
   * A query step is 'definite' if its parent pattern will be guaranteed to
   * match successfully once it reaches the step.
   */
  isPatternGuaranteedAtStep(byteIndex) {
    return C._ts_query_is_pattern_guaranteed_at_step(this[0], byteIndex) === 1;
  }
};

// src/languages/syntax.ts
var FILES = {
  runtime: ["web-tree-sitter", "web-tree-sitter.wasm"],
  // TSX parses JavaScript, JSX and TypeScript alike.
  js: ["tree-sitter-typescript", "tree-sitter-tsx.wasm"],
  python: ["tree-sitter-python", "tree-sitter-python.wasm"],
  java: ["tree-sitter-java", "tree-sitter-java.wasm"]
};
function wasmPath(key) {
  const [pkg, file] = FILES[key];
  const bundled = join(dirname(fileURLToPath(import.meta.url)), file);
  if (existsSync(bundled)) return bundled;
  return createRequire(import.meta.url).resolve(`${pkg}/${file}`);
}
var parsers = null;
var loading = null;
function initSyntax() {
  loading ??= (async () => {
    await Parser.init({ locateFile: () => wasmPath("runtime") });
    const loaded = {};
    for (const language of ["js", "python", "java"]) {
      const parser = new Parser();
      parser.setLanguage(await Language.load(wasmPath(language)));
      loaded[language] = parser;
    }
    parsers = loaded;
  })();
  return loading;
}
function parse(language, source) {
  if (!parsers) throw new Error("initSyntax() must run before parsing");
  const tree = parsers[language].parse(source);
  if (!tree) throw new Error(`could not parse ${language} source`);
  return tree;
}
await initSyntax();

// src/languages/index.ts
var SPECS = { js, python, java };
function isAssertionLine(language, line) {
  return new RegExp(SPECS[language].assertions.source).test(line);
}
function toLf(source) {
  return source.replace(/\r\n?/g, "\n");
}
function analyzeSource(path, source, language) {
  const spec = SPECS[language];
  const lf = toLf(source);
  const code = spec.strip(lf);
  const skips = typeof spec.skips === "function" ? spec.skips(code) : spec.skips;
  const tree = parse(language, code);
  let counts;
  let checks4 = [];
  try {
    counts = spec.count(tree.rootNode);
    checks4 = valueChecks(spec, tree.rootNode, code, lf, language);
  } finally {
    tree.delete();
  }
  const matches = findMatches(code, skips);
  if (spec.treeSkips) {
    const raw = parse(language, lf);
    try {
      const lines = new Set(matches.map((m) => m.line));
      for (const match of spec.treeSkips(raw.rootNode, path)) {
        if (!lines.has(match.line)) matches.push(match);
        lines.add(match.line);
      }
    } finally {
      raw.delete();
    }
    matches.sort((a, b) => a.line - b.line);
  }
  return {
    stats: {
      path: normalizePath(path),
      language,
      tests: counts.tests,
      assertions: counts.assertions,
      skips: matches.length
    },
    lines: code.split("\n"),
    skips: matches,
    swallowed: counts.swallowed,
    unreachable: counts.unreachable,
    deadTests: counts.deadTests,
    checks: checks4
  };
}
function valueChecks(spec, stripped, code, lf, language) {
  const text = (n) => lf.slice(n.startIndex, n.endIndex).replace(/\s+/g, "").replace(/,(?=[)\]}])/g, "");
  const toValue = ({ node, sides, equal }) => ({
    start: node.startPosition.row + 1,
    end: node.endPosition.row + 1,
    sides: [text(sides[0]), text(sides[1])],
    equal
  });
  if (code.length === lf.length) return spec.checks(stripped).map(toValue);
  const raw = parse(language, lf);
  try {
    return spec.checks(raw.rootNode).filter(({ sides }) => sides.every((s) => !/comment/.test(s.type))).map(toValue);
  } finally {
    raw.delete();
  }
}
function findMatches(code, pattern) {
  const matches = [];
  let line = 1;
  let pos = 0;
  for (const match of code.matchAll(pattern)) {
    for (; pos < match.index; pos++) if (code[pos] === "\n") line++;
    matches.push({
      line,
      text: match[0].replace(/\s*(?:\?\.\s*)?\($/, "").replace(/\s+/g, " ").trim()
    });
  }
  return matches;
}

// src/rules/declarations.ts
var DECLARATION = {
  js: /^\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]*)?=(?![=>])/,
  python: /^\s*((?:self\.)?[A-Za-z_]\w*)\s*(?::[^=]*)?=(?!=)/,
  java: /^\s*(?:(?:public|private|protected|static|final)\s+)*[\w$.<>[\], ?]*[\w$>\]]\s+([A-Za-z_$][\w$]*)\s*=(?!=)/
};
function statementEnd(stripped, i2) {
  let depth = 0;
  for (let j = i2; j < stripped.length; j++) {
    for (const ch of stripped[j] ?? "") {
      if ("([{".includes(ch)) depth++;
      else if (")]}".includes(ch)) depth--;
    }
    if (depth <= 0) return j;
  }
  return i2;
}
function declarations(stripped, source, language) {
  const found = [];
  let depth = 0;
  for (let i2 = 0; i2 < stripped.length; i2++) {
    const line = stripped[i2] ?? "";
    const at = depth;
    for (const ch of line) {
      if ("([".includes(ch)) depth++;
      else if (")]".includes(ch)) depth--;
    }
    const name2 = DECLARATION[language].exec(line)?.[1];
    if (!name2 || language === "python" && at > 0) continue;
    const last = statementEnd(stripped, i2);
    const end = name2.startsWith("self.") ? classEnd(stripped, i2) : scopeEnd(stripped, i2, language);
    found.push({
      name: name2,
      start: i2 + 1,
      end: last + 1,
      scopeEnd: end + 1,
      mutated: assigns(name2).test(stripped.slice(last + 1, end + 1).join("\n")),
      value: source.slice(i2, last + 1).join("\n").replace(/^[^=]*=/, "").replace(/;\s*$/, "").trim()
    });
  }
  return found;
}
function scopeEnd(stripped, i2, language) {
  if (language === "python") {
    const indent2 = (line) => line.length - line.trimStart().length;
    const own = indent2(stripped[i2] ?? "");
    for (let j = i2 + 1; j < stripped.length; j++) {
      const line = stripped[j] ?? "";
      if (line.trim() !== "" && indent2(line) < own) return j - 1;
    }
    return stripped.length - 1;
  }
  let depth = 0;
  for (let j = i2; j < stripped.length; j++) {
    for (const ch of stripped[j] ?? "") {
      if (ch === "{") depth++;
      else if (ch === "}" && --depth < 0) return j;
    }
  }
  return stripped.length - 1;
}
function classEnd(stripped, i2) {
  const indent2 = (line) => line.length - line.trimStart().length;
  let limit = indent2(stripped[i2] ?? "");
  for (let k = i2 - 1; k >= 0; k--) {
    const line = stripped[k] ?? "";
    if (line.trim() === "" || indent2(line) >= limit) continue;
    limit = indent2(line);
    if (/^\s*class\s/.test(line)) break;
  }
  for (let j = i2 + 1; j < stripped.length; j++) {
    const line = stripped[j] ?? "";
    if (line.trim() !== "" && indent2(line) <= limit) return j - 1;
  }
  return stripped.length - 1;
}
function assigns(name2) {
  const n = name2.replace(/[$.]/g, "\\$&");
  return new RegExp(
    `(?<![\\w$.])${n}\\s*(?:[-+*/%&|^]|\\*\\*|<<|>>>?|\\?\\?|&&|\\|\\|)?=(?![=>])|(?:\\+\\+|--)\\s*${n}(?![\\w$])|(?<![\\w$.])${n}\\s*(?:\\+\\+|--)`
  );
}
function valueAt(list2) {
  return (name2, line) => {
    const visible = list2.filter((d) => d.name === name2 && line <= d.scopeEnd);
    const above = visible.filter((d) => d.end < line).at(-1);
    const found = above ?? (visible.length === 1 ? visible[0] : void 0);
    return found?.mutated ? void 0 : found?.value;
  };
}

// src/rules/tg007.ts
var LOOSE = String.raw`\bexpect\.(?:anything|any|objectContaining|arrayContaining)\s*\(`;
var TOLERANCE = String.raw`\bapprox\s*\((?:[^(),[\]{}]|\([^()]*\)|\[[^\]]*\]|\{[^}]*\})*,`;
var SUBJECT = String.raw`(?<![\w$])(?:assertThat|(?:assertWithMessage|assertAbout)\s*\(.*?\)\s*\.that|expect\s*\.\s*that)\s*\(`;
var HAMCREST2 = String.raw`(?:(?:Matchers|CoreMatchers)\.)?`;
var SPECS2 = {
  js: {
    strong: [
      {
        re: new RegExp(
          String.raw`(?<!\.not)\.(?:toBe|toEqual|toStrictEqual|toHaveLength)\s*\((?!.*${LOOSE})`
        ),
        group: "value"
      },
      // chai (`expect(x).to.deep.equal(y)`, `.that.equals(y)`, never under
      // `.not`), node:assert / chai `assert` (also `t.assert`, `chai.assert`),
      // and a plain assert of an equality (`assert(a === 3)`).
      {
        re: /^(?!.*\.not\b)(?=.*\bexpect\s*\().*\.(?:equal|equals|eq|eql|eqls)\s*\(/,
        group: "value",
        label: "expect(x).to.equal(y)"
      },
      {
        re: /(?<![\w$])(?:[\w$]+\.)?assert\.(?:equal|strictEqual|deepEqual|deepStrictEqual)\s*\(/,
        group: "value"
      },
      {
        re: /(?<![\w$])(?:[\w$]+\.)?assert(?:\.(?:ok|isOk|isTrue))?\s*\((?=.*[^!=<>]==)/,
        group: "value",
        label: "assert(x === y)"
      },
      { re: /\.toThrow\s*\(\s*[^\s)]/, group: "throw", label: "toThrow(X)" }
    ],
    weak: [
      {
        re: /\.(?:toBeDefined|toBeTruthy|not\.toBeNull|not\.toBeUndefined)\s*\(/,
        group: "value"
      },
      {
        re: /\.to(?:\.[\w$]+)*\.(?:ok|exist)\b|^(?=.*\bexpect\s*\().*\.not(?:\.[\w$]+)*\.(?:equal|equals|eq|eql|eqls|null|undefined|empty)\b|(?<![\w$])(?:[\w$]+\.)?assert(?:\.(?:ok|isOk|exists|isNotNull|isDefined|isNotUndefined|isNotEmpty|notEqual|notStrictEqual|notDeepEqual|notDeepStrictEqual))?\s*\((?!.*[^!=<>]==)/,
        group: "value"
      },
      {
        re: /\.to(?:\.[\w$]+)*\.(?:above|below|least|most|gt|gte|lt|lte|greaterThan|greaterThanOrEqual|lessThan|lessThanOrEqual|include|includes|contain|contains|string|property(?!\s*\([^,()]*,)|a|an|instanceof|instanceOf|closeTo|approximately|within|match|members|keys|oneOf|satisfy|satisfies)\b|(?<![\w$])(?:[\w$]+\.)?assert\.(?:include|deepInclude|nestedInclude|isAbove|isBelow|isAtLeast|isAtMost|closeTo|approximately|match|typeOf|instanceOf|property|hasAnyKeys|hasAllKeys|containsAllKeys|isArray|isString|isNumber|isObject|oneOf|sameMembers|includeMembers|partialDeepStrictEqual)\s*\(/,
        group: "value",
        pairOnly: true
      },
      // jest-extended.
      {
        re: /\.(?:toBeNumber|toBeString|toBeArray|toBeObject|toBeBoolean|toBeDate|toBeFunction|toIncludeAllMembers|toIncludeAnyMembers|toIncludeSameMembers|toContainKey|toContainKeys|toContainEntry|toSatisfy|toBeOneOf|toBeWithin|toStartWith|toEndWith|toInclude)\s*\(/,
        group: "value",
        pairOnly: true
      },
      // Part of the value (`toMatchObject`, `expect.objectContaining`, also
      // nested), any value of a type (`expect.any(Number)`), a property, a
      // member, an approximation, or whatever a snapshot records.
      {
        re: new RegExp(
          String.raw`\.(?:toBe|toEqual|toStrictEqual)\s*\(.*${LOOSE}`
        ),
        group: "value",
        label: "expect.anything() / any() / objectContaining()",
        pairOnly: true
      },
      {
        re: /\.(?:toMatchObject|toHaveProperty|toContain|toContainEqual|toBeInstanceOf|toMatchSnapshot|toMatchInlineSnapshot)\s*\(/,
        group: "value",
        pairOnly: true
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
      /(?<![\w$.])assert(?:\.ok)?\s*\(\s*true\s*[,)]/
    ]
  },
  python: {
    strong: [
      { re: /(?<![\w.])self\.assertEquals?\s*\(/, group: "value" },
      {
        re: new RegExp(
          String.raw`(?<![\w.])assert(?=[\s(])(?!.*${TOLERANCE}).*==`
        ),
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
      // A tolerance given to an exact comparison, a member or a type in
      // place of the value.
      {
        re: new RegExp(
          String.raw`(?<![\w.])assert(?=[\s(])(?=.*==).*${TOLERANCE}`
        ),
        group: "value",
        label: "assert x == pytest.approx(y, tolerance)",
        pairOnly: true
      },
      {
        re: /(?<![\w.])self\.assertAlmostEquals?\s*\(.*\b(?:delta|places)\s*=/,
        group: "value",
        label: "assertAlmostEqual(\u2026, delta/places=\u2026)",
        pairOnly: true
      },
      {
        re: /(?<![\w.])self\.(?:assertIn|assertIsInstance|assertDictContainsSubset)\s*\(/,
        group: "value",
        pairOnly: true
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
      /(?<![\w.])self\.assertTrue\s*\(\s*True\s*[,)]/
    ]
  },
  java: {
    strong: [
      { re: /(?<![\w$])assertEquals\s*\(/, group: "value" },
      // AssertJ / Truth (a method on the subject, not `Matchers.contains`;
      // not with fields or order ignored) and Hamcrest (`is(y)`, but not
      // `is(<another matcher>)` other than `equalTo`).
      {
        re: new RegExp(
          String.raw`^(?!.*\.ignoring\w*\s*\().*?${SUBJECT}.*\)\s*\.(?:isEqualTo|isSameAs|containsExactly|containsExactlyInAnyOrder|hasSize|isEqualByComparingTo)\s*\(`
        ),
        group: "value",
        label: "assertThat(x).isEqualTo(y)"
      },
      {
        re: new RegExp(
          String.raw`${SUBJECT}.*,\s*${HAMCREST2}(?:equalTo|is|contains|containsInAnyOrder|hasSize|arrayContaining)\s*\((?!\s*${HAMCREST2}(?!equalTo\b)[a-z]\w*\s*\()`
        ),
        group: "value",
        label: "assertThat(x, is(y))"
      },
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
        re: new RegExp(
          String.raw`${SUBJECT}.*(?:\)\s*\.(?:isNotNull|isNotEqualTo|isNotEmpty|isNotBlank|isNotSameAs)\s*\(|,\s*(?:is\s*\(\s*)?${HAMCREST2}(?:notNullValue|not)\s*\()`
        ),
        group: "value",
        label: "assertThat(x).isNotNull()"
      },
      {
        re: /(?<![\w$])assertInstanceOf\s*\(/,
        group: "value",
        pairOnly: true
      },
      {
        re: new RegExp(
          String.raw`${SUBJECT}.*(?:\)\s*\.(?:contains|containsAll|containsAnyOf|containsOnly|containsSubsequence|containsSequence|hasSameElementsAs|isSubsetOf|containsKey|containsKeys|containsEntry|hasFieldOrProperty|hasFieldOrPropertyWithValue|isInstanceOf|isCloseTo|isBetween|startsWith|endsWith|isIn|hasSizeGreaterThan(?:OrEqualTo)?|hasSizeLessThan(?:OrEqualTo)?|hasSizeBetween|matches|satisfies|isPositive|isNegative|isNotZero|isNotNegative|isNotPositive|isGreaterThan|isGreaterThanOrEqualTo|isLessThan|isLessThanOrEqualTo|isEqualToIgnoringCase|isEqualToIgnoringWhitespace|isEqualToNormalizingWhitespace|containsIgnoringCase|isPresent|ignoring\w*)\s*\(|,\s*(?:is\s*\(\s*)?${HAMCREST2}(?:instanceOf|isA|oneOf|anyOf|either|greaterThan|lessThan|greaterThanOrEqualTo|lessThanOrEqualTo|closeTo|hasItems?|everyItem|containsString|containsStringIgnoringCase|equalToIgnoringCase|equalToIgnoringWhiteSpace|startsWith|endsWith|anything|hasKey|hasEntry|hasProperty|hasToString|emptyString|empty|any)\s*\()`
        ),
        group: "value",
        label: "assertThat(x).contains(\u2026) / isCloseTo(\u2026) / isPositive()",
        pairOnly: true
      },
      {
        re: /(?<![\w$])assertThrows\s*\(\s*(?:java\.lang\.)?(?:Exception|Throwable)\.class/,
        group: "throw",
        label: "assertThrows(Exception.class)"
      }
    ],
    trivial: [
      /(?<![\w$])assertTrue\s*\((?:\s*"(?:\\.|[^"\\])*"\s*,)?\s*true\s*[,)]/,
      /(?<![\w$])assertFalse\s*\((?:\s*"(?:\\.|[^"\\])*"\s*,)?\s*false\s*[,)]/
    ]
  }
};
var SPANS = /* @__PURE__ */ new WeakMap();
function spans(lines, language) {
  const cached = SPANS.get(lines);
  if (cached) return cached;
  const found = [];
  for (let i2 = 0; i2 < lines.length; i2++) {
    if (!isAssertionLine(language, lines[i2] ?? "")) continue;
    const open = language === "python" ? "([{" : "([";
    const close = language === "python" ? ")]}" : ")]";
    let depth = 0;
    let last = -1;
    for (let j = i2; j < lines.length && last === -1; j++) {
      for (const ch of lines[j] ?? "") {
        if (open.includes(ch)) depth++;
        else if (close.includes(ch)) depth--;
      }
      if (depth <= 0) last = j;
    }
    if (last === -1) last = i2;
    while (language !== "python" && /^\s*\./.test(lines[last + 1] ?? "")) {
      depth = 0;
      let end = last + 1;
      for (let j = last + 1; j < lines.length; j++) {
        for (const ch of lines[j] ?? "") {
          if (open.includes(ch)) depth++;
          else if (close.includes(ch)) depth--;
        }
        end = j;
        if (depth <= 0) break;
      }
      last = end;
    }
    for (let k = i2; k <= last; k++) found[k] = [i2 + 1, last + 1];
    i2 = last;
  }
  SPANS.set(lines, found);
  return found;
}
function statementAt(lines, line, language) {
  const span = spans(lines, language)[line - 1];
  if (!span) return { start: line, text: lines[line - 1] ?? "" };
  const text = lines.slice(span[0] - 1, span[1]).map((l) => l.trim()).join(" ");
  return { start: span[0], text };
}
function hits(matchers, lineNumbers, lines, language) {
  const result = [];
  const seen = /* @__PURE__ */ new Set();
  for (const line of lineNumbers) {
    const { start: start2, text } = statementAt(lines, line, language);
    if (seen.has(start2)) continue;
    seen.add(start2);
    for (const matcher of matchers) {
      const match = matcher.re.exec(text);
      if (!match) continue;
      const label = matcher.label ?? match[0].replace(/^[.\s]+/, "").replace(/\s*\($/, "");
      result.push({ line, group: matcher.group, label, text });
      break;
    }
  }
  return result;
}
var tg007 = ({
  before,
  after: after2,
  hunks,
  beforeLines,
  afterLines
}) => {
  if (!after2) return [];
  const language = after2.stats.language;
  const spec = SPECS2[language];
  const path = after2.stats.path;
  const findings = [];
  const pairedPerGroup = { value: 0, throw: 0 };
  for (const hunk of hunks) {
    const reported = /* @__PURE__ */ new Set();
    if (before) {
      const strongAdded = hits(spec.strong, hunk.added, after2.lines, language);
      const weakAdded = hits(spec.weak, hunk.added, after2.lines, language);
      for (const old of hits(spec.weak, hunk.deleted, before.lines, language)) {
        const same2 = weakAdded.findIndex((h) => h.text === old.text);
        if (same2 !== -1) weakAdded.splice(same2, 1);
      }
      const unkept = hits(
        spec.strong,
        hunk.deleted,
        before.lines,
        language
      ).filter((strong) => {
        const kept = strongAdded.findIndex((h) => h.group === strong.group);
        if (kept === -1) return true;
        strongAdded.splice(kept, 1);
        return false;
      });
      for (const strong of unkept) {
        const other = strongAdded.findIndex((h) => h.group !== strong.group);
        if (other !== -1) {
          strongAdded.splice(other, 1);
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
      const text = after2.lines[line - 1] ?? "";
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
    const resolved = (analysis, source) => {
      const value = valueAt(
        declarations(analysis.lines, source, analysis.stats.language)
      );
      const resolve9 = (side, line) => /^[A-Za-z_$][\w$]*$/.test(side) ? value(side, line)?.replace(/\s+/g, "") ?? side : side;
      return analysis.checks.filter((c) => c.equal).map(
        (c) => ({
          ...c,
          sides: [resolve9(c.sides[0], c.start), resolve9(c.sides[1], c.start)]
        })
      );
    };
    const checksAfter = resolved(after2, afterLines);
    const kept = /* @__PURE__ */ new Map();
    for (const c of checksAfter) {
      const key = c.sides.join("\n");
      kept.set(key, (kept.get(key) ?? 0) + 1);
    }
    const stillThere = (c) => {
      const key = c.sides.join("\n");
      const left = kept.get(key) ?? 0;
      if (left > 0) kept.set(key, left - 1);
      return left > 0;
    };
    const deleted = new Set(hunks.flatMap((hunk) => hunk.deleted));
    const added2 = new Set(hunks.flatMap((hunk) => hunk.added));
    const lines = (check3, set) => {
      const found = [];
      for (let n = check3.start; n <= check3.end; n++) {
        if (set.has(n)) found.push(n);
      }
      return found;
    };
    const checksBefore = resolved(before, beforeLines);
    const touched = (c) => lines(c, deleted).length > 0;
    for (const c of checksBefore) if (!touched(c)) stillThere(c);
    const removed = checksBefore.filter(
      (c) => c.sides[0] !== c.sides[1] && touched(c) && !stillThere(c)
    );
    const reported = new Set(findings.map((f) => f.line));
    for (const check3 of checksAfter) {
      const [subject, expected] = check3.sides;
      const [line] = lines(check3, added2);
      if (subject !== expected || line === void 0 || reported.has(line) || !removed.some((r) => r.sides.includes(subject))) {
        continue;
      }
      reported.add(line);
      findings.push({
        ruleId: "TG007",
        path,
        line,
        message: `replaced the expected value with the value under test \`${subject.length > 60 ? `${subject.slice(0, 57)}...` : subject}\``
      });
    }
  }
  if (before) {
    const all = (lines) => lines.map((_, i2) => i2 + 1);
    const added2 = new Set(hunks.flatMap((hunk) => hunk.added));
    for (const group of ["value", "throw"]) {
      const count4 = (matchers, lines) => hits(
        matchers.filter((m) => !m.pairOnly),
        all(lines),
        lines,
        language
      ).filter((h) => h.group === group);
      const strongDrop = count4(spec.strong, before.lines).length - count4(spec.strong, after2.lines).length;
      const weakAfter = count4(spec.weak, after2.lines);
      const weakRise = weakAfter.length - count4(spec.weak, before.lines).length;
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

// src/watched.ts
var import_picomatch4 = __toESM(require_picomatch2(), 1);
function runnerConfigKind(path) {
  const normalized = normalizePath(path);
  if (/^\.github\/workflows\/[^/]+\.ya?ml$/.test(normalized)) return "workflow";
  const name2 = normalized.split("/").pop() ?? "";
  if (name2 === "package.json") return "package.json";
  if (/^jest\.config\.(?:[cm]?[jt]s|json)$/.test(name2)) return "jest";
  if (/^vitest\.(?:config|workspace)\.[cm]?[jt]s$/.test(name2)) {
    return "vitest";
  }
  if (/^vite\.config\.[cm]?[jt]s$/.test(name2)) return "vite";
  if (/^\.mocharc(?:\.\w+)?$/.test(name2)) return "mocha";
  if (["pytest.ini", "pyproject.toml", "setup.cfg", "tox.ini"].includes(name2)) {
    return "pytest";
  }
  if (name2 === "conftest.py") return "conftest";
  if (name2 === "pom.xml") return "maven";
  if (/^build\.gradle(?:\.kts)?$/.test(name2)) return "gradle";
  return null;
}
var isHookFile = (0, import_picomatch4.default)(
  [
    ".husky/**",
    "{.,}lefthook{,-local}.{yml,yaml}",
    ".pre-commit-config.yaml",
    ".github/workflows/*.{yml,yaml}",
    ".claude/settings{,.local}.json",
    ".codex/**",
    ".gemini/settings.json",
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
function statements(stripped, language, bound, expected) {
  const found = [];
  for (let i2 = 0; i2 < stripped.length; i2++) {
    const line = stripped[i2] ?? "";
    const inline = INLINE.test(line);
    if (!inline && !TABLE.test(line) && !isAssertionLine(language, line)) {
      continue;
    }
    const last = statementEnd(stripped, i2);
    found.push({ start: i2 + 1, end: last + 1, inline });
    i2 = last;
  }
  for (const d of bound) {
    found.push({ start: d.start, end: d.end, inline: false, declares: d.name });
  }
  stripped.forEach((line, i2) => {
    const names = UNPACK[language]?.exec(line);
    const name2 = names?.[1]?.split(",").map((n) => n.trim()).find((n) => expected.has(n));
    if (!names || !name2) return;
    const end = statementEnd(stripped, i2);
    const value = stripped.slice(i2, end + 1).join("\n").slice(names[0].length);
    if (!isCode(value)) {
      found.push({ start: i2 + 1, end: end + 1, inline: false, declares: name2 });
    }
  });
  return found;
}
var UNPACK = {
  js: /^\s*(?:const|let|var)\s+[[{]\s*([\w$]+(?:\s*,\s*[\w$]+)*)\s*,?\s*[\]}]\s*=(?![=>])/,
  python: /^\s*\(?\s*((?:self\.)?\w+(?:\s*,\s*(?:self\.)?\w+)+)\s*,?\s*\)?\s*=(?!=)/
};
var CALL = /[\w$\]>)]\s*\(|=>|\bfunction\b|\blambda\b/;
var VALUE_OF = /(?:\bnew\s*(?:Set|Map|Date|BigDecimal|BigInteger)|\b(?:List|Set|Map)\.of(?:Entries)?|\bArrays\.asList|(?<![\w$.])(?:datetime\.)?(?:datetime|date|time|timedelta|Decimal|Fraction|dict|list|set|tuple|frozenset))\s*\(/g;
var WRAPPED = /(?<![\w$.])(?:(?:Number\.)?(?:parseInt|parseFloat)|Number|String|BigInt|Boolean|int|float|str|bool|(?:Integer|Long|Double)\.valueOf|Integer\.parseInt|Long\.parseLong|Double\.parseDouble)\s*\(\s*(-?\s*(?:'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`[^`$\\]*`|\d[\w.]*))(?:\s*,\s*\d+)?\s*\)/g;
var CAST = /\s+as\s+(?:const\b|[A-Za-z_$][\w$.]*(?:<[^>]*>)?(?:\[\])*)/g;
var isCode = (text) => CALL.test(text.replace(WRAPPED, "$1").replace(VALUE_OF, "("));
var literal2 = (stripped, d) => !isCode(
  stripped.slice(d.start - 1, d.end).join("\n").replace(/^[^=]*=/, "")
);
function expectedNames(checks4) {
  const names = (side) => new Set(
    side.replace(/(['"`])(?:\\.|(?!\1)[^\\])*\1/g, "").match(/(?<![\w$.])(?:self\.)?[A-Za-z_$][\w$]*/g)
  );
  const found = /* @__PURE__ */ new Set();
  for (const { sides } of checks4) {
    sides.forEach((side, i2) => {
      if (isCode(side)) return;
      const other = names(sides[1 - i2] ?? "");
      for (const name2 of names(side)) if (!other.has(name2)) found.add(name2);
    });
  }
  return found;
}
var NAME2 = String.raw`((?:self\.)?[A-Za-z_$][\w$]*)`;
var INPUT = new RegExp(
  [
    String.raw`[(,]\s*(?:[A-Za-z_]\w*\s*=\s*)?${NAME2}\s*(?=[,)])`,
    String.raw`[(,{[]\s*(?:\.\.\.|\*\*?)\s*${NAME2}`,
    String.raw`[{,]\s*(?:[\w$]+|'[^']*'|"[^"]*")\s*:\s*${NAME2}\s*(?=[,}])`,
    String.raw`[(,]\s*${NAME2}(?:\.[\w$]+)+\s*(?=[,)])`,
    String.raw`\$\{\s*${NAME2}`,
    String.raw`\bfor\b.*\b(?:in|of)\s+${NAME2}`,
    String.raw`^\s*(?!self\.[\w$]+\s*=)[\w$]+(?:\[[^\]]*\]|\.[\w$]+)+\s*=\s*${NAME2}\s*;?\s*$`
  ].join("|"),
  "g"
);
var NOT_INPUT = /\bfunction\b|^\s*(?:async\s+)?def\s|=>|\b(?:console\.\w+|Object\.assign|print|System\.out\.print\w*)\s*\(/;
var OWN_LINE = new RegExp(
  String.raw`^\s*(?:[A-Za-z_]\w*\s*=\s*)?${NAME2}\s*(?:,|\)+\s*;?)?\s*$`
);
function callLines(stripped) {
  const open = [];
  return stripped.map((line, i2) => {
    const top = open.at(-1);
    const at = top?.ch === "(" ? top.line : -1;
    for (const ch of line) {
      if ("([{".includes(ch)) open.push({ ch, line: i2 });
      else if (")]}".includes(ch)) open.pop();
    }
    return at;
  });
}
function inputNames(stripped, source, language) {
  const names = /* @__PURE__ */ new Set();
  const call = callLines(stripped);
  for (let i2 = 0; i2 < stripped.length; i2++) {
    const line = stripped[i2] ?? "";
    if (INLINE.test(line) || TABLE.test(line) || isAssertionLine(language, line)) {
      i2 = statementEnd(stripped, i2);
      continue;
    }
    const own = OWN_LINE.exec(line)?.[1];
    const opened = call[i2] ?? -1;
    if (own && opened !== -1 && !NOT_INPUT.test(stripped[opened] ?? "")) {
      names.add(own);
    }
    if (NOT_INPUT.test(line)) continue;
    for (const match of line.matchAll(INPUT)) {
      for (const name2 of match.slice(1)) if (name2) names.add(name2);
    }
    const text = source[i2] ?? "";
    if (language === "python" && /\b[fF][rR]?['"]/.test(text)) {
      for (const [, name2] of text.matchAll(/\{\s*((?:self\.)?[A-Za-z_]\w*)/g)) {
        if (name2) names.add(name2);
      }
    }
  }
  return names;
}
function normalize2(token) {
  if (/^['"`]/.test(token)) return `s:${token.slice(1, -1)}`;
  if (/^\d/.test(token)) {
    const n = Number(token.replace(/_/g, ""));
    return Number.isNaN(n) ? token : `n:${n}`;
  }
  return token;
}
function shape(text, language, resolve9, constants4 = /* @__PURE__ */ new Set()) {
  const code = [];
  const values = [];
  const plain = text.replace(WRAPPED, "$1");
  const tokens = [
    ...(language === "js" ? plain.replace(CAST, "") : plain).matchAll(TOKEN)
  ].map(([token]) => token).filter(
    (t) => !/^\/[/*]/.test(t) && !(language === "python" && t[0] === "#")
  );
  let title = false;
  let skip = -1;
  tokens.forEach((token, i2) => {
    if (i2 <= skip) return;
    if (title && /^['"`]/.test(token)) {
      title = false;
      return;
    }
    title = /^(?:it|test|specify|describe)$/.test(token) && code.length === 0 || title && token === "(";
    if (token === "," && /^[)\]}]$/.test(tokens[i2 + 1] ?? "")) return;
    const attribute = token === "self" && tokens[i2 + 1] === "." && /^[A-Za-z_]/.test(tokens[i2 + 2] ?? "") ? resolve9?.(`self.${tokens[i2 + 2]}`) : void 0;
    if (attribute !== void 0) skip = i2 + 2;
    const value = tokens[i2 - 1] === "." ? void 0 : attribute ?? resolve9?.(token);
    if (value !== void 0) {
      const inner = shape(value, language);
      code.push(...inner.code ? [inner.code] : []);
      values.push(...inner.values);
    } else if (/^\d/.test(token) && negative(tokens, i2)) {
      values.push(`-${normalize2(token)}`);
    } else if (/^['"`\d[\]{},]/.test(token) || LITERAL_WORDS.has(token)) {
      values.push(normalize2(token));
    } else if (/^[A-Za-z_$]/.test(token)) {
      let end = i2;
      let path = token;
      let hit = constants4.has(path) ? i2 : -1;
      while (tokens[end + 1] === "." && /^[A-Za-z_$]/.test(tokens[end + 2] ?? "")) {
        path += `.${tokens[end + 2]}`;
        end += 2;
        if (constants4.has(path)) hit = end;
      }
      if (tokens[i2 - 1] !== "." && hit !== -1 && tokens[hit + 1] !== "(") {
        const name2 = tokens.slice(i2, hit + 1).join("");
        const boxed = /(?:^|\.)Boolean\.(TRUE|FALSE)$/.exec(name2);
        values.push(boxed ? (boxed[1] ?? "").toLowerCase() : `c:${name2}`);
        skip = hit;
      } else code.push(token);
    }
  });
  return { code: code.join(" "), values };
}
function expectedConstants(checks4) {
  const constants4 = (side) => new Set(
    side.replace(/(['"`])(?:\\.|(?!\1)[^\\])*\1/g, "").match(
      /(?<![\w$.])(?:[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*\.[A-Z][\w$]*|[A-Z][A-Z0-9_]+)(?![\w$(])/g
    )
  );
  const found = /* @__PURE__ */ new Set();
  for (const { sides } of checks4) {
    sides.forEach((side, i2) => {
      if (isCode(side)) return;
      const other = constants4(sides[1 - i2] ?? "");
      for (const c of constants4(side)) if (!other.has(c)) found.add(c);
    });
  }
  return found;
}
var negative = (tokens, i2) => tokens[i2 - 1] === "-" && !/^[\w$'"`)\]}]/.test(tokens[i2 - 2] ?? "");
var same = (a, b) => a.length === b.length && a.every((x, i2) => x === b[i2]);
function onlyAdded(before, after2, rowsBefore, rowsAfter) {
  if (same(before, after2.slice(0, before.length))) return true;
  if (rowsBefore.length < 2) return false;
  const left = rowsAfter.map((r) => r.join(" "));
  return rowsBefore.every((row) => {
    const i2 = left.indexOf(row.join(" "));
    if (i2 === -1) return false;
    left.splice(i2, 1);
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
  after: after2,
  beforePath,
  afterPath,
  beforeLines,
  afterLines,
  hunks,
  implementationChanged,
  golden,
  support,
  testsNaming: testsNaming2
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
  if (golden && beforePath && (afterPath === null || hunks.length > 0)) {
    return [
      {
        ruleId: "TG008",
        path: afterPath ?? beforePath,
        message: afterPath === null ? `deleted expected output ${NOTE}` : `${afterPath !== beforePath ? "moved and " : ""}updated expected output ${NOTE}`
      }
    ];
  }
  if (support && testsNaming2 && beforePath && afterPath) {
    return supportValues(
      support.language,
      { path: beforePath, stripped: support.before, source: beforeLines },
      { path: afterPath, stripped: support.after, source: afterLines },
      new Set(hunks.flatMap((h) => h.added)),
      testsNaming2
    );
  }
  if (!before || !after2 || !afterPath) return [];
  const language = after2.stats.language;
  const deleted = new Set(hunks.flatMap((h) => h.deleted));
  const added2 = new Set(hunks.flatMap((h) => h.added));
  const touched = (list2, lines) => list2.filter((s) => {
    for (let n = s.start; n <= s.end; n++) if (lines.has(n)) return true;
    return false;
  });
  const expected = expectedNames([...before.checks, ...after2.checks]);
  for (const name2 of [
    ...inputNames(before.lines, beforeLines, language),
    ...inputNames(after2.lines, afterLines, language)
  ]) {
    expected.delete(name2);
  }
  const bound = (stripped, source) => declarations(stripped, source, language).filter(
    (d) => expected.has(d.name) && literal2(stripped, d)
  );
  const boundBefore = bound(before.lines, beforeLines);
  const boundAfter = bound(after2.lines, afterLines);
  const constants4 = expectedConstants([...before.checks, ...after2.checks]);
  const shapeOf = (s, source, list2) => {
    const value = valueAt(list2);
    return shape(
      withoutMessages(source.slice(s.start - 1, s.end).join("\n"), language),
      language,
      s.declares ? void 0 : (name2) => value(name2, s.start),
      constants4
    );
  };
  const old = touched(
    statements(before.lines, language, boundBefore, expected),
    deleted
  );
  const findings = [];
  for (const statement of touched(
    statements(after2.lines, language, boundAfter, expected),
    added2
  )) {
    const newLines = afterLines.slice(statement.start - 1, statement.end);
    const newShape = shapeOf(statement, afterLines, boundAfter);
    const pair = old.findIndex(
      (s) => s.inline === statement.inline && shapeOf(s, beforeLines, boundBefore).code === newShape.code
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
    const oldShape = shapeOf(match, beforeLines, boundBefore);
    if (same(oldShape.values, newShape.values)) continue;
    const rows = (lines) => lines.map((l) => shape(l, language, void 0, constants4).values).filter((v) => v.length > 0);
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
  const reported = new Set(findings.map((f) => f.line));
  const reads = (name2) => new RegExp(String.raw`(?<![\w$.])${quoted(name2)}(?![\w$])`);
  for (const n of added2) {
    if (reported.has(n) || inArguments(after2.lines, n)) continue;
    for (const { name: name2, value, offset } of bindings(
      after2.lines[n - 1] ?? "",
      language
    )) {
      if (!expected.has(name2) || value !== null && !isLiteral(value)) {
        continue;
      }
      const bound2 = (line, upTo) => bindsName(name2, (after2.lines[line - 1] ?? "").slice(0, upTo));
      let earlier = bound2(n, offset);
      for (let k = 1; k < n && !earlier; k++) earlier = bound2(k);
      if (!earlier) continue;
      const check3 = after2.checks.filter(
        (c) => c.start > n && c.sides.some((side) => reads(name2).test(side))
      ).sort((a, b) => a.start - b.start)[0];
      if (!check3) continue;
      let between = false;
      for (let k = n + 1; k < check3.start && !between; k++) between = bound2(k);
      let existing = true;
      for (let k = check3.start; k <= check3.end; k++) {
        if (added2.has(k)) existing = false;
      }
      if (between || !existing || cleanup(after2.lines, n, language) || language === "python" && enclosingDef(after2.lines, n) !== enclosingDef(after2.lines, check3.start) && // An attribute is shared with the tests from `setUp` and other
      // methods that aren't tests.
      !(name2.startsWith("self.") && !/^test/.test(enclosingDef(after2.lines, n) ?? "test"))) {
        continue;
      }
      findings.push({
        ruleId: "TG008",
        path: afterPath,
        line: n,
        message: `assigned the expected value \`${name2}\` again ${NOTE}: \`${brief([afterLines[n - 1] ?? ""])}\``
      });
      reported.add(n);
      break;
    }
  }
  for (const n of language === "python" ? added2 : []) {
    const value = /^\s*(?:return|yield)\s+(.+)$/.exec(after2.lines[n - 1] ?? "");
    const name2 = enclosingDef(after2.lines, n);
    if (reported.has(n) || !value?.[1] || !name2 || !expected.has(name2) || !isLiteral(value[1].trim()) || !fixture(after2.lines, name2)) {
      continue;
    }
    const read3 = after2.checks.some(
      (c) => c.sides.some((side) => reads(name2).test(side)) && ![...added2].some((k) => k >= c.start && k <= c.end)
    );
    if (!read3) continue;
    findings.push({
      ruleId: "TG008",
      path: afterPath,
      line: n,
      message: `changed the expected value the fixture \`${name2}\` gives ${NOTE}: \`${brief([afterLines[n - 1] ?? ""])}\``
    });
  }
  return findings;
};
function supportValues(language, old, now, added2, testsNaming2) {
  const before = given(old, language);
  const after2 = given(now, language);
  const findings = [];
  for (const g of after2) {
    const line = [...added2].find((n) => n >= g.start && n <= g.end);
    const was = before.filter((o) => o.name === g.name);
    if (line === void 0 || was.length !== 1 || after2.filter((o) => o.name === g.name).length !== 1 || same(
      shape(was[0]?.value ?? "", language).values,
      shape(g.value, language).values
    ) || !readByTests(g.name, [old.path, now.path], language, testsNaming2)) {
      continue;
    }
    findings.push({
      ruleId: "TG008",
      path: now.path,
      line,
      message: `changed the expected value \`${g.name}\` that tests compare with ${NOTE}: \`${brief([now.source[line - 1] ?? ""])}\``
    });
  }
  return findings;
}
function given({ stripped, source }, language) {
  const depths = blockDepths(stripped);
  const found = declarations(stripped, source, language).filter(
    (d) => language === "python" ? !/^\s/.test(stripped[d.start - 1] ?? "") : depths[d.start - 1] === (language === "java" ? 1 : 0)
  ).filter((d) => literal2(stripped, d));
  const add = (name2, i2, last, at) => {
    const code = stripped.slice(i2, last + 1).join("\n").replace(at, "").replace(/[,;]\s*$/, "");
    if (!isLiteral(code.trim())) return;
    found.push({
      name: name2,
      start: i2 + 1,
      end: last + 1,
      value: source.slice(i2, last + 1).join("\n").replace(at, "").replace(/[,;]\s*$/, "")
    });
  };
  if (language === "js") {
    let inObject = false;
    stripped.forEach((line, i2) => {
      const depth = depths[i2] ?? 0;
      if (depth === 0) inObject = false;
      const exported = /^\s*(?:module\.)?exports\.([A-Za-z_$][\w$]*)\s*=(?![=>])/;
      const name2 = depth === 0 ? exported.exec(line)?.[1] : void 0;
      if (name2) add(name2, i2, statementEnd(stripped, i2), /^[^=]*=/);
      const object = /^\s*(?:module\.exports\s*=|export\s+default)\s*\{(.*)$/;
      const opened = depth === 0 ? object.exec(line) : null;
      if (opened && statementEnd(stripped, i2) > i2) inObject = true;
      else if (opened) {
        for (const [, key, value] of (opened[1] ?? "").matchAll(
          /([A-Za-z_$][\w$]*)\s*:\s*([^,{}[\]]+)/g
        )) {
          if (key && value && isLiteral(value.replace(/\}.*$/, "").trim())) {
            const text = new RegExp(String.raw`\b${key}\s*:\s*([^,}]+)`).exec(
              source[i2] ?? ""
            );
            found.push({
              name: key,
              start: i2 + 1,
              end: i2 + 1,
              value: text?.[1]?.trim() ?? ""
            });
          }
        }
      } else if (inObject && depth === 1) {
        const key = /^\s*([A-Za-z_$][\w$]*)\s*:/.exec(line)?.[1];
        if (key) add(key, i2, statementEnd(stripped, i2), /^[^:]*:/);
      }
    });
  }
  if (language === "python") {
    for (const { name: name2, def, end } of fixtureDefs(stripped, source)) {
      for (let i2 = def + 1; i2 <= end; i2++) {
        if (!/^\s*(?:return|yield)\s+\S/.test(stripped[i2] ?? "")) continue;
        const last = statementEnd(stripped, i2);
        add(name2, i2, last, /^\s*(?:return|yield)\s+/);
        i2 = last;
      }
    }
  }
  return found;
}
function blockDepths(stripped) {
  let depth = 0;
  return stripped.map((line) => {
    const at = depth;
    for (const ch of line) {
      if (ch === "{") depth++;
      else if (ch === "}") depth--;
    }
    return at;
  });
}
function fixtureDefs(stripped, source) {
  const found = [];
  const indent2 = (line) => line.length - line.trimStart().length;
  stripped.forEach((line, i2) => {
    const def = /^\s*(?:async\s+)?def\s+(\w+)/.exec(line);
    if (!def?.[1]) return;
    let name2;
    for (let k = i2 - 1; k >= 0 && /^\s*@/.test(stripped[k] ?? ""); k--) {
      if (!/^\s*@(?:pytest(?:_asyncio)?\.)?fixture\b/.test(stripped[k] ?? "")) {
        continue;
      }
      name2 = /\bname\s*=\s*['"](\w+)['"]/.exec(source[k] ?? "")?.[1] ?? def[1];
    }
    if (!name2) return;
    let end = i2;
    for (let j = i2 + 1; j < stripped.length; j++) {
      const next = stripped[j] ?? "";
      if (next.trim() === "") continue;
      if (indent2(next) <= indent2(line)) break;
      end = j;
    }
    found.push({ name: name2, def: i2, end });
  });
  return found;
}
var IMPORTS = /^\s*(?:import\b[^;]*?\bfrom\s*['"][^'"\n]*['"]|import\s+static\s+[^;\n]+;|import\s+[\w.]+\s*;|(?:const|let|var)\s+[^=;]+?=\s*require\s*\(\s*['"][^'"\n]*['"]\s*\)|from\s+[\w.]+\s+import\s+(?:\([^)]*\)|[^\n]+)|import\s+[\w.]+(?:\s+as\s+\w+)?(?:\s*,\s*[\w.]+(?:\s+as\s+\w+)?)*)/gm;
var word2 = (text) => new RegExp(
  String.raw`(?<![\w$])${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\w$])`
);
function moduleName(path) {
  const parts2 = path.replace(/\.\w+$/, "").split("/");
  const base = parts2.at(-1) ?? "";
  return /^(?:index|__init__)$/.test(base) ? parts2.at(-2) ?? "" : base;
}
function readByTests(name2, paths, language, testsNaming2) {
  const modules = paths.map(moduleName);
  const conftest = paths.find((p) => /(?:^|\/)conftest\.py$/.test(p));
  return testsNaming2(name2).some((test) => {
    if (test.language !== language) return false;
    const folder = conftest?.slice(0, conftest.lastIndexOf("/") + 1);
    if (folder !== void 0 && !test.path.startsWith(folder)) return false;
    const { lines: stripped, checks: checks4 } = analyzeSource(
      test.path,
      test.content,
      test.language
    );
    const source = test.content.replace(/\r\n?/g, "\n").split("\n");
    const reads = (local) => expectedNames(checks4).has(local) && !inputNames(stripped, source, language).has(local) && !declarations(stripped, source, language).some((d) => d.name === local);
    if (conftest) return reads(name2);
    const statements2 = [...test.content.matchAll(IMPORTS)].map(([text]) => text).filter((text) => modules.some((m) => word2(m).test(text)));
    for (const text of statements2) {
      const alias = new RegExp(
        String.raw`(?<![\w$.])${name2}\s+as\s+([A-Za-z_$][\w$]*)`
      ).exec(text)?.[1];
      const local = alias ?? (word2(name2).test(text) || /import\s+(?:static\s+[\w.]+\.)?\*/.test(text) ? name2 : void 0);
      if (local && reads(local)) return true;
    }
    const member = new RegExp(
      String.raw`(?<![\w$.])([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\.${name2}(?![\w$(])`,
      "g"
    );
    const owner = (q) => modules.includes(q.split(".").at(-1) ?? "") || statements2.some((text) => word2(q).test(text));
    const passed = (q) => stripped.some(
      (line) => !isAssertionLine(language, line) && new RegExp(
        String.raw`[(,{:]\s*${q.replace(/[.$]/g, "\\$&")}\.${name2}\s*[,)}]`
      ).test(line)
    );
    return checks4.some(
      ({ sides }) => sides.some((side, i2) => {
        if (isCode(side)) return false;
        const other = sides[1 - i2] ?? "";
        return [...side.matchAll(member)].some(
          ([text, q]) => q && owner(q) && !other.includes(text) && !passed(q)
        );
      })
    );
  });
}
var isMessage = (arg) => /^\s*(?:[rRbBuUfF]{1,2})?['"`]/.test(arg);
var after = (n) => (args2) => args2.flatMap((a, i2) => i2 >= n && isMessage(a) ? [i2] : []);
var ends = (n) => (args2) => {
  if (args2.length <= n) return [];
  const first = isMessage(args2[0] ?? "");
  const last = isMessage(args2.at(-1) ?? "");
  if (first === last) return [];
  return [first ? 0 : args2.length - 1];
};
var MESSAGES = {
  js: [
    {
      re: /(?<![\w$])(?:[\w$]+\.)?assert\.(?:equal|notEqual|strictEqual|notStrictEqual|deepEqual|notDeepEqual|deepStrictEqual|notDeepStrictEqual|include|notInclude|deepInclude|lengthOf|typeOf|instanceOf|match|isAbove|isBelow|isAtLeast|isAtMost|sameMembers)\s*\(/g,
      pick: after(2)
    },
    {
      re: /(?<![\w$.])(?:[\w$]+\.)?assert(?:\.(?:ok|isOk|isTrue|isFalse|exists|isNull|isNotNull))?\s*\(/g,
      pick: after(1)
    },
    { re: /(?<![\w$.])expect\s*\(/g, pick: after(1) }
  ],
  python: [
    {
      re: /(?<![\w.])self\.assert(?:Equals?|NotEqual|Is|IsNot|In|NotIn|Greater|GreaterEqual|Less|LessEqual|CountEqual|ListEqual|DictEqual|TupleEqual|SetEqual|MultiLineEqual|SequenceEqual|IsInstance|NotIsInstance|Regex|NotRegex)\s*\(/g,
      pick: after(2)
    },
    {
      re: /(?<![\w.])self\.assert(?:True|False|IsNone|IsNotNone)\s*\(/g,
      pick: after(1)
    },
    {
      re: /(?<![\w.])self\.assert\w*\s*\(/g,
      pick: (args2) => args2.flatMap((a, i2) => /^\s*msg\s*=/.test(a) ? [i2] : [])
    }
  ],
  java: [
    {
      re: /\.(?:as|describedAs|withFailMessage|overridingErrorMessage)\s*\(|(?<![\w$])assertWithMessage\s*\(/g,
      pick: (args2) => args2.map((_, i2) => i2)
    },
    {
      re: /(?<![\w$.])assert(?:Equals|NotEquals|Same|NotSame|ArrayEquals|IterableEquals|LinesMatch)\s*\(/g,
      pick: ends(2)
    },
    {
      re: /(?<![\w$.])assert(?:True|False|Null|NotNull)\s*\(/g,
      pick: ends(1)
    },
    // Hamcrest's reason: `assertThat("reason", actual, matcher)`.
    {
      re: /(?<![\w$.])assertThat\s*\(/g,
      pick: (args2) => args2.length === 3 && isMessage(args2[0] ?? "") ? [0] : []
    }
  ]
};
function withoutMessages(text, language) {
  const cuts = /* @__PURE__ */ new Map();
  const cut = (start2, end) => cuts.set(`${start2}:${end}`, [start2, end]);
  for (const { re, pick } of MESSAGES[language]) {
    for (const match of text.matchAll(re)) {
      const args2 = callArgs(text, match.index + match[0].length);
      if (!args2) continue;
      for (const i2 of pick(args2.map(([s, e]) => text.slice(s, e)))) {
        const [start2, end] = args2[i2] ?? [0, 0];
        cut(i2 === 0 ? start2 : args2[i2 - 1]?.[1] ?? start2, end);
      }
    }
  }
  const statement = /^\s*assert\b/.exec(text);
  if (language === "python" && statement) {
    const comma = topLevel(text, statement[0].length, ",");
    if (comma !== -1 && isMessage(text.slice(comma + 1))) {
      cut(comma, text.length);
    }
  }
  let result = text;
  for (const [start2, end] of [...cuts.values()].sort((a, b) => b[0] - a[0])) {
    result = result.slice(0, start2) + result.slice(end);
  }
  return result;
}
function callArgs(text, at) {
  const args2 = [];
  let start2 = at;
  let depth = 0;
  for (let i2 = at; i2 < text.length; i2++) {
    const ch = text[i2] ?? "";
    if (`'"\``.includes(ch)) {
      i2 = stringEnd(text, i2);
    } else if ("([{".includes(ch)) depth++;
    else if (")]}".includes(ch)) {
      if (depth-- === 0) {
        if (text.slice(start2, i2).trim() !== "") args2.push([start2, i2]);
        return args2;
      }
    } else if (ch === "," && depth === 0) {
      args2.push([start2, i2]);
      start2 = i2 + 1;
    }
  }
  return null;
}
function topLevel(text, at, target) {
  let depth = 0;
  for (let i2 = at; i2 < text.length; i2++) {
    const ch = text[i2] ?? "";
    if (`'"\``.includes(ch)) i2 = stringEnd(text, i2);
    else if ("([{".includes(ch)) depth++;
    else if (")]}".includes(ch)) depth--;
    else if (ch === target && depth === 0) return i2;
  }
  return -1;
}
function stringEnd(text, i2) {
  const quote = text[i2];
  for (let j = i2 + 1; j < text.length; j++) {
    if (text[j] === "\\") j++;
    else if (text[j] === quote) return j;
  }
  return text.length;
}
function fixture(stripped, name2) {
  const def = stripped.findIndex(
    (line) => new RegExp(String.raw`^\s*(?:async\s+)?def\s+${name2}\s*\(`).test(line)
  );
  for (let k = def - 1; k >= 0; k--) {
    const line = (stripped[k] ?? "").trim();
    if (/^@(?:pytest(?:_asyncio)?\.)?fixture\b/.test(line)) return true;
    if (!line.startsWith("@")) return false;
  }
  return false;
}
function bindings(stripped, language) {
  const found = [];
  const parts2 = language === "python" ? [stripped] : stripped.split(";").filter(Boolean);
  let offset = 0;
  for (const part of parts2) {
    const at = stripped.indexOf(part, offset);
    offset = at + part.length;
    const rest = (end) => stripped.slice(at + end, at + part.length).trim().replace(/;$/, "");
    const set = SET.exec(part);
    if (set?.[1]) {
      const operator = set[3] ?? "=";
      const attribute = set[1] === "self" && /^\.\w+/.exec(set[2] ?? "");
      const name3 = attribute ? `self${attribute[0]}` : set[1];
      const member = attribute ? set[2]?.slice(attribute[0].length) : set[2];
      const plain = operator === "=" && !member;
      found.push({
        name: name3,
        value: plain ? rest(set.index + set[0].length) : null,
        offset: at
      });
      continue;
    }
    const tuple = TUPLE.exec(part);
    if (tuple?.[1]) {
      const value = rest(tuple.index + tuple[0].length);
      for (const name3 of tuple[1].split(",")) {
        found.push({ name: name3.trim(), value, offset: at });
      }
      continue;
    }
    const changed = ASSIGN.exec(part) ?? MUTATE.exec(part);
    if (changed?.[1] && !isCode(changed[2] ?? "")) {
      found.push({ name: changed[1], value: null, offset: at });
      continue;
    }
    const step = STEP.exec(part);
    const name2 = step?.[1] ?? step?.[2];
    if (name2) found.push({ name: name2, value: null, offset: at });
  }
  return found;
}
var SET = /^\s*(?:if\s*\(.*\)\s*)?(?:(?:const|let|var)\s+)?([A-Za-z_$][\w$]*)((?:\.[\w$]+|\[[^\]]*\])*)\s*(?::[^=]*)?([-+*/%]?=)(?![=>])/;
var TUPLE = /^\s*[[(]?\s*((?:self\.)?[A-Za-z_$][\w$]*(?:\s*,\s*(?:self\.)?[A-Za-z_$][\w$]*)+)\s*,?\s*[\])]?\s*=(?![=>])/;
var MEMBERS = String.raw`(?:\.[\w$]+|\[[^\]]*\])*`;
var TARGET = String.raw`((?:self\.)?[A-Za-z_$][\w$]*)${MEMBERS}`;
var STEP = new RegExp(
  String.raw`^\s*(?:(?:\+\+|--)${TARGET}|${TARGET}(?:\+\+|--))\s*$`
);
var ASSIGN = new RegExp(
  String.raw`^\s*Object\.assign\s*\(\s*${TARGET}\s*,()`
);
var MUTATE = new RegExp(
  String.raw`^\s*${TARGET}\.(?:push|unshift|splice|update|append|extend|insert|add|set|put|setdefault)\s*\((.*)\)\s*;?\s*$`
);
var isLiteral = (value) => !isCode(value) && !(/^[A-Za-z_$][\w$]*$/.test(value) && !LITERAL_WORDS.has(value));
var quoted = (name2) => name2.replace(/[$.]/g, "\\$&");
function bindsName(name2, line) {
  return new RegExp(
    String.raw`(?<![\w$.])${quoted(name2)}\s*(?::[^=;]*)?(?:=(?![=>])|;|$)`
  ).test(line);
}
function cleanup(stripped, n, language) {
  if (language === "python") {
    return /^(?:teardown|tearDown)\w*$/.test(enclosingDef(stripped, n) ?? "");
  }
  const open = [];
  stripped.slice(0, n - 1).forEach((line, i2) => {
    for (const ch of line) {
      if (ch === "{") open.push(i2);
      else if (ch === "}") open.pop();
    }
  });
  return open.some(
    (i2) => /\bafter(?:Each|All)\b|@After(?:Each|All)?\b/.test(
      `${stripped[i2 - 1] ?? ""} ${stripped[i2] ?? ""}`
    )
  );
}
function enclosingDef(stripped, n) {
  const indent2 = (line) => line.length - line.trimStart().length;
  let limit = indent2(stripped[n - 1] ?? "");
  for (let k = n - 1; k >= 1; k--) {
    const line = stripped[k - 1] ?? "";
    if (line.trim() === "" || indent2(line) >= limit) continue;
    const def = /^\s*(?:async\s+)?def\s+(\w+)/.exec(line);
    if (def) return def[1];
    limit = indent2(line);
  }
  return void 0;
}
function inArguments(stripped, n) {
  const open = [];
  for (const line of stripped.slice(0, n - 1)) {
    for (const ch of line) {
      if ("([{".includes(ch)) open.push(ch);
      else if (")]}".includes(ch)) open.pop();
    }
  }
  const last = open.at(-1);
  return last === "(" || last === "[";
}

// src/engine/diff.ts
var MAX_CELLS = 4e6;
function diffLines(before, after2) {
  let start2 = 0;
  while (start2 < before.length && start2 < after2.length && before[start2] === after2[start2]) {
    start2++;
  }
  let endB = before.length;
  let endA = after2.length;
  while (endB > start2 && endA > start2 && before[endB - 1] === after2[endA - 1]) {
    endB--;
    endA--;
  }
  const ops = editScript(before.slice(start2, endB), after2.slice(start2, endA));
  const hunks = [];
  let current = null;
  let b = start2;
  let a = start2;
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
function editScript(before, after2) {
  const n = before.length;
  const m = after2.length;
  if ((n + 1) * (m + 1) > MAX_CELLS) {
    const anchors = uniqueAnchors(before, after2);
    if (anchors.length === 0) {
      return [...Array(n).fill("-"), ...Array(m).fill("+")];
    }
    const ops2 = [];
    let i3 = 0;
    let j2 = 0;
    for (const [a, b] of anchors) {
      ops2.push(...editScript(before.slice(i3, a), after2.slice(j2, b)), "=");
      i3 = a + 1;
      j2 = b + 1;
    }
    ops2.push(...editScript(before.slice(i3), after2.slice(j2)));
    return ops2;
  }
  const w = m + 1;
  const lcs = new Uint32Array((n + 1) * w);
  for (let i3 = n - 1; i3 >= 0; i3--) {
    for (let j2 = m - 1; j2 >= 0; j2--) {
      lcs[i3 * w + j2] = before[i3] === after2[j2] ? (lcs[(i3 + 1) * w + j2 + 1] ?? 0) + 1 : Math.max(lcs[(i3 + 1) * w + j2] ?? 0, lcs[i3 * w + j2 + 1] ?? 0);
    }
  }
  const ops = [];
  let i2 = 0;
  let j = 0;
  while (i2 < n && j < m) {
    if (before[i2] === after2[j]) {
      ops.push("=");
      i2++;
      j++;
    } else if ((lcs[(i2 + 1) * w + j] ?? 0) >= (lcs[i2 * w + j + 1] ?? 0)) {
      ops.push("-");
      i2++;
    } else {
      ops.push("+");
      j++;
    }
  }
  for (; i2 < n; i2++) ops.push("-");
  for (; j < m; j++) ops.push("+");
  return ops;
}
function uniqueAnchors(before, after2) {
  const seen = /* @__PURE__ */ new Map();
  const entry = (line) => {
    let e = seen.get(line);
    if (!e) {
      e = { b: -1, a: -1, nb: 0, na: 0 };
      seen.set(line, e);
    }
    return e;
  };
  before.forEach((line, i2) => {
    const e = entry(line);
    e.b = i2;
    e.nb++;
  });
  after2.forEach((line, j) => {
    const e = entry(line);
    e.a = j;
    e.na++;
  });
  const pairs = [...seen.values()].filter((e) => e.nb === 1 && e.na === 1).map((e) => [e.b, e.a]).sort((x, y) => x[0] - y[0]);
  const tails = [];
  const previous = [];
  pairs.forEach(([, a], k) => {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = lo + hi >> 1;
      if ((pairs[tails[mid] ?? 0]?.[1] ?? 0) < a) lo = mid + 1;
      else hi = mid;
    }
    previous[k] = lo > 0 ? tails[lo - 1] ?? -1 : -1;
    tails[lo] = k;
  });
  const run2 = [];
  for (let k = tails.at(-1) ?? -1; k !== -1; k = previous[k] ?? -1) {
    const pair = pairs[k];
    if (pair) run2.unshift(pair);
  }
  return run2;
}

// src/engine/compare.ts
function isWatched(path, ctx) {
  return ctx.detect(path) !== null || isSnapshot(path) || isGolden(path, ctx) || ctx.testsNaming !== void 0 && supportLanguage(path, ctx) !== null || guardFileKind(path) !== null || runnerConfigKind(path) !== null && !ctx.excluded(path) || ctx.findLiteral !== void 0 && isImplementationCode(path, ctx);
}
function compareFiles(change, ctx, ruleIds) {
  const input = toRuleInput(change, ctx);
  if (!input) return [];
  return ruleIds.flatMap((id) => RULES[id](input));
}
function toRuleInput(change, ctx) {
  const before = change.before && isWatched(change.before.path, ctx) ? change.before : null;
  const after2 = change.after && isWatched(change.after.path, ctx) ? change.after : null;
  if (!before && !after2) return null;
  const beforeLang = before && ctx.detect(before.path);
  const afterLang = after2 && ctx.detect(after2.path);
  const path = after2?.path ?? before?.path ?? "";
  const beforeLines = before ? splitLines(before.content) : [];
  const afterLines = after2 ? splitLines(after2.content) : [];
  const runnerConfig = ctx.excluded(path) ? null : runnerConfigKind(path) ?? (before && runnerConfigKind(before.path) === "workflow" ? "workflow" : null);
  let beforeAnalysis = before && beforeLang ? analyzeSource(before.path, before.content, beforeLang) : null;
  let afterAnalysis = after2 && afterLang ? analyzeSource(after2.path, after2.content, afterLang) : null;
  const hasTests = (a) => a !== null && (a.stats.tests > 0 || a.stats.skips > 0);
  if ((before === null || ctx.runnerOnly?.(before.path)) && (after2 === null || ctx.runnerOnly?.(after2.path)) && !hasTests(beforeAnalysis) && !hasTests(afterAnalysis)) {
    beforeAnalysis = null;
    afterAnalysis = null;
  }
  const support = supportLanguage(path, ctx);
  const strip = (file) => file && support ? analyzeSource(file.path, file.content, support).lines : [];
  return {
    before: beforeAnalysis,
    after: afterAnalysis,
    beforePath: change.before?.path ?? null,
    afterPath: change.after?.path ?? null,
    beforeLines,
    afterLines,
    hunks: diffLines(beforeLines, afterLines),
    runnerConfig,
    addedToExistingDir: runnerConfig !== null && change.before === null && change.after !== null && ctx.dirExisted?.(parentDir(change.after.path)) === true,
    implementationChanged: ctx.implementationChanged,
    golden: change.before !== null && isGolden(change.before.path, ctx),
    support: support && {
      language: support,
      before: strip(before),
      after: strip(after2)
    },
    testsNaming: ctx.testsNaming,
    implementationFile: isImplementationCode(path, ctx),
    findLiteral: ctx.findLiteral,
    guardFile: guardFileKind(change.after?.path ?? "") ?? guardFileKind(change.before?.path ?? "")
  };
}
var DEPENDENCIES = /(?:^|\/)(?:package-lock\.json|npm-shrinkwrap\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?|requirements[\w.-]*\.txt|pyproject\.toml|poetry\.lock|uv\.lock|Pipfile(?:\.lock)?|pom\.xml|build\.gradle(?:\.kts)?|gradle\.lockfile|go\.(?:mod|sum)|Cargo\.(?:toml|lock)|Gemfile(?:\.lock)?|composer\.(?:json|lock))$/;
var TEST_DIR = /(?:^|\/)(?:tests?|__tests__|spec|__mocks__|__fixtures__|fixtures?|testdata)\//i;
var CODE = /\.(?:[cm]?[jt]sx?|vue|svelte|py|java|kt|kts|scala|groovy|go|rs|cs|fs|vb|rb|php|swift|m|mm|c|cc|cpp|cxx|h|hh|hpp|sql|sh|ps1)$/i;
function isImplementation(path, ctx) {
  return ctx.detect(path) === null && !isSnapshot(path) && guardFileKind(path) === null && (DEPENDENCIES.test(path) || CODE.test(path) && !TEST_DIR.test(path) && !CONFTEST.test(path));
}
var CONFTEST = /(?:^|\/)conftest\.py$/;
function supportLanguage(path, ctx) {
  if (ctx.detect(path) !== null || ctx.excluded(path) || !(TEST_DIR.test(path) || CONFTEST.test(path))) {
    return null;
  }
  if (/\.[cm]?[jt]sx?$/.test(path)) return "js";
  if (/\.py$/.test(path)) return "python";
  if (/\.java$/.test(path)) return "java";
  return null;
}
function isGolden(path, ctx) {
  return ctx.detect(path) === null && !ctx.excluded(path) && TEST_DIR.test(path) && !CODE.test(path) && !/\.(?:md|rst|adoc)$/i.test(path) && path.split("/").some(
    (part) => !/(?:^|[._-])[Ii]nputs?(?=[._-]|[A-Z]|$)/.test(part) && /(?:^|[._-])(?:[Ee]xpected|EXPECTED|[Gg]olden|GOLDEN)[sS]?(?=[._-]|[A-Z]|$)/.test(
      part
    )
  );
}
var isDependencyFile = (path) => DEPENDENCIES.test(path);
var isImplementationCode = (path, ctx) => isImplementation(path, ctx) && !isDependencyFile(path);
function changesCode(before, after2, path) {
  return codeOf(before, path) !== codeOf(after2, path);
}
function codeOf(source, path) {
  const python2 = /\.py$/i.test(path);
  const hash = /\.(?:py|sh|rb|ps1|php)$/i.test(path);
  const slash = !/\.(?:py|sh|rb|ps1)$/i.test(path);
  const dash = /\.sql$/i.test(path);
  const markup = /\.(?:vue|svelte)$/i.test(path);
  const text = toLf(source);
  const end = (from) => {
    const n = text.indexOf("\n", from);
    return n === -1 ? text.length : n;
  };
  let out2 = "";
  let lineStart = true;
  let i2 = 0;
  while (i2 < text.length) {
    const ch = text[i2] ?? "";
    if (ch === "\n") {
      out2 += ch;
      lineStart = true;
      i2++;
    } else if (/\s/.test(ch)) {
      if (python2 && lineStart) out2 += ch;
      i2++;
    } else if (slash && text.startsWith("//", i2) || hash && ch === "#" || dash && text.startsWith("--", i2)) {
      i2 = end(i2);
    } else if (slash && text.startsWith("/*", i2)) {
      const close = text.indexOf("*/", i2 + 2);
      i2 = close === -1 ? text.length : close + 2;
    } else if (markup && text.startsWith("<!--", i2)) {
      const close = text.indexOf("-->", i2 + 4);
      i2 = close === -1 ? text.length : close + 3;
    } else if (ch === '"' || ch === "'" || ch === "`") {
      const quote = python2 && text.startsWith(ch.repeat(3), i2) ? ch.repeat(3) : ch;
      let j = i2 + quote.length;
      while (j < text.length && !text.startsWith(quote, j)) {
        if (quote.length === 1 && ch !== "`" && text[j] === "\n") break;
        j += text[j] === "\\" ? 2 : 1;
      }
      if (text.startsWith(quote, j)) j += quote.length;
      j = Math.min(text.length, j);
      const docstring = quote.length === 3 && lineStart && text.slice(j, end(j)).trim() === "";
      if (!docstring) out2 += text.slice(i2, j);
      lineStart = lineStart && docstring;
      i2 = j;
    } else {
      out2 += ch;
      lineStart = false;
      i2++;
    }
  }
  return out2.split("\n").filter((line) => line.trim() !== "").join("\n");
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
  existsSync as existsSync2,
  mkdtempSync,
  rmSync,
  statSync,
  utimesSync
} from "fs";
import { tmpdir } from "os";
import { join as join2, resolve } from "path";
var GitError = class extends Error {
};
function git(root, args2, env = process.env) {
  try {
    return execFileSync("git", args2, {
      cwd: root,
      env,
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"]
    });
  } catch (error) {
    const stderr = String(error.stderr ?? "").trim();
    throw new GitError(`git ${args2[0]} failed${stderr ? `: ${stderr}` : ""}`);
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
function gitPath(root, name2) {
  return resolve(root, git(root, ["rev-parse", "--git-path", name2]).trim());
}
function createWorktreeIndex(root) {
  const indexPath = gitPath(root, "index");
  const dir = mkdtempSync(join2(tmpdir(), "test-guard-"));
  const tempIndex = join2(dir, "index");
  try {
    if (existsSync2(indexPath)) {
      copyFileSync(indexPath, tempIndex);
      const { atime, mtime } = statSync(indexPath);
      utimesSync(tempIndex, atime, mtime);
    }
    const env = { ...process.env, GIT_INDEX_FILE: tempIndex };
    const hidden = git(root, ["ls-files", "-v", "-z"], env).split("\0").filter((entry) => /^(?:[a-z]|S) /.test(entry)).map((entry) => entry.slice(2)).filter((path) => existsSync2(join2(root, path)));
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
  const args2 = ["diff", "-z", "--name-status", "-M", "--no-ext-diff"];
  if (mode.kind === "base") args2.push(base ?? "HEAD", "HEAD");
  else args2.push("--cached", ...base ? [base] : []);
  const parts2 = git(root, args2, env).split("\0");
  const changes = [];
  let i2 = 0;
  while (i2 < parts2.length - 1) {
    const status = parts2[i2++] ?? "";
    const path = parts2[i2++] ?? "";
    if (status.startsWith("R")) {
      changes.push({ beforePath: path, afterPath: parts2[i2++] ?? "" });
    } else if (status.startsWith("C")) {
      changes.push({ beforePath: null, afterPath: parts2[i2++] ?? "" });
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
  const out2 = mode.kind === "base" ? git(root, ["ls-tree", "-r", "-z", "--name-only", "HEAD"]) : git(root, ["ls-files", "-z", "--cached"], env);
  return [...new Set(out2.split("\0").filter(Boolean))];
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
function grepTree(root, rev, patterns, word3 = false) {
  let out2;
  try {
    out2 = execFileSync(
      "git",
      [
        "grep",
        "-n",
        "-z",
        "-I",
        "-F",
        ...word3 ? ["-w"] : [],
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
  return out2.split("\n").filter(Boolean).flatMap((entry) => {
    const [spec = "", line = "", text = ""] = entry.split("\0");
    const path = spec.slice(rev.length + 1);
    return path ? [{ path, line: Number(line), text }] : [];
  });
}
function readTreeTexts(root, rev, wanted) {
  const texts = /* @__PURE__ */ new Map();
  let paths;
  try {
    paths = listTreeFiles(root, rev).filter(
      (path) => wanted(path) && !path.includes("\n")
    );
  } catch {
    return texts;
  }
  if (paths.length === 0) return texts;
  const out2 = execFileSync("git", ["cat-file", "--batch"], {
    cwd: root,
    input: paths.map((path) => `${rev}:${path}
`).join(""),
    maxBuffer: 1024 * 1024 * 1024,
    stdio: ["pipe", "pipe", "pipe"]
  });
  let at = 0;
  for (const path of paths) {
    const end = out2.indexOf(10, at);
    if (end === -1) break;
    const header = out2.toString("utf8", at, end).split(" ");
    at = end + 1;
    if (header.length !== 3) continue;
    const size = Number(header[2]);
    if (header[1] === "blob") {
      texts.set(path, out2.toString("utf8", at, at + size));
    }
    at += size + 1;
  }
  return texts;
}
function listTreeFiles(root, rev) {
  return git(root, ["ls-tree", "-r", "-z", "--name-only", rev]).split("\0").filter(Boolean);
}

// src/engine/literals.ts
var CHECKS = /^(?:it|test|describe|context|suite|specify|expect|assert\w*|equals?|deepEqual|strictEqual|deepStrictEqual|ok|that|fail|each|parametrize|CsvSource|ValueSource)$/;
var MATCHERS = /^(?:to|is|has|contains)[A-Z]\w*$/;
var COMMENT = /^\s*(?:\/\/|#|\*|\/\*|<!--)/;
var VENDORED = /(?:^|\/)(?:vendor|third_party|node_modules|dist|build)\/|\.min\.[cm]?js$/;
var LITERAL2 = String.raw`'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|\x60(?:[^\x60\\\n]|\\.)*\x60|-?\d+(?:\.\d+)?|\btrue\b|\bfalse\b|\bTrue\b|\bFalse\b`;
function passedAsInput(text, token) {
  for (let at = text.indexOf(token); at !== -1; at = text.indexOf(token, at + 1)) {
    let depth = 0;
    for (let i2 = at - 1; i2 >= 0; i2--) {
      const ch = text[i2];
      if (ch === ")") depth++;
      else if (ch === "(") {
        if (depth > 0) {
          depth--;
          continue;
        }
        const call = /(\.\s*)?([A-Za-z_$][\w$]*)\s*$/.exec(text.slice(0, i2));
        const callee2 = call?.[2];
        const matcher = call?.[1] !== void 0 && MATCHERS.test(callee2 ?? "");
        if (callee2 && !CHECKS.test(callee2) && !matcher) return true;
        break;
      }
    }
  }
  return false;
}
var isNumber = (literal3) => /^-?\d+(?:\.\d+)?$/.test(literal3);
function forms(literal3) {
  return isNumber(literal3) ? [literal3] : [`'${literal3}'`, `"${literal3}"`, `\`${literal3}\``];
}
function expectedValues(text, input) {
  return [...text.matchAll(new RegExp(LITERAL2, "g"))].map((m) => m[0]).filter((v) => v !== input).map((v) => /^['"`]/.test(v) ? v.slice(1, -1) : v.toLowerCase());
}
function literalFinder(root, base, ctx) {
  const cache = /* @__PURE__ */ new Map();
  return (literals) => {
    const wanted = [...new Set(literals)].filter((l) => !cache.has(l));
    const strings2 = wanted.filter((l) => !isNumber(l));
    const numbers = wanted.filter(isNumber);
    let hits2 = [];
    try {
      hits2 = [
        ...strings2.length > 0 ? grepTree(root, base, strings2) : [],
        ...numbers.length > 0 ? grepTree(root, base, numbers, true) : []
      ];
    } catch {
      return /* @__PURE__ */ new Map();
    }
    for (const literal3 of wanted) {
      const use = { test: null, expected: [], inCode: false };
      for (const hit of hits2) {
        if (COMMENT.test(hit.text)) continue;
        const form = forms(literal3).find((f) => hit.text.includes(f));
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
      cache.set(literal3, use);
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
var LITERAL3 = String.raw`'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|\x60(?:[^\x60\\\n]|\\.)*\x60|-?\d+(?:\.\d+)?`;
var COMPARISONS = [
  `(?:===?|!==?)\\s*(${LITERAL3})`,
  `(${LITERAL3})\\s*(?:===?|!==?)`,
  `\\b(?:case|when)\\s+(${LITERAL3})\\s*(?::|->|=>|then\\b)`,
  `\\.equals(?:IgnoreCase)?\\(\\s*(${LITERAL3})\\s*\\)`,
  `(${LITERAL3})\\.equals(?:IgnoreCase)?\\(`,
  `\\bObject\\.is\\([^,()]*,\\s*(${LITERAL3})\\s*\\)`,
  `\\[\\s*(${LITERAL3})\\s*\\]\\.includes\\(`,
  `\\bin\\s*[[(]\\s*(${LITERAL3})\\s*,?\\s*[\\])]`
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
var unquote2 = (token) => /^['"`]/.test(token) ? token.slice(1, -1) : token;
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
  const after2 = line.slice(at + token.length);
  return /(?:\breturn\b|\|\||&&|=>)[^;{}()]*$/.test(before) && !/^\s*\)\s*(?:\{|\breturn\b|\w)/.test(after2);
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
        const literal3 = unquote2(token);
        if (literal3.length < 2 && !isNumber(literal3)) continue;
        if (COMMON.has(literal3) || /\\|^[\s\p{P}]*$/u.test(literal3)) continue;
        if (seen.has(literal3) || before.includes(token)) continue;
        seen.add(literal3);
        const near = [n, n + 1, n + 2, n + 3].filter((i2) => i2 === n || added2.has(i2)).map((i2) => afterLines[i2 - 1] ?? "").join("\n");
        candidates2.push({ literal: literal3, token, line: n, near });
      }
    }
  }
  if (candidates2.length === 0) return [];
  const uses = findLiteral(candidates2.map((c) => c.literal));
  const findings = [];
  for (const { literal: literal3, token, line, near } of candidates2) {
    const use = uses.get(literal3);
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
    ...createContext(
      config,
      base ? runnerTestPatterns(readTreeTexts(root, base, isRunnerFile)) : []
    ),
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
    const read3 = (spec, path) => isWatched(path, ctx) ? readBlob(root, spec, env) : "";
    const findings = [];
    const changes = [...listChanges(root, base, mode, env)];
    if (base) {
      ctx.findLiteral = literalFinder(root, base, ctx);
      ctx.testsNaming = testsNaming(root, base, ctx, env);
    }
    ctx.implementationChanged = changes.some(({ beforePath, afterPath }) => {
      const path = afterPath ?? beforePath;
      if (path === null || !isImplementation(path, ctx)) return false;
      if (isDependencyFile(path) || afterPath === null) return true;
      return changesCode(
        base && beforePath ? readBlob(root, `${base}:${beforePath}`, env) : "",
        readBlob(root, afterSpec(mode, path), env),
        path
      );
    });
    for (const { beforePath, afterPath } of changes) {
      const change = {
        before: beforePath && base ? {
          path: beforePath,
          content: read3(`${base}:${beforePath}`, beforePath)
        } : null,
        after: afterPath ? {
          path: afterPath,
          content: read3(afterSpec(mode, afterPath), afterPath)
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
function testsNaming(root, base, ctx, env) {
  const cache = /* @__PURE__ */ new Map();
  return (name2) => {
    let found = cache.get(name2);
    if (!found) {
      let paths = [];
      try {
        paths = [
          ...new Set(grepTree(root, base, [name2], true).map((h) => h.path))
        ];
      } catch {
      }
      found = paths.flatMap((path) => {
        const language = ctx.detect(path);
        return language ? [
          {
            path,
            language,
            content: readBlob(root, `${base}:${path}`, env)
          }
        ] : [];
      });
      cache.set(name2, found);
    }
    return found;
  };
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
  existsSync as existsSync3,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync as rmSync2,
  statSync as statSync2,
  writeFileSync
} from "fs";
import { join as join3 } from "path";
var MAX_AGE_MS = 30 * 24 * 60 * 60 * 1e3;
function sessionFile(root, sessionId) {
  const dotGit = join3(root, ".git");
  const dir = statSync2(dotGit).isDirectory() ? join3(dotGit, "test-guard", "sessions") : gitPath(root, "test-guard/sessions");
  return join3(dir, sessionId.replace(/[^\w.-]/g, "_"));
}
function recordSessionStart(root, sessionId) {
  const file = sessionFile(root, sessionId);
  if (existsSync3(file)) return;
  const head = resolveCommit(root, "HEAD");
  if (!head) return;
  const dir = join3(file, "..");
  mkdirSync(dir, { recursive: true });
  for (const name2 of readdirSync(dir)) {
    const old = join3(dir, name2);
    if (Date.now() - statSync2(old).mtimeMs > MAX_AGE_MS) rmSync2(old);
  }
  writeFileSync(file, `${head}
`);
}
function sessionStart(root, sessionId) {
  const file = sessionFile(root, sessionId);
  if (!existsSync3(file)) return null;
  const hash = readFileSync(file, "utf8").trim();
  return /^[0-9a-f]{40,64}$/.test(hash) ? resolveCommit(root, hash) : null;
}

// src/adapters/shell.ts
import {
  existsSync as existsSync4,
  readdirSync as readdirSync2,
  readFileSync as readFileSync2,
  realpathSync,
  statSync as statSync3
} from "fs";
import { basename, join as join4, resolve as resolve2 } from "path";
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
  for (let i2 = 0; i2 < command.length; i2++) {
    const ch = command[i2] ?? "";
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
      while (command[i2 + 1] === ">") {
        op += ">";
        i2++;
      }
      if (command[i2 + 1] === "&") {
        i2++;
        while (/\d/.test(command[i2 + 1] ?? "")) i2++;
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
  let i2 = 0;
  for (; ; ) {
    const token = tokens[i2] ?? "";
    if (/^[A-Za-z_]\w*=/.test(token) || ["sudo", "env", "command", "exec", "nohup", "time", "&"].includes(token)) {
      i2++;
    } else if (["npx", "pnpx", "bunx"].includes(token)) {
      i2++;
      while ((tokens[i2] ?? "").startsWith("-")) i2++;
    } else {
      return tokens.slice(i2);
    }
  }
}
function verbOf(tokens) {
  const first = (tokens[0] ?? "").toLowerCase().replace(/\\/g, "/");
  return (first.split("/").pop() ?? "").replace(/\.exe$/, "");
}
function gitParts(tokens) {
  const configs = [];
  let i2 = 1;
  while (i2 < tokens.length && (tokens[i2] ?? "").startsWith("-")) {
    const flag = tokens[i2] ?? "";
    if (flag === "-c") configs.push(tokens[i2 + 1] ?? "");
    i2 += flag === "-c" || flag === "-C" ? 2 : 1;
  }
  return { sub: tokens[i2] ?? "", rest: tokens.slice(i2 + 1), configs };
}
var isRedirect = (token) => token === ">" || token === ">>";
function withoutRedirects(args2) {
  return args2.filter(
    (t, i2) => !isRedirect(t) && !isRedirect(args2[i2 - 1] ?? "")
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
  const args2 = rest.filter(
    (t) => ![
      "--get",
      "--get-all",
      "--local",
      "--global",
      "--system",
      "--worktree"
    ].includes(t)
  );
  return sub === "config" && args2.length === 1 && !args2[0]?.startsWith("-");
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
      `${B}(?:\\.gemini|gemini-cli)[\\\\/]+(?:settings[\\w.-]*|trustedFolders)\\.json${E}`,
      "i"
    ),
    "changes Gemini CLI settings"
  ],
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
  if (!HOOK_FILE.test(path) || !existsSync4(path)) return false;
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
    return readdirSync2(path).some((name2) => {
      const child = join4(path, name2);
      return name2 === "workflows" ? holdsTestGuardHook(child, depth + 1) : runsTestGuard(child);
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
    rest.forEach((token, i2) => {
      if (/^-[a-zA-Z]*m$/.test(token) || token === "--message") {
        messages.push(rest[i2 + 1] ?? "");
      } else if (token.startsWith("--message=")) {
        messages.push(token.slice("--message=".length));
      }
    });
  }
  return messages.filter((m) => m !== "");
}
var GEMINI_UNTRUST = /\bGEMINI_CLI_TRUST_WORKSPACE\s*=\s*["']?false\b|\bGEMINI_RESTRICTED_MODE\s*=\s*["']?(?:true|1)\b|\bGEMINI_CLI_TRUSTED_FOLDERS_PATH\s*=/i;
var BYPASS_TEXT = [
  [/--no-verify(?![\w-])/, "`--no-verify` skips test-guard\u2019s git hook"],
  [/hookspath/i, "changing `core.hooksPath` skips test-guard\u2019s git hook"],
  [/disableAllHooks/i, "`disableAllHooks` turns off agent hooks"],
  [
    /\bHUSKY\s*=\s*["']?0\b|\bLEFTHOOK\s*=\s*["']?(?:0|false)\b|\bLEFTHOOK_EXCLUDE\s*=|\bSKIP\s*=(?=[^\n]*\bgit\b[^\n]*\bcommit\b)/i,
    "turns off the git hook runner that starts test-guard"
  ],
  [
    GEMINI_UNTRUST,
    "makes Gemini CLI distrust the folder, which turns off its project hooks"
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
  for (let i2 = 1; i2 < tokens.length; i2++) {
    const token = tokens[i2] ?? "";
    if (/^-(?:e|c|p|-eval|-print)$/.test(token)) return -1;
    if (!token.startsWith("-")) return i2;
  }
  return -1;
}
var SHELLS = /* @__PURE__ */ new Set(["bash", "sh", "zsh", "dash", "ksh"]);
var POWERSHELLS = /* @__PURE__ */ new Set(["pwsh", "powershell"]);
function nestedCommand(tokens) {
  const verb = verbOf(tokens);
  const args2 = tokens.slice(1);
  if (SHELLS.has(verb)) {
    const i2 = args2.findIndex((a) => /^-[a-z]*c[a-z]*$/.test(a));
    return i2 === -1 ? null : args2[i2 + 1] ?? null;
  }
  if (POWERSHELLS.has(verb)) {
    const i2 = args2.findIndex((a) => /^-(?:c|command)$/i.test(a));
    return i2 === -1 ? null : args2.slice(i2 + 1).join(" ");
  }
  if (verb === "cmd") {
    const i2 = args2.findIndex((a) => /^\/[ck]$/i.test(a));
    return i2 === -1 ? null : args2.slice(i2 + 1).join(" ");
  }
  if (verb === "eval" || verb === "invoke-expression" || verb === "iex") {
    return args2.join(" ");
  }
  return null;
}
var CD = /* @__PURE__ */ new Set(["cd", "set-location", "sl", "pushd", "chdir"]);
function walk(command, cwd, depth = 0) {
  const out2 = [];
  let dir = cwd;
  for (const tokens of splitCommand(command)) {
    const verb = verbOf(tokens);
    if (CD.has(verb)) {
      const target = pathArgs(tokens.slice(1))[0];
      if (target) dir = resolve2(dir, target);
      continue;
    }
    out2.push({ tokens, dir });
    const nested = depth < 3 ? nestedCommand(tokens) : null;
    if (nested) out2.push(...walk(nested, dir, depth + 1));
  }
  return out2;
}
function updatesSnapshots(command, cwd) {
  return walk(command, cwd).some(({ tokens }) => {
    if (verbOf(tokens) === "echo") return false;
    const runner = tokens.some(
      (t) => /(?:^|[\\/])(?:jest|vitest|playwright|pytest)(?:\.[cm]?js|\.cmd)?$/i.test(
        t
      )
    ) || /^(?:npm|pnpm|yarn|bun)$/i.test(verbOf(tokens)) && tokens.some((t) => /^(?:t|test(?::.*)?)$/.test(t)) || tokens.some((t) => /(?:^|[\\/])(?:node|tsx)(?:\.exe)?$/i.test(t)) && tokens.includes("--test");
    return runner && tokens.some(
      (t) => /^(?:--?u|--update|--updateSnapshot|--update-snapshots?|--test-update-snapshots|--snapshot[.-]update|--force-regen|--inline-snapshot=(?:fix|create|update)\S*)(?:=.*)?$/.test(
        t
      ) && !/=(?:false|0)$/.test(t)
    );
  });
}
function flagValue(token) {
  return /^--?[A-Za-z][\w-]*[:=](.+)$/.exec(token)?.[1] ?? null;
}
function pathArgs(args2) {
  return withoutRedirects(args2).flatMap((a) => {
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
  while (!existsSync4(existing)) {
    const parent = resolve2(existing, "..");
    if (parent === existing) return clean;
    rest.unshift(basename(existing));
    existing = parent;
  }
  try {
    return join4(realpathSync.native(existing), ...rest);
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
  return paths.map((source) => join4(resolve2(dir, dest), basename(source)));
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
  const args2 = tokens.slice(1).map((t) => t.toLowerCase());
  const names = args2.filter((a) => !a.startsWith("-"));
  if (verb === "claude" && /^plugins?$/.test(names[0] ?? "")) {
    const action = names[1] ?? "";
    const target = names.slice(2);
    const all = args2.includes("-a") || args2.includes("--all");
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
        (t, i2) => i2 === 0 || i2 === script ? [] : candidates(t, dir)
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
    rest.forEach((token, i2) => {
      const value = ["-F", "--file", "-t", "--template"].includes(token) ? rest[i2 + 1] : /^--(?:file|template)=/.test(token) ? token.slice(token.indexOf("=") + 1) : /^-[Ft]./.test(token) ? token.slice(2) : void 0;
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
function findSelection(args2, dir) {
  const firstExpr = args2.findIndex((a) => /^[-(!]/.test(a));
  const starts = (firstExpr === -1 ? args2 : args2.slice(0, firstExpr)).filter(
    (a) => a !== ""
  );
  const flagArg = (...flags2) => {
    const i2 = args2.findIndex((a) => flags2.includes(a));
    return i2 === -1 ? void 0 : args2[i2 + 1];
  };
  const path = flagArg("-path", "-ipath", "-wholename");
  const name2 = flagArg("-name", "-iname");
  return (starts.length > 0 ? starts : ["."]).map((start2) => {
    const base = resolve2(dir, start2);
    if (path) return resolve2(dir, path);
    return name2 ? join4(base, "**", name2) : base;
  });
}
function listedFiles(segment) {
  if (!segment) return null;
  const { tokens, dir } = segment;
  const verb = verbOf(tokens);
  const args2 = tokens.slice(1);
  if (verb === "find") return findSelection(args2, dir);
  if (verb === "git" && gitParts(tokens).sub === "ls-files") {
    const specs = pathArgs(gitParts(tokens).rest);
    return specs.length > 0 ? specs.map((s) => resolve2(dir, s)) : [dir];
  }
  if (["ls", "dir", "echo", "printf"].includes(verb)) {
    return pathArgs(args2).map((p) => resolve2(dir, p));
  }
  if (["get-childitem", "gci"].includes(verb)) {
    const value = (flag) => {
      const i2 = args2.findIndex((a) => a.toLowerCase() === flag);
      return i2 === -1 ? void 0 : args2[i2 + 1];
    };
    const filter = value("-filter") ?? value("-include");
    const recurse = args2.some((a) => /^-r(?:ecurse)?$/i.test(a));
    const roots = pathArgs(
      args2.filter((_, i2) => !/^-(?:filter|include)$/i.test(args2[i2 - 1] ?? ""))
    );
    return (roots.length > 0 ? roots : ["."]).map((root) => {
      const base = resolve2(dir, root);
      return filter ? join4(base, recurse ? "**" : "", filter) : base;
    });
  }
  if (["grep", "rg"].includes(verb) && args2.some((a) => /^-\w*[lL]/.test(a))) {
    const rest = pathArgs(args2).slice(1);
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
    let args2 = tokens.slice(1);
    if (MKDIR.has(verb)) {
      for (const p of pathArgs(args2)) made.add(resolve2(dir, p));
      return;
    }
    if (verb === "git") {
      const { sub, rest } = gitParts(tokens);
      if (sub !== "rm" && sub !== "mv") return;
      verb = `git ${sub}`;
      args2 = rest;
    }
    if (verb === "xargs") {
      const inner = args2.findIndex((a) => DELETE.has(verbOf([a])));
      if (inner === -1) return;
      verb = verbOf([args2[inner] ?? ""]);
      args2 = [];
    }
    if (verb === "find") {
      const deletes = args2.includes("-delete") || args2.some(
        (a, i2) => ["-exec", "-execdir", "-ok"].includes(a) && DELETE.has(verbOf([args2[i2 + 1] ?? ""]))
      );
      if (deletes) {
        ops.push({
          kind: "delete",
          verb: "find",
          sources: findSelection(args2, dir)
        });
      }
      return;
    }
    if (/^[a-z]+-[a-z]+$/.test(verb)) {
      args2 = args2.map((a) => a.replace(/\\/g, "/"));
    }
    const named = (name2) => {
      const i2 = args2.findIndex((a) => new RegExp(`^-${name2}$`, "i").test(a));
      if (i2 !== -1) return args2[i2 + 1];
      return args2.map((a) => new RegExp(`^-${name2}:(.+)$`, "i").exec(a)?.[1]).find(Boolean);
    };
    const destination = named("destination");
    const paths = pathArgs(
      args2.filter(
        (a, i2) => !/^-destination(?::|$)/i.test(a) && !/^-destination$/i.test(args2[i2 - 1] ?? "")
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
  for (let i2 = index - 1; i2 >= 0; i2--) {
    const segment = segments[i2];
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
    hookCwd = resolve3(input.cwd);
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
  const unplugged = droppedPlugin(change) ?? geminiHooksOff(change);
  if (unplugged) return [unplugged];
  const bypass = writtenBypass(change);
  if (bypass.length > 0) return bypass;
  const root = findRepoRoot(dirname2(anchor));
  if (!root) return [];
  const before = change.beforePath ? repoPath(root, change.beforePath) : null;
  const after2 = change.afterPath ? repoPath(root, change.afterPath) : null;
  const { config, ctx } = loadContext(root);
  const watched = (p) => p !== null && isWatched(p, ctx);
  if (!watched(before) && !watched(after2)) return [];
  return compareFiles(
    {
      before: before !== null && change.before !== null ? { path: before, content: change.before } : null,
      after: after2 !== null && change.after !== null ? { path: after2, content: change.after } : null
    },
    ctx,
    blockingRuleIds(config)
  );
}
function unpredictableEdit(file) {
  const path = realPath(file);
  const root = findRepoRoot(dirname2(path));
  const relative2 = root && repoPath(root, path);
  if (!root || !relative2) return [];
  const { ctx } = loadContext(root);
  if (!isWatched(relative2, { ...ctx, findLiteral: void 0 })) return [];
  return [
    {
      ruleId: "test-guard",
      message: "cannot tell what this edit changes, since its old text is not in the file exactly; read the file again and retry with the exact text",
      path: relative2
    }
  ];
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
  [/(?:^|\/)\.claude\/plugins\/.*test-guard/i, "edits the test-guard plugin"],
  // Gemini CLI skips project hooks in a folder that isn't trusted.
  [
    /(?:^|\/)\.gemini\/trustedFolders\.json$/i,
    "edits the folders Gemini CLI trusts, which decide whether its hooks run"
  ]
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
  const after2 = new Set(enabled(change.after));
  const lost = enabled(change.before).filter((k) => !after2.has(k));
  return lost.length > 0 ? {
    ruleId: "TG006",
    message: `turns off the test-guard plugin (\`enabledPlugins\` ${lost[0]})`,
    path
  } : null;
}
var hookCwd = process.cwd();
function geminiHooksOff(change) {
  const path = normalizePath(change.afterPath ?? "");
  if (!/(?:^|\/)(?:\.gemini|gemini-cli)\/settings\.json$/i.test(path)) {
    return null;
  }
  const project = [hookCwd, findRepoRoot(hookCwd)].filter((dir) => dir !== null).map((dir) => join5(dir, ".gemini", "settings.json")).filter((file) => existsSync5(file)).map((file) => readFileSync3(file, "utf8"));
  const message = hooksTurnedOff(
    change.before ?? "",
    change.after ?? "",
    project
  );
  return message ? { ruleId: "TG006", message, path } : null;
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
    GEMINI_UNTRUST,
    "a setting that makes Gemini CLI distrust the folder, turning off its hooks"
  ],
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
  const after2 = toLf(change.after).split("\n");
  const added2 = diffLines(before, after2).flatMap((hunk) => hunk.added).map((line) => after2[line - 1] ?? "").join("\n");
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
    if (existsSync5(file) && findApproval(readFileSync3(file, "utf8"))) {
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
    const destIsDir = op.destIsDir === true || op.dest !== void 0 && existsSync5(op.dest) && statSync4(op.dest).isDirectory();
    for (const source of op.sources) {
      const src = repoPath(root, source);
      if (src === null) continue;
      const glob = /[*?[\]{}]/.test(src);
      const matches = glob ? (0, import_picomatch5.default)(src, { dot: true }) : (f) => src === "" || f === src || f.startsWith(`${src}/`);
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
  const join9 = (...parts2) => parts2.filter(Boolean).join("/");
  const name2 = (p) => p.split("/").pop() ?? "";
  if (file === src) return destIsDir ? join9(dest, name2(file)) : dest;
  if (glob) return join9(dest, name2(file));
  const inner = file.slice(src.length + 1);
  return destIsDir ? join9(dest, name2(src), inner) : join9(dest, inner);
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
function findRepoRoot(start2) {
  let dir = start2;
  for (; ; ) {
    if (existsSync5(join5(dir, ".git"))) return dir;
    const parent = dirname2(dir);
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
        ...createContext(
          config,
          runnerTestPatterns(readTreeTexts(root, "HEAD", isRunnerFile))
        ),
        // Before the tool runs, the disk is the "before" side.
        dirExisted: (dir) => {
          const path = join5(root, dir);
          return existsSync5(path) && readdirSync3(path).length > 0;
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

// src/adapters/apply-patch.ts
import { resolve as resolve4 } from "path";
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
  for (const [start2, length, segment] of replacements.reverse()) {
    lines.splice(
      start2,
      Math.min(length, Math.max(lines.length - start2, 0)),
      ...segment
    );
  }
  if (lines.at(-1) !== "") lines.push("");
  return lines.join("\n");
}
function seekSequence(lines, pattern, start2, eof) {
  if (pattern.length === 0) return start2;
  if (pattern.length > lines.length) return null;
  const searchStart = eof ? lines.length - pattern.length : start2;
  const last = lines.length - pattern.length;
  const passes = [
    (s) => s,
    (s) => s.trimEnd(),
    (s) => s.trim(),
    normalise
  ];
  for (const norm of passes) {
    for (let i2 = searchStart; i2 <= last; i2++) {
      if (pattern.every((p, j) => norm(lines[i2 + j] ?? "") === norm(p))) {
        return i2;
      }
    }
  }
  return null;
}
function normalise(s) {
  return s.trim().replace(/[‐-―−]/g, "-").replace(/[‘-‛]/g, "'").replace(/[“-‟]/g, '"').replace(/[  -   　]/g, " ");
}
function simulatePatch(patch, cwd, read3, failed = () => {
}) {
  const hunks = parsePatch(patch);
  const original = /* @__PURE__ */ new Map();
  const current = /* @__PURE__ */ new Map();
  const moves = /* @__PURE__ */ new Map();
  const get = (path) => {
    if (!current.has(path)) {
      const text = read3(path);
      original.set(path, text);
      current.set(path, text);
    }
    return current.get(path) ?? null;
  };
  for (const hunk of hunks) {
    const path = resolve4(cwd, hunk.path);
    if (hunk.kind === "add") {
      get(path);
      current.set(path, hunk.contents);
      continue;
    }
    const text = get(path);
    if (text === null) {
      failed();
      break;
    }
    if (hunk.kind === "delete") {
      current.set(path, null);
      continue;
    }
    const next = applyChunks(text, hunk.chunks);
    if (next === null) {
      failed();
      break;
    }
    if (hunk.movePath === void 0) {
      current.set(path, next);
    } else {
      const dest = resolve4(cwd, hunk.movePath);
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
  for (const [path, after2] of current) {
    if (paired.has(path)) continue;
    const before = original.get(path) ?? null;
    if (before === after2) continue;
    files.push({
      beforePath: before === null ? null : path,
      before,
      afterPath: after2 === null ? null : path,
      after: after2
    });
  }
  return files;
}

// src/adapters/claude-code.ts
function runClaudeCodeHook(stdin) {
  return forCursor(stdin, eachRoot(stdin));
}
function eachRoot(stdin) {
  let raw;
  try {
    raw = JSON.parse(stdin.replace(/^\uFEFF/, ""));
  } catch {
    return check(stdin);
  }
  const roots = Array.isArray(raw.workspace_roots) ? raw.workspace_roots : [];
  if (raw.hook_event_name !== "stop" || roots.length < 2) return check(stdin);
  const outputs = roots.filter((root) => typeof root === "string").map((root) => check(JSON.stringify({ ...raw, cwd: localPath(root) }))).filter((out2) => out2 !== "").map((out2) => JSON.parse(out2));
  const blocks = outputs.filter((out2) => out2.decision === "block");
  if (blocks.length > 0) {
    const reason = blocks.map((out2) => String(out2.reason)).join("\n\n");
    return `${JSON.stringify({ decision: "block", reason })}
`;
  }
  const messages = outputs.map((out2) => out2.systemMessage).filter(Boolean);
  return messages.length > 0 ? `${JSON.stringify({ systemMessage: messages.join("\n") })}
` : "";
}
function localPath(path) {
  return path.replace(/^\/([A-Za-z]:)/, "$1");
}
function check(stdin) {
  return runHook(stdin, (input) => {
    const patch = patchText(input);
    if (patch !== null) return checkPatch(patch, resolve5(input.cwd));
    const edit = fileEdit(input);
    if (edit) {
      const file = resolve5(input.cwd, localPath(edit.filePath));
      const current = existsSync6(file) ? readFileSync4(file, "utf8") : null;
      if (edit.kind === "delete") {
        return current === null ? [] : checkFileChange({
          beforePath: file,
          before: current,
          afterPath: null,
          after: null
        });
      }
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
    return command === null ? [] : checkShell(command, resolve5(input.cwd, shellDir(input) ?? "."));
  });
}
function checkPatch(patch, cwd) {
  let complete = true;
  let files = [];
  try {
    files = simulatePatch(patch, cwd, read, () => {
      complete = false;
    });
  } catch (error) {
    if (!(error instanceof PatchError)) throw error;
    complete = false;
  }
  const violations = files.flatMap(checkFileChange);
  if (complete) return violations;
  const named = patch.matchAll(
    /^[ \t]*\*\*\*[ \t]*(?:(?:add|update|delete)[ \t]+file|move[ \t]+to)[ \t]*:[ \t]*(.+?)[ \t\r]*$/gim
  );
  const paths = new Set(
    [...named].map(
      (m) => resolve5(cwd, (m[1] ?? "").replace(/^(["'])(.*)\1$/, "$2"))
    )
  );
  return [...violations, ...[...paths].flatMap(unpredictableEdit)];
}
function read(path) {
  return existsSync6(path) ? readFileSync4(path, "utf8") : null;
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
import { existsSync as existsSync7, readFileSync as readFileSync5 } from "fs";
import { resolve as resolve6 } from "path";

// src/hook-io/codex.ts
function patchText2(input) {
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

// src/adapters/codex.ts
function runCodexHook(stdin) {
  return runHook(stdin, (input) => {
    const cwd = resolve6(input.cwd);
    const patch = patchText2(input);
    if (patch !== null) {
      let files;
      try {
        files = simulatePatch(patch, cwd, read2);
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
function read2(path) {
  return existsSync7(path) ? readFileSync5(path, "utf8") : null;
}

// src/adapters/gemini.ts
import { existsSync as existsSync8, readdirSync as readdirSync4, readFileSync as readFileSync6 } from "fs";
import { basename as basename2, isAbsolute as isAbsolute2, join as join6, resolve as resolve7 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";

// src/hook-io/gemini.ts
var EVENTS = {
  BeforeTool: "PreToolUse",
  AfterAgent: "Stop"
};
function toCommonInput(text) {
  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    return text;
  }
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return text;
  }
  const input = raw;
  const event = EVENTS[String(input.hook_event_name)];
  return event ? JSON.stringify({ ...input, hook_event_name: event }) : text;
}
function toGeminiOutput(output) {
  if (output === "") return output;
  const value = JSON.parse(output);
  const reason = value.hookSpecificOutput?.permissionDecisionReason;
  return reason === void 0 ? output : `${JSON.stringify({ decision: "deny", reason })}
`;
}
function fileEdit2(input) {
  const { toolName, toolInput: t } = input;
  if (typeof t.file_path !== "string") return null;
  if (toolName === "write_file" && typeof t.content === "string") {
    return { kind: "write", filePath: t.file_path, content: t.content };
  }
  if (toolName === "replace" && typeof t.old_string === "string" && typeof t.new_string === "string") {
    return {
      kind: "replace",
      filePath: t.file_path,
      oldString: t.old_string,
      newString: t.new_string,
      allowMultiple: t.allow_multiple === true
    };
  }
  return null;
}
function shellCommand3(input) {
  const { toolName, toolInput: t } = input;
  if (toolName !== "run_shell_command" || typeof t.command !== "string") {
    return null;
  }
  return {
    command: t.command,
    dir: typeof t.dir_path === "string" && t.dir_path !== "" ? t.dir_path : null
  };
}

// src/adapters/gemini-replace.ts
function geminiReplace(current, oldString, newString, allowMultiple) {
  const text = current.replace(/\r\n/g, "\n");
  const search = oldString.replace(/\r\n/g, "\n");
  const replace = newString.replace(/\r\n/g, "\n");
  if (search === "") return null;
  const result = exact(text, search, replace, allowMultiple) ?? flexible(text, search, replace, allowMultiple) ?? regex(text, search, replace, allowMultiple) ?? "unpredictable";
  if (result === "unpredictable") return result;
  if (result === text) return null;
  const next = restoreTrailingNewline(text, result);
  return current.includes("\r\n") ? next.replace(/\n/g, "\r\n") : next;
}
var accepted = (occurrences, allowMultiple) => occurrences === 1 || allowMultiple;
function exact(text, search, replace, allowMultiple) {
  const occurrences = text.split(search).length - 1;
  if (occurrences === 0) return void 0;
  if (!accepted(occurrences, allowMultiple)) return "unpredictable";
  return text.split(search).join(replace);
}
function flexible(text, search, replace, allowMultiple) {
  const sourceLines = text.match(/.*(?:\n|$)/g)?.slice(0, -1) ?? [];
  const searchLines = search.split("\n").map((line) => line.trim());
  const replaceLines = replace.split("\n");
  let occurrences = 0;
  let i2 = 0;
  while (i2 <= sourceLines.length - searchLines.length) {
    const window2 = sourceLines.slice(i2, i2 + searchLines.length);
    if (window2.every((line, k) => line.trim() === searchLines[k])) {
      occurrences++;
      const indentation = /^([ \t]*)/.exec(window2[0] ?? "")?.[1] ?? "";
      let replacement = applyIndentation(replaceLines, indentation).join("\n");
      if (replace !== "" && (window2.at(-1) ?? "").endsWith("\n") && !replacement.endsWith("\n")) {
        replacement += "\n";
      }
      sourceLines.splice(i2, searchLines.length, replacement);
    }
    i2++;
  }
  if (occurrences === 0) return void 0;
  if (!accepted(occurrences, allowMultiple)) return "unpredictable";
  return sourceLines.join("");
}
function regex(text, search, replace, allowMultiple) {
  let spaced = search;
  for (const delimiter of ["(", ")", ":", "[", "]", "{", "}", ">", "<", "="]) {
    spaced = spaced.split(delimiter).join(` ${delimiter} `);
  }
  const tokens = spaced.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return void 0;
  const pattern = `^([ 	]*)${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s*")}`;
  const occurrences = text.match(new RegExp(pattern, "gm"))?.length ?? 0;
  if (occurrences === 0) return void 0;
  if (!accepted(occurrences, allowMultiple)) return "unpredictable";
  const lines = replace.split("\n");
  return text.replace(
    new RegExp(pattern, allowMultiple ? "gm" : "m"),
    (_, indentation) => applyIndentation(lines, indentation || "").join("\n")
  );
}
function applyIndentation(lines, target) {
  if (lines.length === 0) return [];
  const reference = /^([ \t]*)/.exec(lines[0] ?? "")?.[1] ?? "";
  return lines.map((line) => {
    if (line.trim() === "") return "";
    if (line.startsWith(reference))
      return target + line.slice(reference.length);
    return target + line.trimStart();
  });
}
function restoreTrailingNewline(original, modified) {
  const had = original.endsWith("\n");
  if (had && !modified.endsWith("\n")) return `${modified}
`;
  if (!had && modified.endsWith("\n")) return modified.replace(/\n$/, "");
  return modified;
}

// src/adapters/gemini.ts
function runGeminiHook(stdin) {
  return toGeminiOutput(
    runHook(toCommonInput(stdin), (input) => {
      const cwd = resolve7(input.cwd);
      const edit = fileEdit2(input);
      if (edit) {
        const file = toolPath(cwd, edit.filePath);
        if (edit.kind === "write") {
          return changeTo(file, readText(file), edit.content);
        }
        const replace = (path, current2) => changeTo(
          path,
          current2,
          geminiReplace(
            current2,
            edit.oldString,
            edit.newString,
            edit.allowMultiple
          )
        );
        const current = readText(file);
        if (current !== null) return replace(file, current);
        if (edit.oldString === "") return changeTo(file, null, edit.newString);
        const found = [
          ...new Set(
            pathForms(edit.filePath).filter((p) => !isAbsolute2(p)).flatMap((p) => endingLike(cwd, p))
          )
        ];
        if (found.length > 1) return found.flatMap(unpredictableEdit);
        const [only] = found;
        const text = only === void 0 ? null : readText(only);
        return only === void 0 || text === null ? [] : replace(only, text);
      }
      const shell = shellCommand3(input);
      return shell === null ? [] : checkShell(shell.command, resolve7(cwd, shell.dir ?? "."));
    })
  );
}
function changeTo(file, current, next) {
  if (next === "unpredictable") return unpredictableEdit(file);
  if (next === null) return [];
  return checkFileChange({
    beforePath: current === null ? null : file,
    before: current,
    afterPath: file,
    after: next
  });
}
function readText(file) {
  return existsSync8(file) ? readFileSync6(file, "utf8") : null;
}
function toolPath(cwd, raw) {
  const forms2 = pathForms(raw);
  const absolute = (p) => isAbsolute2(p) ? p : resolve7(cwd, p);
  const found = forms2.map(absolute).find((p) => existsSync8(p));
  if (found) return found;
  const [path = raw] = forms2;
  const first = path.split(/[\\/]/)[0] ?? "";
  const mention = path.startsWith("@") && !existsSync8(resolve7(cwd, first)) ? forms2.at(-1) : void 0;
  return absolute(mention ?? path);
}
function pathForms(raw) {
  let path = raw.replace(/\0/g, "");
  if (/^file:\/\//i.test(path)) {
    try {
      path = fileURLToPath2(path);
    } catch {
    }
  }
  const forms2 = [path];
  try {
    forms2.push(decodeURIComponent(path));
  } catch {
  }
  if (path.startsWith("@") && path.length > 1) {
    const stripped = path.slice(1).replace(/^[\\/]+/, "");
    if (stripped !== "") forms2.push(stripped);
  }
  return forms2;
}
function endingLike(root, relative2) {
  const target = relative2.replace(/\\/g, "/");
  const name2 = basename2(target);
  const found = [];
  const queue = [root];
  for (let i2 = 0; i2 < queue.length; i2++) {
    const dir = queue[i2] ?? "";
    let entries;
    try {
      entries = readdirSync4(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = join6(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== ".git" && entry.name !== "node_modules") {
          queue.push(full);
        }
      } else if (entry.isFile() && entry.name === name2 && full.replace(/\\/g, "/").endsWith(target)) {
        found.push(full);
      }
    }
  }
  return found;
}

// src/install/agent-hooks.ts
import { existsSync as existsSync10, readFileSync as readFileSync8 } from "fs";
import { join as join8 } from "path";

// src/install/git-hook.ts
import {
  chmodSync,
  existsSync as existsSync9,
  mkdirSync as mkdirSync2,
  readFileSync as readFileSync7,
  writeFileSync as writeFileSync2
} from "fs";
import { dirname as dirname3, join as join7 } from "path";
var InstallError = class extends Error {
};
var MARKER = "# test-guard:";
var LOCAL_CLI = "node_modules/test-guard/dist/cli.js";
var CHECK_ARGS = 'check --staged --message-file "$1"';
var HOOK_COMMAND = `npx --no-install test-guard ${CHECK_ARGS}`;
function localCli(root) {
  return existsSync9(join7(root, LOCAL_CLI)) ? LOCAL_CLI : null;
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
  const existing = existsSync9(path) ? readFileSync7(path, "utf8") : null;
  if (existing !== null && !existing.includes(MARKER)) {
    throw new InstallError(
      `${path} already exists and was not created by test-guard.
Add this line to it instead:
  ${command}`
    );
  }
  mkdirSync2(dirname3(path), { recursive: true });
  writeFileSync2(path, hookScript(command));
  chmodSync(path, 493);
  return { path, updated: existing !== null };
}

// src/install/agent-hooks.ts
var AGENTS = ["claude-code", "codex", "gemini"];
var SPECS3 = {
  "claude-code": {
    file: [".claude", "settings.json"],
    preToolUseMatcher: "Edit|Write|Delete|Bash|PowerShell",
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
  },
  gemini: {
    file: [".gemini", "settings.json"],
    preToolUseMatcher: "write_file|replace|run_shell_command",
    events: { preToolUse: "BeforeTool", stop: "AfterAgent" },
    // Hooks run in the project folder (the one whose .gemini/settings.json
    // was loaded), through bash or, on Windows, PowerShell, so a relative
    // path works in both. `$GEMINI_PROJECT_DIR` is not used: Gemini puts it
    // in quotes of its own, which break inside the command. The name lets
    // `hooksConfig.disabled` be checked for it (TG006).
    handler: (arg, local) => ({
      name: `test-guard-${arg}`,
      type: "command",
      command: local ? `node ${local} hook gemini ${arg}` : `npx --no-install test-guard hook gemini ${arg}`
    }),
    note: "Gemini CLI runs project hooks only in a trusted folder, and loads them when started from the project root."
  }
};
function planAgentHooks(root, agent) {
  const spec = SPECS3[agent];
  const path = join8(root, ...spec.file);
  const before = existsSync10(path) ? readFileSync8(path, "utf8") : null;
  const { settings, comments } = parseSettings(path, before);
  const hadHooks = isObject4(settings.hooks);
  const hooks = isObject4(settings.hooks) ? settings.hooks : {};
  const local = localCli(root);
  let added2 = 0;
  for (const { event, arg, matcher } of [
    {
      event: spec.events?.preToolUse ?? "PreToolUse",
      arg: "pre-tool-use",
      matcher: spec.preToolUseMatcher
    },
    { event: spec.events?.stop ?? "Stop", arg: "stop", matcher: void 0 }
  ]) {
    const entries = Array.isArray(hooks[event]) ? hooks[event] : [];
    const text = JSON.stringify(entries);
    if (text.includes("test-guard") && text.includes(arg)) continue;
    entries.push({
      ...matcher && { matcher },
      hooks: [spec.handler(arg, local)]
    });
    hooks[event] = entries;
    added2++;
  }
  const note = spec.note;
  if (added2 === 0) return { path, before, after: before ?? "", changed: false };
  if (!comments || before === null) {
    settings.hooks = hooks;
    const after3 = `${JSON.stringify(settings, null, 2)}
`;
    return { path, before, after: after3, changed: after3 !== before, note };
  }
  if (hadHooks) {
    throw new InstallError(
      `${path} has comments and its own "hooks", which test-guard won't rewrite; add these entries to "hooks" by hand:
${JSON.stringify(hooks, null, 2)}`
    );
  }
  const open = blankComments(before).indexOf("{");
  const empty = /^\s*\}/.test(blankComments(before).slice(open + 1));
  const block = JSON.stringify({ hooks }, null, 2).slice(1, -1).trimEnd();
  const after2 = `${before.slice(0, open + 1)}${block}${empty ? "\n" : ","}${before.slice(open + 1)}`;
  return { path, before, after: after2, changed: true, note };
}
function formatDiff(before, after2) {
  const b = before === null ? [] : before.replace(/\r\n/g, "\n").split("\n");
  const a = after2.split("\n");
  const hunks = diffLines(b, a);
  const deleted = new Set(hunks.flatMap((h) => h.deleted));
  const added2 = new Set(hunks.flatMap((h) => h.added));
  const out2 = [];
  let i2 = 0;
  let j = 0;
  while (i2 < b.length || j < a.length) {
    if (i2 < b.length && deleted.has(i2 + 1)) out2.push(`- ${b[i2++]}`);
    else if (j < a.length && added2.has(j + 1)) out2.push(`+ ${a[j++]}`);
    else {
      out2.push(`  ${a[j] ?? ""}`);
      i2++;
      j++;
    }
  }
  return `${out2.join("\n").trimEnd()}
`;
}
function parseSettings(path, text) {
  if (text === null || text.trim() === "") {
    return { settings: {}, comments: false };
  }
  let value;
  let comments = false;
  try {
    value = JSON.parse(text);
  } catch {
    try {
      value = JSON.parse(blankComments(text));
      comments = true;
    } catch {
      throw new InstallError(`${path} is not valid JSON`);
    }
  }
  if (!isObject4(value)) throw new InstallError(`${path} is not a JSON object`);
  return { settings: value, comments };
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
  const count4 = (severity) => report.findings.filter((f) => f.severity === severity).length;
  return `${JSON.stringify(
    {
      tool: "test-guard",
      version,
      compare: { mode: report.mode.kind, from: report.from },
      findings: report.findings,
      summary: {
        error: count4("error"),
        warn: count4("warn"),
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
  findings.forEach((f, i2) => {
    const badge = f.severity === "error" ? c.bgRed(c.white(c.bold(" ERROR "))) : c.bgYellow(c.black(c.bold(" WARN  ")));
    lines.push(
      ` ${badge}  ${f.ruleId}  ${(locations[i2] ?? "").padEnd(width)}   ${f.message}`
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
function plural(n, word3) {
  return `${n} ${word3}${n === 1 ? "" : "s"}`;
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
  ).option("--summary <file>", "append a Markdown report (GitHub Job Summary)").action((flags2) => {
    exitCode = check2(flags2, io);
  });
  program2.command("install").description("install git hooks or agent hooks").option(
    "--pre-commit",
    "run `check --staged` on every commit (installed as a commit-msg hook)"
  ).option(
    "--agent <name>",
    "add agent hooks to its settings (claude-code, codex, gemini)"
  ).option("-y, --yes", "write agent settings without asking").action(async (flags2) => {
    exitCode = await install(flags2, io);
  });
  program2.command("hook").description("run as an agent hook (hook JSON on stdin)").argument("<agent>", "claude-code | codex | gemini").argument("<event>", "pre-tool-use | stop").action(async (agent, event) => {
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
function check2(flags2, io) {
  const mode = flags2.base !== void 0 ? { kind: "base", ref: flags2.base } : flags2.staged ? { kind: "staged" } : { kind: "worktree" };
  try {
    const report = runCheck({ cwd: io.cwd, mode, rules: flags2.rules });
    const hasError = report.findings.some((f) => f.severity === "error");
    if (flags2.messageFile !== void 0) {
      const message = readFileSync9(resolve8(io.cwd, flags2.messageFile), "utf8");
      report.approval = findApproval(message);
    }
    if (flags2.summary !== void 0) {
      appendFileSync(resolve8(io.cwd, flags2.summary), formatMarkdown(report));
    }
    io.stdout(
      flags2.json ? formatJson(report, package_default.version) : formatText(report, package_default.version, (0, import_picocolors.createColors)(io.color ?? false))
    );
    if (!hasError || report.approval !== void 0) return 0;
    if (flags2.messageFile !== void 0 && !flags2.json) {
      io.stdout(
        "If this change is intentional, add a commit message trailer:\n  Test-Guard-Approved: <reason>\n"
      );
    }
    return 1;
  } catch (error) {
    return fail(error, io);
  }
}
async function install(flags2, io) {
  if (!flags2.preCommit && flags2.agent === void 0) {
    io.stderr(
      "test-guard: nothing to install (use --pre-commit or --agent <claude-code|codex|gemini>)\n"
    );
    return 2;
  }
  try {
    if (flags2.preCommit) {
      const { path, updated } = installGitHook(io.cwd);
      io.stdout(
        `${updated ? "Updated" : "Installed"} commit-msg hook: ${path}
`
      );
    }
    if (flags2.agent !== void 0) {
      const agent = flags2.agent;
      if (!AGENTS.includes(agent)) {
        throw new InstallError(
          `unsupported agent: ${flags2.agent} (supported: ${AGENTS.join(", ")})`
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
      const ok = flags2.yes || (await io.confirm?.("Write these changes? [y/N] ") ?? false);
      if (!ok) {
        io.stdout("Not written. Re-run with --yes to write without asking.\n");
        return 1;
      }
      mkdirSync3(dirname4(plan.path), { recursive: true });
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
  const run2 = agent === "claude-code" ? runClaudeCodeHook : agent === "codex" ? runCodexHook : agent === "gemini" ? runGeminiHook : null;
  if (!run2 || !["pre-tool-use", "stop"].includes(event)) {
    io.stdout(notifyUser(`test-guard: unsupported hook "${agent} ${event}"`));
    return 0;
  }
  io.stdout(run2(await io.readStdin?.() ?? ""));
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
