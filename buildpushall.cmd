REM docker login

docker build -t stiller/tweeteranalyzerdemo_reader:v1 .\reader
docker build -t stiller/tweeteranalyzerdemo_analyzer:v1 .\analyzer
docker build -t stiller/tweeteranalyzerdemo_aggregator:v2 .\aggregator
docker build -t stiller/tweeteranalyzerdemo_result:v2 .\result

docker push stiller/tweeteranalyzerdemo_reader:v1
docker push stiller/tweeteranalyzerdemo_analyzer:v1
docker push stiller/tweeteranalyzerdemo_aggregator:v2
docker push stiller/tweeteranalyzerdemo_result:v2