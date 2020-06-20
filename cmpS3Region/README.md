# S3 각 리젼 속도 측정
서울에서 AWS 15개의 리젼으로 1KB, 10KB, 1MB, 10MB 크기의 파일을 S3에 put, get, delete 했을 때 발생하는 각각의 latency를 milliseconds 단위로 측정하는 프로젝트입니다.

해당 프로젝트는 node.js로 작성되었고, 콘솔 창에서 실행되는 콘솔 프로그램입니다.


## 설치 방법
npm install


## 사용 방법 (Usage)
1. awsconfig.json 파일에 자신의 access key와 secret key를 작성합니다.
2. file 폴더 안에 1KB, 10KB, 1MB, 10MB라는 이름으로 파일을 각각 작성합니다.
3. 콘솔 창에서 node app을 통해 실행합니다.
4. 테스트 가능한 리젼 리스트를 참고하여 테스트 하고자 하는 리젼을 입력합니다.
5. 해당 리젼으로 1KB, 10KB, 1MB, 10MB를 각각 10번씩 put, get, delete하여 각 operation 별로 평균을 낸 결과를 출력합니다.
    또한, 파일에 대해 put, get, delete하기를 실패한 횟수인 errCnt를 출력합니다.

 만일 S3에 각 리젼 별로 버킷이 생성되어 있지 않다면 app.js의 18-24 line의 주석을 풀고 s3.js 파일에서 Bucket을 검색 후 원하는 이름으로 바꾼 뒤 node app을 통해 한 번만(한 번 실행 후 다시 주석처리) 실행합니다.
