import {
  Environment,
  Network,
  RecordSource,
  Store,
  RequestParameters,
  QueryResponseCache,
  Variables,
  GraphQLResponse,
  CacheConfig,
} from 'relay-runtime';

const HTTP_ENDPOINT = 'https://api.github.com/graphql';
const IS_SERVER = typeof window === typeof undefined;
const CACHE_TTL = 5 * 1000;

async function networkFetch(
  request: RequestParameters,
  variables: Variables,
): Promise<GraphQLResponse> {
  const token = process.env.NEXT_PUBLIC_REACT_APP_GITHUB_AUTH_TOKEN;
  if (!token) {
    throw new Error(
      'Github 토큰이 필요합니다. (환경변수 설정 => .env파일 내 NEXT_PUBLIC_REACT_APP_GITHUB_AUTH_TOKEN=<Token> 설정)',
    );
  }

  const response = await fetch(HTTP_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: request.text,
      variables,
    }),
  });
  const json = await response.json();
  if (Array.isArray(json.errors)) {
    throw new Error(`Network요청 오류 ${JSON.stringify(json.errors)}`);
  }

  return json;
}

export const responseCache: QueryResponseCache | null = IS_SERVER
  ? null
  : new QueryResponseCache({
      size: 100,
      ttl: CACHE_TTL,
    });

function createNetwork() {
  const fetchResponse = (
    params: RequestParameters,
    variables: Variables,
    cacheConfig: CacheConfig,
  ) => {
    const isQuery = params.operationKind === 'query';
    const cacheKey = params.id ?? params.cacheID;
    const forceFetch = cacheConfig && cacheConfig.force;

    if (responseCache != null && isQuery && !forceFetch) {
      const fromCache = responseCache.get(cacheKey, variables);
      if (fromCache != null) {
        return Promise.resolve(fromCache);
      }
    }

    return networkFetch(params, variables);
  };

  const network = Network.create(fetchResponse);
  return network;
}

function createEnvironment() {
  return new Environment({
    network: createNetwork(),
    store: new Store(RecordSource.create()),
    isServer: IS_SERVER,
  });
}

const environment = createEnvironment();

function getCurrentEnvironment() {
  if (IS_SERVER) {
    return createEnvironment();
  }

  return environment;
}

export { networkFetch, environment, getCurrentEnvironment };
