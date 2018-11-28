variable "domain" {}

// Create a DNS zone for the application's domain
resource "aws_route53_zone" "zone" {
  name = "${var.domain}"
}

// Create an SSL/TLS certificate for the domain
resource "aws_acm_certificate" "cert" {
  domain_name       = "${var.domain}"
  validation_method = "DNS"
}

// Configure a DNS record for certificate verification
resource "aws_route53_record" "cert_validation" {
  name    = "${aws_acm_certificate.cert.domain_validation_options.0.resource_record_name}"
  type    = "${aws_acm_certificate.cert.domain_validation_options.0.resource_record_type}"
  zone_id = "${aws_route53_zone.zone.id}"
  records = ["${aws_acm_certificate.cert.domain_validation_options.0.resource_record_value}"]
  ttl     = 60
}

// Complete certificate verification
resource "aws_acm_certificate_validation" "cert" {
  certificate_arn         = "${aws_acm_certificate.cert.arn}"
  validation_record_fqdns = ["${aws_route53_record.cert_validation.fqdn}"]
}

output "cert_arn" {
  value = "${aws_acm_certificate.cert.arn}"
}

output "zone_id" {
  value = "${aws_route53_zone.zone.id}"
}
