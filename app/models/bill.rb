class Bill < ActiveRecord::Base
  has_one :seating
  has_many :orders
  has_many :transactions
  has_many :customers, through: :transactions
  has_one :merchant, through: :seating
  has_many :items, through: :orders

  def total
    total = 0
    self.items.each do |item|
      price = item.converted_price
      total += price # returns total in number of cents
    end
    return total
  end

def merchant_name
  self.merchant.business_name if self.merchant
end

def seating_id
  self.seating.id if self.seating
end

def paid?
  total == transactions{ |sum, n| sum + n.amount }
end



end

