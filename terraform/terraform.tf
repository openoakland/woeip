terraform {
  backend "s3" {
    bucket         = "openoakland.woeip.terraform"
    key            = "terraform.tfstate"
    region         = "us-west-2"
    dynamodb_table = "terraform_woeip"
  }
}
