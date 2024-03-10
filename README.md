# Project Name

> A state handler for react and react native using the package `react-redux`

## Prerequisites

This project requires NodeJS (version 8 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
6.4.1
v8.16.0
```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Installation

Start with installing @reduxjs/toolkit and react-redux to be use by the package:

```sh
$ npm install @reduxjs/toolkit react-redux
```

Or if you prefer using Yarn:

```sh
$ yarn add @reduxjs/toolkit react-redux
```

To install package:

```sh
$ npm install redux-meta
```

Or if you prefer using Yarn:

```sh
$ yarn add redux-meta
```

## Usage

### ReduxMeta

```js
const reduxMeta = new ReduxMeta()
```

#### Modules

Modules can be an object or an array to register multiple modules at once. 

`metaModule`

| Type | Required | Description |
| --- | --- | --- |
| boolean | true | Redux meta module |

`name`

| Type | Required | Description |
| --- | --- | --- |
| string | true | Name of the module |

`metaStates`

| Type | Required | Description |
| --- | --- | --- |
| object | true | States will be initialize here |

`metaMutations`

| Type | Required | Description |
| --- | --- | --- |
| object | true | Inside this are the functions that will mutate the states |

`metaActions`

| Type | Required | Description |
| --- | --- | --- |
| object | true | Inside this are the functions that will interact with metaMutations |

Module example for user:

```js
{
  metaModule: true,
  name: 'user',

  metaStates: {
    name: '',
    address: ''
  },

  metaMutations: {
    SET_NAME: (state, { payload }) => {
      state.name = payload
    }
  },

  metaActions: {
    getAUser ({ commit }, params) {
      const name = 'John Doe'
      
      commit('SET_NAME', name)
    }
  }
}
```

Supported class fucntions are listed below.

#### Functions

`registerModules`

This will initialize the states, mutations and actions insdie the module to be easily use in different components.

`delay`

| Type | Default value | Description |
| --- | --- | --- |
| number | 0 | Time in milliseconds |

If present, the request will be delayed by the given amount of time

Example:

```tsx
type Joke = {
  value: {
    id: number;
    joke: string;
  };
};

const MyComponent: React.FC = () => {
  const { data, error, loading } = useBasicFetch<Joke>('https://api.icndb.com/jokes/random', 2000);

  if (error) {
    return <p>Error</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <h2>Chuck Norris Joke of the day</h2>
      {data && data.value && <p>{data.value.joke}</p>}
    </div>
  );
};
```

### fetchData

```js
fetchData(url: string)
```

Perform an asynchronous http request against a given url

```tsx
type Joke = {
  value: {
    id: number;
    joke: string;
  };
};

const ChuckNorrisJokes: React.FC = () => {
  const { data, fetchData, error, loading } = useBasicFetch<Joke>();
  const [jokeId, setJokeId] = useState(1);

  useEffect(() => {
    fetchData(`https://api.icndb.com/jokes/${jokeId}`);
  }, [jokeId, fetchData]);

  const handleNext = () => setJokeId(jokeId + 1);

  if (error) {
    return <p>Error</p>;
  }

  const jokeData = data && data.value;

  return (
    <div className="Comments">
      {loading && <p>Loading...</p>}
      {!loading && jokeData && (
        <div>
          <p>Joke ID: {jokeData.id}</p>
          <p>{jokeData.joke}</p>
        </div>
      )}
      {!loading && jokeData && !jokeData.joke && <p>{jokeData}</p>}
      <button disabled={loading} onClick={handleNext}>
        Next Joke
      </button>
    </div>
  );
};
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Add your changes: `git add .`
4.  Commit your changes: `git commit -am 'Add some feature'`
5.  Push to the branch: `git push origin my-new-feature`
6.  Submit a pull request :sunglasses:

## Credits

TODO: Write credits

## Built With

* Dropwizard - Bla bla bla
* Maven - Maybe
* Atom - ergaerga
* Love

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

* **John Doe** - *Initial work* - [JohnDoe](https://github.com/JohnDoe)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

[MIT License](https://andreasonny.mit-license.org/2019) © Andrea SonnY