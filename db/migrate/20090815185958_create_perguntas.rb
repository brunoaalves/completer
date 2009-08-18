class CreatePerguntas < ActiveRecord::Migration
  def self.up
    create_table :perguntas do |t|
      t.string :titulo
      t.string :dica

      t.timestamps
    end
  end

  def self.down
    drop_table :perguntas
  end
end
