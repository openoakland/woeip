# NOTE: Copy this file to terraform.tfvars, and generate secrets using a random string
# generator (e.g. https://www.random.org/strings/?num=5&len=20&digits=on&upperalpha=on&loweralpha=on&unique=on&format=html&rnd=new)

# NOTE: The database username and password have contraints. We use PostgreSQL.
# See: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Limits.html#RDS_Limits.Constraints
db_username = "example"
db_password = "super-secure!"
secret_key = "abc123"
domain = "app.example.com"
