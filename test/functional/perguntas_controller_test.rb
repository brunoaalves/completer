require 'test_helper'

class PerguntasControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:perguntas)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create pergunta" do
    assert_difference('Pergunta.count') do
      post :create, :pergunta => { }
    end

    assert_redirected_to pergunta_path(assigns(:pergunta))
  end

  test "should show pergunta" do
    get :show, :id => perguntas(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => perguntas(:one).to_param
    assert_response :success
  end

  test "should update pergunta" do
    put :update, :id => perguntas(:one).to_param, :pergunta => { }
    assert_redirected_to pergunta_path(assigns(:pergunta))
  end

  test "should destroy pergunta" do
    assert_difference('Pergunta.count', -1) do
      delete :destroy, :id => perguntas(:one).to_param
    end

    assert_redirected_to perguntas_path
  end
end
