class PerguntasController < ApplicationController
  # GET /perguntas
  # GET /perguntas.xml
  def index
    if params[:q]
      @perguntas = Pergunta.find(:all, :conditions => ['titulo like ?', "%#{params[:q]}%"])
    else
      @perguntas = Pergunta.all
    end
    
    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => @perguntas }
      format.xml  { render :xml => @perguntas }
    end
  end

  # GET /perguntas/1
  # GET /perguntas/1.xml
  def show
    @pergunta = Pergunta.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @pergunta }
    end
  end

  # GET /perguntas/new
  # GET /perguntas/new.xml
  def new
    @pergunta = Pergunta.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @pergunta }
    end
  end

  # GET /perguntas/1/edit
  def edit
    @pergunta = Pergunta.find(params[:id])
  end

  # POST /perguntas
  # POST /perguntas.xml
  def create
    @pergunta = Pergunta.new(params[:pergunta])

    respond_to do |format|
      if @pergunta.save
        flash[:notice] = 'Pergunta was successfully created.'
        format.html { redirect_to(@pergunta) }
        format.xml  { render :xml => @pergunta, :status => :created, :location => @pergunta }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @pergunta.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /perguntas/1
  # PUT /perguntas/1.xml
  def update
    @pergunta = Pergunta.find(params[:id])

    respond_to do |format|
      if @pergunta.update_attributes(params[:pergunta])
        flash[:notice] = 'Pergunta was successfully updated.'
        format.html { redirect_to(@pergunta) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @pergunta.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /perguntas/1
  # DELETE /perguntas/1.xml
  def destroy
    @pergunta = Pergunta.find(params[:id])
    @pergunta.destroy

    respond_to do |format|
      format.html { redirect_to(perguntas_url) }
      format.xml  { head :ok }
    end
  end
end
