import armasm from "highlight.js/lib/languages/armasm";
import avrasm from "highlight.js/lib/languages/avrasm";
import cmake from "highlight.js/lib/languages/cmake";
import latex from "highlight.js/lib/languages/latex";
import matlab from "highlight.js/lib/languages/matlab";
import powershell from "highlight.js/lib/languages/powershell";
import tcl from "highlight.js/lib/languages/tcl";
import verilog from "highlight.js/lib/languages/verilog";
import vhdl from "highlight.js/lib/languages/vhdl";
import x86asm from "highlight.js/lib/languages/x86asm";
import { common } from "lowlight";

export const blogCodeLanguages = {
  ...common,
  armasm,
  avrasm,
  cmake,
  latex,
  matlab,
  powershell,
  tcl,
  verilog,
  vhdl,
  x86asm,
};

export const blogCodeLanguageAliases = {
  armasm: ["arm"],
  avrasm: ["avr"],
  cmake: ["cmake.in"],
  latex: ["tex"],
  matlab: ["m"],
  powershell: ["pwsh", "ps", "ps1"],
  shell: ["console", "shellsession", "terminal"],
  tcl: ["tk", "xdc", "sdc", "qsf"],
  verilog: ["v", "sv", "svh", "systemverilog"],
  vhdl: ["vhd"],
  x86asm: ["asm", "nasm"],
};
