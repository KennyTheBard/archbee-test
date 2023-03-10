

set userId to a number and filepath to point to a file

```bash
curl --location --request POST 'http://localhost:3000/upload' \
--header 'Authorization: userId' \
--header 'Content-Type: multipart/form-data' \
--form 'file=@"filepath"
```