class CustomersController < ApplicationController

  before_action :authenticate_customer!, only: [ :edit, :destroy]
  def index
    @customers = Customer.all

  end

  def new
    #display a form that passes customer params to the create route
  end

  def create
    @customer = Customer.new(params[:customer])
    if @customer.save
      sign_in(:customer, @customer)
      render json: {location: customer_path(@customer)}
    else
      @errors = @customer.errors.full_messages
      render json: {location: new_customer_path, status: :unprocessable_entity }
    end
  end

  def show
    @customer = Customer.find(params[:id])
  end

  def edit
    @customer = Customer.find(params[:id])
    render json: { location: edit_customer_path(@customer) }
  end

  def update
    p params
    @customer = Customer.find(params[:id])
    if @customer.update(customer_params)
      render json: { location: customer_path(@customer)}
    else
      render json: { location: edit_customer_path(@customer), status: :unprocessable_entity}
    end
  end

  def destroy
    @customer = Customer.find(params[:id])
    @customer.destroy
    render json: { location: root_path }
  end

  private
    def customer_params
      params.require(:customer).permit(:id, :first_name, :last_name, :password, :email)
    end

end
