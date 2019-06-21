# @boston/react-experiment

> A React component to load Boston experiments and render active or inactive children.

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i -D react-experiment
```

## Usage
Please visit the [Boston app online](https://bostonapp.co/). There, you can create an account and an experiment, configure specific users who should see the experiment, or specify a percent of users who should see the experiment.

Once this is complete, copy the experiment id from the experiment card and your API key from settings (KEY and ID below). Next, include the following component in your app:

```js
import React from 'react'
import Experiment from '@boston/react-experiment'

const AlwaysBlue = () => <div>
  <Experiment apiKey="KEY" experimentId="ID">
    <Experiment.Active>
      <span red>JK, I'm red!</span>
    </Experiment.Active>
    <Experiment.Inactive>
      <span red>I'm blue! Huzzah!</span>
    </Experiment.Inactive>
  </Experiment>
</div>

export default AlwaysBlue
```

## Props

| Name          | Type          | Description                                    | Default                       |
| ------------- | ------------- | ---------------------------------------------- | ----------------------------- |
| apiKey        | string        | Boston API Key                                 |                               |
| apiUrl        | string        | Boston API Url                                 | "https://api.bostonapp.co"    |
| context       | object|string | Context used to uniquely identify a user       |                               |
| experimentId  | string        | A Boston experiment id                         |                               |
| showErrors    | bool          | Specifies whether API errors should be shown   | `false`                       |

`context` is either of type `shape`, which supports a single property, `uniqueId`, or a string. This property represents identifying information about a user and may be used to blacklist or whitelist active experiment users.

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/Joe%20Groseclose/react-experiment/issues).

## License

Copyright © 2019 []
Licensed under the MIT license.

***

_This file was generated by [readme-generator](https://github.com/jonschlinkert/readme-generator) on June 21, 2019._
