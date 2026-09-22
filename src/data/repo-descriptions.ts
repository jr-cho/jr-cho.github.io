// One-line descriptions for the GitHub section, written from each repo's
// code. They replace the description on GitHub when present. A repo with
// no entry here falls back to its GitHub description.
export const repoDescriptions: Record<string, string> = {
  "XRP-IEEE-Code":
    "Obstacle-avoiding rover for the XRP robot in MicroPython. A non-blocking state machine reads the rangefinder every tick, holds heading with the IMU, and tracks position by odometry.",
  "bump-arena-allocator":
    "A bump (arena) allocator in C11. Each allocation is a pointer add from a caller-supplied block, and one reset frees everything at once.",
  PRNTSWRM:
    "PrintSwarm: a FastAPI service that dispatches print jobs across a mixed 3D printer fleet, driving OctoPrint, Bambu Lab, and Elegoo SDCP printers through one interface.",
  SAT: "Runs cppcheck, Flawfinder, gcc -fanalyzer, and Coverity on C code, merges their findings into one model, correlates overlaps across tools, and scores them in a single report.",
  envtherm:
    "Python simulation of how building envelope materials change cooling loads in small data centers, using steady-state heat transfer with NumPy, Pandas, and Matplotlib.",
  "Fraud-Detection-Network":
    "Finds fraud rings in a graph of money transfers, in C. Compares brute-force cycle search with Tarjan's linear-time strongly connected components.",
  LocalBin:
    "Multithreaded TCP file-sharing server in C with authenticated clients, directory management, and transfer metrics, driven from a Python CLI through FFI.",
  cman: "A Cargo-inspired project manager for C, written in Bash. Scaffolds, builds, tests, and formats standard, embedded ARM, and minimal projects from one TOML config.",
  "CV-Color-Tracker":
    "OpenCV color tracker prototyped for SoutheastCon 2026. Masks a live camera feed in HSV and boxes the largest blue target to spot task-complete LEDs.",
  "Basic-Neural-Network":
    "A small feedforward neural network written from scratch in C, with its own neuron and layer structures and forward propagation.",
};
