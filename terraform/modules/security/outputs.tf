output "bastion_sg_id" { value = aws_security_group.bastion.id }
output "web_sg_id"     { value = aws_security_group.web.id }
output "backend_sg_id" { value = aws_security_group.backend.id }
output "db_sg_id"      { value = aws_security_group.db.id }