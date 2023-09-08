<h1 align="center">package-analyser</h1>

<div align="center">

![Static Badge](https://img.shields.io/badge/bulid-experimental-orange)
[![NPM version][npm-image]][npm-url]

[npm-image]: https://badge.fury.io/js/package-analyser.svg
[npm-url]: https://www.npmjs.com/package/package-analyser

![Static Badge](https://img.shields.io/badge/size-94.6KB-blue)
![GitHub repo size](https://img.shields.io/github/repo-size/Jackson-Mseven/package-analyser)

![Static Badge](https://img.shields.io/badge/license-MIT-yellow)
</div>

## Introduction

package-analyser is a simple and easy-to-use NodeJS command-line tool for analyzing dependencies and dependency sizes.

It provides the following features:

1.  Analyzing dependencies in production and development environments.
2.  Analyzing dependency sizes in the production environment.
3.  Detecting and displaying circular dependencies in the current project.
4.  Visualizing dependency relationships in 2D and 3D:
    -   Supports searching for a specific dependency and locating it.
    -   Supports displaying dependencies as straight lines or curves.
5.  Visualizing dependency sizes with charts.
6.  Supports both light and dark modes.
7.  Supports displaying results on a webpage or exporting them as JSON files.

## README.md
- en [English](README.md)
- zh_CN [中文](README.zh_CN.md)

## Installation

```bash
npm i package-analyser -g
```

>  Note:
>
>  Since package-analyser is a command-line tool, it needs to be installed globally.

## Usage

### Backend Usage

```bash
/**
 * @param {number} depth: The depth of dependencies (integer or Infinity).
 * @param {string} jsonFile: The path to the output JSON file (relative to the current directory).
 */
analyze-cli analyze [depth] [jsonFile]
```

### Dependency Graph Usage
#### 2D
<div align="center">

|   Action   |   Effect   |
|   :----:   |   :----:   |
| Left-click on a node  | Drag the node. |
| Left-click on the canvas  | Pan the view. |
| Double-click on the canvas  | Zoom in the view. |
| Double-click on a node in the sidebar  | Jump to the node. |
| Scroll the mouse wheel  | Zoom in or out the view. |

</div>

#### 3D
<div align="center">

|   Action   |   Effect   |
|   :----:   |   :----:   |
| Left-click on the canvas  | Rotate the view. |
| Left-click/Right-click on a node  | Drag the node. |
| Right-click on the canvas  | Pan the view. |
| Scroll the mouse wheel  | Zoom the view. |

</div>

## Note
If the data in the localStorage is manually deleted and cannot be displayed correctly, please delete the "time.txt" file in the project root directory and run the command again.