
Krossover Intelligence Web Client
=================================

This is the Krossover Intelligence web client. It is the front end for the
Krossover Intelligence product.

## Build Status
### master branch
[ ![Codeship Status for krossoverintelligence/intelligence-web-client](https://www.codeship.io/projects/976f2ba0-6b3e-0131-6c18-16513a5a3791/status?branch=master)](https://www.codeship.io/projects/12988)

### QA branch
[ ![Codeship Status for krossoverintelligence/intelligence-web-client](https://www.codeship.io/projects/976f2ba0-6b3e-0131-6c18-16513a5a3791/status?branch=qa)](https://www.codeship.io/projects/12988)

# Getting Started with the web client

Also available online:
https://docs.google.com/document/d/1Nx-BRUx-r_y3z_Qg_5OtMCq3fJYyjItXDdt5c-LKL5w/pub

## Clone this repository

```
git clone https://bitbucket.org/krossoverintelligence/intelligence-web-client
```

## Install NVM, the Node Version Manager

### In BASH shell:

```
curl https://raw.github.com/creationix/nvm/master/install.sh | sh
```

or:

```
wget -qO- https://raw.github.com/creationix/nvm/master/install.sh | sh
```

### Manual installation:

```
git clone https://github.com/creationix/nvm.git ~/.nvm
source ~/.nvm/nvm.sh
```

_NVM should be sourced in every environment you want to run node and grunt in_

## Install node

This will install Node.js and NPM (the Node.js package manager)

```
nvm install 4
```

## Set default node version

```
nvm alias default 4
```

## Install NPM

```
npm install -g npm@3
```

## Login to NPM

```
npm login
```

## Install grunt

```
npm install -g grunt-cli
```

## Install dependencies

```
cd intelligence-web-client
npm install
```

This will install all of the local Node.js dependencies, development
dependencies, component dependencies, and vendor dependencies.

# Build Setup

Also available online:
https://docs.google.com/document/d/1H1N3a0ju6pfSagnHzCoSkgjKKDye0HZPpE-BX-oBGWg/pub

## Default task
To install dependencies, build them, serve the client locally and then watch for
changes; type:

```
#> grunt
```

## Tasks

There are also specific tasks for:

### Installing dependencies
```
#> grunt install
```

### Linting (CSS, LESS and Javascript)
```
#> grunt lint
```

### Minifiing (CSS and Javascript)
```
#> grunt min
```

### Generating documentation
```
#> grunt doc
```

### Serving the client locally
```
#> grunt serve
```
This will serve from ```localhost``` over **HTTPS** on port ```8000```. You can
access it at
[https://localhost:8000/intelligence](https://localhost:8000/intelligence) and
also over the LAN from other computers by using your IP or DNS name.

### Watching for changes
If you want to watch for file changes; type:
```
#> grunt watch
```
When a file is changed it will trigger the appropriate linter and create
a development build. For Javascript files it will also run tests. If the linters
and tests pass it will automatically refresh the browser with the new build.

### Running tests
To test; type:
```
#> grunt test
```

## Builds

To target specific builds you can use:
```
#> grunt dev
#> grunt prod
```
This will build either a development or production build respectively and in
their respective directories. The difference is the development build does not
minify the output.

## Distributing

To package the production build up and version it for distribution use:
```
#> grunt dist
```
This will create a versioned zip file in the ```dist``` directory. The
version coresponds to the version number in the package.json file.

