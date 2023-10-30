class BankAccount:

  def __init__(self, acc_no, acc_holder, inital_bal=0.0):
    self.acc_no = acc_no
    self.acc_holder = acc_holder
    self.acc_balance = inital_bal

  def deposit(self, amount):
    if (amount > 0):
      self.acc_balance += amount
      print("Deposited Rs.", amount, "New Balance Rs.", self.acc_balance)
    else:
      print("***Invalid deposit amount***")

  def withdraw(self, amount):
    if amount > 0 and amount <= self.acc_balance:
      self.acc_balance -= amount
      print("Withdraw Rs.", amount, "New Balance Rs.", self.acc_balance)
    else:
      print("***Insufficent Balance OR Invalid withdraw amount***")

  def balance(self, amount):
    print("Account HolderName:", self.acc_holder, "Account Number:",
          self.acc_no, "Account Balance Rs:", self.acc_balance)


Account = BankAccount(123342, "sakthi", 1000)
Account.deposit(10000)
Account.withdraw(5000)
Account.balance()
