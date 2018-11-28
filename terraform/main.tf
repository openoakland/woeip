// NOTE: These should be in terraform.tfvars, which should be kept secret.

variable "db_username" {}
variable "db_password" {}
variable "secret_key" {}
variable "domain" {}

module "dns" "dns" {
  source = "./dns"
  domain = "${var.domain}"
}

// Create the Elastic Beanstalk application and environment, along with a database
module "application_cluster" "cluster" {
  source = "./application_cluster"

  application_name = "woeip"
  db_name          = "woeip"
  environment      = "production"
  db_username      = "${var.db_username}"
  db_password      = "${var.db_password}"
  route_53_zone_id = "${module.dns.zone_id}"
  secret_key       = "${var.secret_key}"
  ssl_cert_arn     = "${module.dns.cert_arn}"
}
