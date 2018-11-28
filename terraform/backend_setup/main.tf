resource "aws_s3_bucket" "terraform" {
  bucket = "openoakland.woeip.terraform"

  tags {
    Name = "woeip Terraform State Store"
  }

  versioning {
    enabled = true
  }
}

resource "aws_dynamodb_table" "terraform" {
  name           = "terraform_woeip"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
