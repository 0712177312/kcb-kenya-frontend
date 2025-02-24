package com.compulynx.compas.models.roles_authorities;

import com.compulynx.compas.models.User;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Collection;

@Entity(name = "roles")
public class RoleEntity implements Serializable {

  private static final long serialVersionUID = 1L;

  public RoleEntity(String name) {
    this.name = name;
  }

  public RoleEntity() {
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Column(nullable = false, length = 20)
  private String name;

  @ManyToMany(mappedBy = "roles")
  private Collection<User> users;

  @ManyToMany(
      cascade = {CascadeType.PERSIST},
      fetch = FetchType.EAGER)
  @JoinTable(
      name = "roles_authorities",
      joinColumns = @JoinColumn(name = "roles_id", referencedColumnName = "id"),
      inverseJoinColumns = @JoinColumn(name = "authorities_id", referencedColumnName = "id"))
  private Collection<AuthorityEntity> authorities;



  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Collection<User> getUsers() {
    return users;
  }

  public void setUsers(Collection<User> users) {
    this.users = users;
  }

  public Collection<AuthorityEntity> getAuthorities() {
    return authorities;
  }

  public void setAuthorities(Collection<AuthorityEntity> authorities) {
    this.authorities = authorities;
  }
}
