from django.core.management.base import BaseCommand
from core.models import User, Product, Customer, Order, AuditTrail, SystemUpdate
from django.utils import timezone
from datetime import datetime


class Command(BaseCommand):
    help = 'Seed the database with initial data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # Users
        admin_user, _ = User.objects.get_or_create(
            username='leonskennedy',
            defaults={
                'first_name': 'Leon', 'middle_name': 'S', 'last_name': 'Kennedy',
                'email': 'leonsken@gmail.com', 'contact_number': '09244573319',
                'role': 'IT Administrator', 'is_staff': True, 'is_superuser': True
            }
        )
        admin_user.set_password('admin123')
        admin_user.save()

        admin_user_2, _ = User.objects.get_or_create(
            username='admin',
            defaults={
                'first_name': 'System', 'middle_name': 'IT', 'last_name': 'Admin',
                'email': 'admin@espringrocks.com', 'contact_number': '09000000000',
                'role': 'IT Administrator', 'is_staff': True, 'is_superuser': True
            }
        )
        admin_user_2.set_password('admin123')
        admin_user_2.save()

        matt, _ = User.objects.get_or_create(
            username='matt100t',
            defaults={
                'first_name': 'Matthew', 'middle_name': 'T', 'last_name': 'Panganiban',
                'email': '100thew@gmail.com', 'contact_number': '09647555232', 'role': 'Employee'
            }
        )
        matt.set_password('employee123')
        matt.save()

        emp_user_2, _ = User.objects.get_or_create(
            username='EMP-1',
            defaults={
                'first_name': 'Employee', 'middle_name': 'One', 'last_name': 'Active',
                'email': 'emp1@espringrocks.com', 'contact_number': '09111111111',
                'role': 'Employee'
            }
        )
        emp_user_2.set_password('employee123')
        emp_user_2.save()

        User.objects.get_or_create(
            username='amandasanchez',
            defaults={
                'first_name': 'Amanda', 'middle_name': 'C', 'last_name': 'Sanchez',
                'email': 'amsanchz@gmail.com', 'contact_number': '09887693242', 'role': 'Employee'
            }
        )

        User.objects.get_or_create(
            username='quirins',
            defaults={
                'first_name': 'Ruel', 'middle_name': 'M', 'last_name': 'Quirino',
                'email': 'ruelemque@gmail.com', 'contact_number': '09324457177', 'role': 'Employee'
            }
        )

        # Products
        products_data = [
            {'code': 'S1', 'name': 'Sand 1', 'aggregate_type': 'Sand', 'base_price': 550},
            {'code': 'G1', 'name': 'Gravel 1', 'aggregate_type': 'Gravel', 'base_price': 500},
            {'code': '3/4', 'name': '3/4 Gravel', 'aggregate_type': 'Gravel', 'base_price': 500},
            {'code': 'Rivermix', 'name': 'Rivermix', 'aggregate_type': 'Mixed', 'base_price': 410},
            {'code': 'Finesand', 'name': 'Fine Sand', 'aggregate_type': 'Sand', 'base_price': 500},
            {'code': 'FineMix', 'name': 'Fine Mix', 'aggregate_type': 'Mixed', 'base_price': 500},
        ]
        for p in products_data:
            Product.objects.get_or_create(code=p['code'], defaults=p)

        # Customers
        arm_asia, _ = Customer.objects.get_or_create(
            plate_number='NBK 9757',
            defaults={
                'hauler_name': 'ARM ASIA', 'location': 'Bauang',
                'address': 'Central East, Bauang, La Union, Philippines',
                'length': 3.1, 'width': 1.6,
                'contact_person': 'Jairus D. Marcos', 'contact_number': '09347863291',
                'email': 'armasia@gmail.com'
            }
        )

        argealis, _ = Customer.objects.get_or_create(
            plate_number='ZDL 593',
            defaults={
                'hauler_name': 'ARGEALIS', 'location': 'Bauang',
                'address': 'Bauang, La Union, Philippines',
                'length': 3.05, 'width': 1.6,
                'contact_person': 'Contact Person', 'contact_number': '09000000000',
                'email': 'argealis@gmail.com'
            }
        )

        Customer.objects.get_or_create(
            plate_number='AAA 1234',
            defaults={
                'hauler_name': 'PENDING HAULER CORP', 'location': 'San Fernando',
                'address': 'San Fernando, La Union, Philippines',
                'length': 3.20, 'width': 1.7,
                'contact_person': 'Juan Dela Cruz', 'contact_number': '09123456789',
                'email': 'pending@hauler.com', 'approval_status': 'Pending'
            }
        )

        # Orders
        gravel = Product.objects.get(code='3/4')
        finemix = Product.objects.get(code='FineMix')
        s1 = Product.objects.get(code='S1')

        Order.objects.get_or_create(
            gate_pass='35539',
            defaults={'customer': arm_asia, 'product': gravel, 'amount': 1.46,
                      'status': 'Paid', 'is_onsite': True, 'processed_by': matt}
        )
        Order.objects.get_or_create(
            gate_pass='35540',
            defaults={'customer': arm_asia, 'product': finemix, 'amount': 1.0,
                      'status': 'Paid', 'is_onsite': True, 'processed_by': matt}
        )
        Order.objects.get_or_create(
            gate_pass='35401',
            defaults={'customer': argealis, 'product': s1, 'amount': 1.3,
                      'status': 'Pending', 'is_onsite': True, 'processed_by': matt}
        )

        # Audit Trail
        AuditTrail.objects.get_or_create(action='Login', user=matt)
        AuditTrail.objects.get_or_create(action='Processed order #1991', user=matt)

        # System Update
        SystemUpdate.objects.get_or_create(
            update_log='[ORDERS] Price for S1, G2, and 3/4 Gravel has been updated'
        )

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
        self.stdout.write('Admin credentials: leonskennedy / admin123')
        self.stdout.write('Employee credentials: matt100t / employee123')
