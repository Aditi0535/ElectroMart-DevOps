output "bastion_public_ip"  { value = aws_instance.bastion.public_ip }
output "web_public_ip"      { value = aws_instance.web.public_ip }
output "backend_private_ip" { value = aws_instance.backend.private_ip }
output "db_private_ip"      { value = aws_instance.db.private_ip }

output "web_private_ip" {
  value = aws_instance.web.private_ip
}

output "bastion_private_ip" {
  value = aws_instance.bastion.private_ip
}