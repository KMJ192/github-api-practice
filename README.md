# Github GQL API

### Dev

- NextJS (V14)
- Typescript
- relay
- Node version => v20.9.0

### 실행 방법

1. 노드 버전을 확인해주세요.

- v20.9.0에서 실행해주세요. 기준일(2023.11.06) LTS 버전

2. Github 토큰 추가

- 프로젝트 root 경로에 .env 파일 생성
- .env 파일 내 Github 토큰 입력

```
NEXT_PUBLIC_REACT_APP_GITHUB_AUTH_TOKEN=<Github-token>
```

3. 종속성 다운로드

```bash
yarn install
```

4. Dev모드 실행

```bash
yarn dev
```
